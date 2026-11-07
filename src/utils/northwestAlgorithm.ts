// src/utils/northwestAlgorithm.ts

import {
  OrientationMode,
  SolvedCell,
  AllocationStep,
  SolverResult,
} from '@/types/transportation';

/**
 * ฟังก์ชันหลักสำหรับคำนวณ North-West Corner Method
 * รองรับทั้งโหมดปกติ (Supply แนวตั้ง, Demand แนวนอน) และโหมดสลับแกน (Transposed)
 * พร้อมตรวจสอบและสร้างแถว/คอลัมน์ Dummy อัตโนมัติเมื่อผลรวมไม่สมดุล
 *
 * @param baseCosts ตารางต้นทุนตั้งต้น [supplyIdx][demandIdx]
 * @param supplyValues อาร์เรย์ค่า Supply (S_1, S_2, ..., S_m)
 * @param demandValues อาร์เรย์ค่า Demand (D_1, D_2, ..., D_n)
 * @param orientation โหมดแกนตาราง ('standard' | 'transposed')
 */
export function solveNorthWestCorner(
  baseCosts: number[][],
  supplyValues: number[],
  demandValues: number[],
  orientation: OrientationMode = 'standard'
): SolverResult {
  // 1. กรองค่าติดลบหรือ NaN ให้เป็น 0 เพื่อป้องกันบั๊กในการคำนวณ
  const cleanSupply = supplyValues.map((v) => Math.max(0, Number(v) || 0));
  const cleanDemand = demandValues.map((v) => Math.max(0, Number(v) || 0));

  const totalSupplyInput = cleanSupply.reduce((sum, val) => sum + val, 0);
  const totalDemandInput = cleanDemand.reduce((sum, val) => sum + val, 0);

  // 2. จัดเตรียมข้อมูลแถว (Row) และคอลัมน์ (Column) ตามโหมดแกน (Orientation)
  // - โหมด 'standard': แถวแนวนอน = Supply (S), คอลัมน์แนวตั้ง = Demand (D)
  // - โหมด 'transposed': แถวแนวนอน = Demand (D), คอลัมน์แนวตั้ง = Supply (S)
  let rowTotals: number[] = [];
  let colTotals: number[] = [];
  let rowLabels: string[] = [];
  let colLabels: string[] = [];
  let workingCosts: number[][] = [];

  if (orientation === 'standard') {
    rowTotals = [...cleanSupply];
    colTotals = [...cleanDemand];
    rowLabels = cleanSupply.map((_, i) => `S${i + 1}`);
    colLabels = cleanDemand.map((_, j) => `D${j + 1}`);

    workingCosts = cleanSupply.map((_, r) =>
      cleanDemand.map((__, c) => Math.max(0, Number(baseCosts[r]?.[c]) || 0))
    );
  } else {
    // สลับแกน (Transpose): Demand มาอยู่ฝั่งแถวแนวตั้งด้านซ้าย, Supply ไปอยู่ฝั่งคอลัมน์แนวนอนด้านบน
    rowTotals = [...cleanDemand];
    colTotals = [...cleanSupply];
    rowLabels = cleanDemand.map((_, i) => `D${i + 1}`);
    colLabels = cleanSupply.map((_, j) => `S${j + 1}`);

    workingCosts = cleanDemand.map((_, r) =>
      cleanSupply.map((__, c) => Math.max(0, Number(baseCosts[c]?.[r]) || 0))
    );
  }

  // 3. ตรวจสอบความสมดุลระหว่างผลรวมแถว (sumRow) กับผลรวมคอลัมน์ (sumCol) เพื่อสร้าง Dummy
  const sumRow = rowTotals.reduce((a, b) => a + b, 0);
  const sumCol = colTotals.reduce((a, b) => a + b, 0);
  const isBalanced = sumRow === sumCol;

  let dummyAdded: 'none' | 'row' | 'col' = 'none';
  let dummyAmount = 0;

  if (!isBalanced) {
    if (sumRow > sumCol) {
      // ผลรวมฝั่งแถวมากกว่าฝั่งคอลัมน์ -> ต้องเพิ่ม Dummy Column ต่อท้ายด้านขวา
      dummyAdded = 'col';
      dummyAmount = sumRow - sumCol;
      colTotals.push(dummyAmount);
      colLabels.push(orientation === 'standard' ? 'D_dummy' : 'S_dummy');

      // เติมค่า Cost = 0 ในคอลัมน์สุดท้ายของทุกแถว
      workingCosts.forEach((row) => row.push(0));
    } else {
      // ผลรวมฝั่งคอลัมน์มากกว่าฝั่งแถว -> ต้องเพิ่ม Dummy Row ต่อท้ายด้านล่าง
      dummyAdded = 'row';
      dummyAmount = sumCol - sumRow;
      rowTotals.push(dummyAmount);
      rowLabels.push(orientation === 'standard' ? 'S_dummy' : 'D_dummy');

      // เติมแถวใหม่ด้านล่างสุดด้วยค่า Cost = 0 ทุกช่อง
      workingCosts.push(new Array(colTotals.length).fill(0));
    }
  }

  const numRows = rowTotals.length;
  const numCols = colTotals.length;

  // 4. สร้างตาราง SolvedCell[][] เริ่มต้นก่อนเริ่มเดินอัลกอริทึม
  const grid: SolvedCell[][] = Array.from({ length: numRows }, (_, r) =>
    Array.from({ length: numCols }, (__, c) => {
      const isDummyRow = dummyAdded === 'row' && r === numRows - 1;
      const isDummyCol = dummyAdded === 'col' && c === numCols - 1;
      return {
        rowIdx: r,
        colIdx: c,
        cost: workingCosts[r][c],
        allocation: null,
        isAllocated: false,
        isDummy: isDummyRow || isDummyCol,
      };
    })
  );

  // 5. เดินอัลกอริทึม North-West Corner (เริ่มจากมุมซ้ายบน r = 0, c = 0)
  const remRow = [...rowTotals];
  const remCol = [...colTotals];
  const steps: AllocationStep[] = [];
  let totalCost = 0;

  let r = 0;
  let c = 0;
  let stepCounter = 1;

  const totalBalancedVolume = rowTotals.reduce((a, b) => a + b, 0);

  // เดินอัลกอริทึมเมื่อมียอดรวมมากกว่า 0 เท่านั้น
  if (totalBalancedVolume > 0) {
    while (r < numRows && c < numCols) {
      const availableRow = remRow[r];
      const availableCol = remCol[c];

      // จัดสรรปริมาณเท่ากับค่าที่น้อยกว่าระหว่าง Row และ Column ณ ช่อง (r, c)
      const allocated = Math.min(availableRow, availableCol);
      const cell = grid[r][c];

      cell.allocation = allocated;
      cell.isAllocated = true;
      cell.stepOrder = stepCounter;

      // หักลบยอดคงเหลือ
      remRow[r] -= allocated;
      remCol[c] -= allocated;

      const subTotalCost = allocated * cell.cost;
      totalCost += subTotalCost;

      // บันทึกประวัติ Step-by-Step
      steps.push({
        stepNumber: stepCounter,
        rowLabel: rowLabels[r],
        colLabel: colLabels[c],
        allocated,
        cost: cell.cost,
        subTotalCost,
        rowRemainingAfter: remRow[r],
        colRemainingAfter: remCol[c],
        isDummy: cell.isDummy,
      });

      stepCounter++;

      // ถ้าถึงช่องมุมขวาล่างสุดแล้ว ให้จบการทำงานทันที
      if (r === numRows - 1 && c === numCols - 1) {
        break;
      }

      // เงื่อนไขการเลื่อนช่อง:
      // - ถ้าฝั่งแถวหมด (remRow[r] === 0) และยังไม่ถึงแถวสุดท้าย ให้ขยับลงล่าง (r++)
      // - ถ้าฝั่งคอลัมน์หมด (remCol[c] === 0) ให้ขยับไปทางขวา (c++)
      if (remRow[r] === 0 && r < numRows - 1) {
        r++;
      } else if (remCol[c] === 0 && c < numCols - 1) {
        c++;
      } else { // กรณีทั้งคู่หมดพร้อมกัน (Degeneracy) และหนึ่งในนั้นชนขอบตารางแล้ว ให้ขยับด้านที่ยังไปต่อได้
        if (r < numRows - 1) r++;
        else c++;
      }
    }
  }

  return {
    grid,
    rowLabels,
    colLabels,
    rowTotals,
    colTotals,
    totalSupplyInput,
    totalDemandInput,
    isBalanced,
    dummyAdded,
    dummyAmount,
    steps,
    totalCost,
  };
}