// src/components/TransportationTable.tsx
'use client';

import React from 'react';
import { OrientationMode, SolverResult } from '@/types/transportation';
import MatrixCell from './MatrixCell';

interface TransportationTableProps {
  result: SolverResult;
  orientation: OrientationMode;
  showSolution: boolean;
  onCostChange: (supplyIdx: number, demandIdx: number, value: number) => void;
  onSupplyChange: (index: number, value: number) => void;
  onDemandChange: (index: number, value: number) => void;
}

export default function TransportationTable({
  result,
  orientation,
  showSolution,
  onCostChange,
  onSupplyChange,
  onDemandChange,
}: TransportationTableProps) {
  const {
    grid,
    rowLabels,
    colLabels,
    rowTotals,
    colTotals,
    totalSupplyInput,
    totalDemandInput,
    isBalanced,
    dummyAdded,
  } = result;

  // แปลงชื่อป้ายกำกับ เช่น "S1" -> ฐาน "S" ห้อย "1", หรือ "D_dummy" -> ฐาน "D" ห้อย "dummy"
  const renderSubscriptLabel = (label: string) => {
    if (label.includes('_dummy')) {
      const base = label.split('_')[0];
      return (
        <span className="text-amber-800">
          {base}
          <sub className="text-xs font-semibold ml-0.5">dummy</sub>
        </span>
      );
    }
    const base = label.charAt(0);
    const sub = label.slice(1);
    return (
      <span>
        {base}
        <sub className="text-sm font-bold ml-0.5">{sub}</sub>
      </span>
    );
  };

  // กำหนดข้อความตามแกนปัจจุบัน (Standard vs Transposed)
  const topHeaderLabel = orientation === 'standard' ? 'D' : 'S';
  const leftHeaderLabel = orientation === 'standard' ? 'S' : 'D';
  const rightTotalColumnHeader = orientation === 'standard' ? 'Supply' : 'Demand';
  const bottomTotalRowHeader = orientation === 'standard' ? 'Demand' : 'Supply';

  // ยอดรวมฝั่งแถว (มุมขวาบนของช่องขวาล่าง) และยอดรวมฝั่งคอลัมน์ (มุมซ้ายล่างของช่องขวาล่าง)
  const rawRowSum =
    orientation === 'standard' ? totalSupplyInput : totalDemandInput;
  const rawColSum =
    orientation === 'standard' ? totalDemandInput : totalSupplyInput;

  const balancedSum = Math.max(totalSupplyInput, totalDemandInput);

  // จัดการเมื่อผู้ใช้แก้ตัวเลข Cost ในตาราง (แปลงพิกัดกลับมาเป็น [supplyIdx, demandIdx] เสมอ)
  const handleCellCostUpdate = (rIdx: number, cIdx: number, newCost: number) => {
    if (orientation === 'standard') {
      onCostChange(rIdx, cIdx, newCost);
    } else {
      // โหมดสลับแกน: แถวคือ Demand (cIdx เดิม), คอลัมน์คือ Supply (rIdx เดิม)
      onCostChange(cIdx, rIdx, newCost);
    }
  };

  // จัดการเมื่อผู้ใช้แก้ตัวเลขผลรวมฝั่งขวาสุด (Row Totals)
  const handleRowTotalUpdate = (rIdx: number, val: number) => {
    if (orientation === 'standard') {
      onSupplyChange(rIdx, val);
    } else {
      onDemandChange(rIdx, val);
    }
  };

  // จัดการเมื่อผู้ใช้แก้ตัวเลขผลรวมแถวล่างสุด (Column Totals)
  const handleColTotalUpdate = (cIdx: number, val: number) => {
    if (orientation === 'standard') {
      onDemandChange(cIdx, val);
    } else {
      onSupplyChange(cIdx, val);
    }
  };

  return (
    <div className="w-full overflow-x-auto pb-4">
      <div className="inline-block min-w-full align-middle">
        <table className="border-collapse border-[3px] border-black bg-white shadow-md mx-auto">
          <thead>
            <tr>
              {/* ช่องมุมซ้ายบน: เส้นทแยงมุมแบ่ง D_i / S_i (หรือ S_i / D_i เมื่อสลับแกน) ตามรูปโจทย์ */}
              <th className="relative border-2 border-black w-32 h-20 p-0 bg-white select-none">
                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none"
                  preserveAspectRatio="none"
                >
                  <line
                    x1="0"
                    y1="0"
                    x2="100%"
                    y2="100%"
                    stroke="black"
                    strokeWidth="2"
                  />
                </svg>
                {/* ตัวอักษรด้านขวาบนของเส้นทแยงมุม */}
                <span className="absolute top-1.5 right-4 font-serif font-bold text-xl text-black">
                  {topHeaderLabel}
                  <sub className="text-xs">i</sub>
                </span>
                {/* ตัวอักษรด้านซ้ายล่างของเส้นทแยงมุม */}
                <span className="absolute bottom-1.5 left-4 font-serif font-bold text-xl text-black">
                  {leftHeaderLabel}
                  <sub className="text-xs">i</sub>
                </span>
              </th>

              {/* หัวตารางแต่ละคอลัมน์ (D1, D2, ... หรือ S1, S2, ... + Dummy) */}
              {colLabels.map((label, cIdx) => {
                const isDummyCol = dummyAdded === 'col' && cIdx === colLabels.length - 1;
                return (
                  <th
                    key={label}
                    className={`border-2 border-black w-32 h-20 px-2 font-serif font-bold text-2xl text-center select-none ${
                      isDummyCol ? 'bg-amber-50/90' : 'bg-white text-black'
                    }`}
                  >
                    {renderSubscriptLabel(label)}
                  </th>
                );
              })}

              {/* หัวคอลัมน์ขวาสุด (Supply หรือ Demand ตามแกน) */}
              <th className="border-2 border-black w-36 h-20 px-3 font-serif font-bold text-2xl text-center text-black bg-white select-none">
                {rightTotalColumnHeader}
              </th>
            </tr>
          </thead>

          <tbody>
            {/* แถวข้อมูลแต่ละแถว (S1, S2, ... หรือ D1, D2, ... + Dummy) */}
            {grid.map((rowCells, rIdx) => {
              const isDummyRow = dummyAdded === 'row' && rIdx === grid.length - 1;
              return (
                <tr key={rowLabels[rIdx]}>
                  {/* ชื่อแถวฝั่งซ้ายสุด */}
                  <td
                    className={`border-2 border-black w-32 h-24 px-2 font-serif font-bold text-2xl text-center select-none ${
                      isDummyRow ? 'bg-amber-50/90' : 'bg-white text-black'
                    }`}
                  >
                    {renderSubscriptLabel(rowLabels[rIdx])}
                  </td>

                  {/* ช่อง Cell ตารางด้านใน */}
                  {rowCells.map((cell, cIdx) => (
                    <MatrixCell
                      key={`${rIdx}-${cIdx}`}
                      cell={cell}
                      showSolution={showSolution}
                      onCostChange={(newCost) =>
                        handleCellCostUpdate(rIdx, cIdx, newCost)
                      }
                    />
                  ))}

                  {/* ช่องกรอกค่า Supply / Demand ประจำแถว (คอลัมน์ขวาสุด) */}
                  <td
                    className={`border-2 border-black w-36 h-24 p-0 text-center align-middle ${
                      isDummyRow ? 'bg-amber-50/90' : 'bg-white'
                    }`}
                  >
                    {isDummyRow ? (
                      <div
                        className="flex flex-col items-center justify-center h-full select-none"
                        title="ค่าส่วนต่างที่ระบบสร้างขึ้นอัตโนมัติเพื่อให้ตารางสมดุล"
                      >
                        <span className="font-serif font-bold text-2xl text-amber-800">
                          {rowTotals[rIdx].toLocaleString()}
                        </span>
                        <span className="text-[10px] font-sans font-semibold text-amber-600 uppercase">
                          Added Dummy
                        </span>
                      </div>
                    ) : (
                      <input
                        type="number"
                        min={0}
                        value={rowTotals[rIdx] === 0 ? 0 : rowTotals[rIdx] || ''}
                        onChange={(e) => {
                          const val =
                            e.target.value === '' ? 0 : parseFloat(e.target.value);
                          handleRowTotalUpdate(
                            rIdx,
                            isNaN(val) ? 0 : Math.max(0, val)
                          );
                        }}
                        className="w-full h-full text-center font-serif font-bold text-2xl text-black bg-transparent focus:bg-yellow-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-600 transition-colors"
                        title={`คลิกเพื่อแก้ไขค่า ${rightTotalColumnHeader} ของ ${rowLabels[rIdx]}`}
                      />
                    )}
                  </td>
                </tr>
              );
            })}

            {/* แถวล่างสุด (Demand หรือ Supply ตามแกน) */}
            <tr>
              <td className="border-2 border-black w-32 h-20 px-3 font-serif font-bold text-2xl text-center text-black bg-white select-none">
                {bottomTotalRowHeader}
              </td>

              {/* ช่องกรอกค่า Demand / Supply ประจำคอลัมน์ */}
              {colTotals.map((colTotal, cIdx) => {
                const isDummyCol =
                  dummyAdded === 'col' && cIdx === colTotals.length - 1;
                return (
                  <td
                    key={`col-total-${cIdx}`}
                    className={`border-2 border-black w-32 h-20 p-0 text-center align-middle ${
                      isDummyCol ? 'bg-amber-50/90' : 'bg-white'
                    }`}
                  >
                    {isDummyCol ? (
                      <div
                        className="flex flex-col items-center justify-center h-full select-none"
                        title="ค่าส่วนต่างที่ระบบสร้างขึ้นอัตโนมัติเพื่อให้ตารางสมดุล"
                      >
                        <span className="font-serif font-bold text-2xl text-amber-800">
                          {colTotal.toLocaleString()}
                        </span>
                        <span className="text-[10px] font-sans font-semibold text-amber-600 uppercase">
                          Added Dummy
                        </span>
                      </div>
                    ) : (
                      <input
                        type="number"
                        min={0}
                        value={colTotal === 0 ? 0 : colTotal || ''}
                        onChange={(e) => {
                          const val =
                            e.target.value === '' ? 0 : parseFloat(e.target.value);
                          handleColTotalUpdate(
                            cIdx,
                            isNaN(val) ? 0 : Math.max(0, val)
                          );
                        }}
                        className="w-full h-full text-center font-serif font-bold text-2xl text-black bg-transparent focus:bg-yellow-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-600 transition-colors"
                        title={`คลิกเพื่อแก้ไขค่า ${bottomTotalRowHeader} ของ ${colLabels[cIdx]}`}
                      />
                    )}
                  </td>
                );
              })}

              {/* ช่องมุมขวาล่างสุด: เส้นทแยงมุมแสดงผลรวม Supply / Demand (เหมือนรูปต้นฉบับ 700 / 700) */}
              <td className="relative border-2 border-black w-36 h-20 p-0 bg-white select-none">
                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none"
                  preserveAspectRatio="none"
                >
                  <line
                    x1="0"
                    y1="0"
                    x2="100%"
                    y2="100%"
                    stroke="black"
                    strokeWidth="2"
                  />
                </svg>

                {/* ตัวเลขมุมขวาบนของเส้นทแยงมุม (ผลรวมของคอลัมน์ขวาสุด) */}
                <div
                  className="absolute top-1 right-2.5 font-serif font-bold text-xl leading-none"
                  title={`ผลรวม ${rightTotalColumnHeader}`}
                >
                  {!isBalanced && rawRowSum < balancedSum ? (
                    <span className="text-amber-700">
                      <span className="line-through text-stone-400 text-sm mr-1">
                        {rawRowSum}
                      </span>
                      {balancedSum}
                    </span>
                  ) : (
                    <span className="text-black">{rawRowSum}</span>
                  )}
                </div>

                {/* ตัวเลขมุมซ้ายล่างของเส้นทแยงมุม (ผลรวมของแถวล่างสุด) */}
                <div
                  className="absolute bottom-1 left-2.5 font-serif font-bold text-xl leading-none"
                  title={`ผลรวม ${bottomTotalRowHeader}`}
                >
                  {!isBalanced && rawColSum < balancedSum ? (
                    <span className="text-amber-700">
                      {balancedSum}
                      <span className="line-through text-stone-400 text-sm ml-1">
                        {rawColSum}
                      </span>
                    </span>
                  ) : (
                    <span className="text-black">{rawColSum}</span>
                  )}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}