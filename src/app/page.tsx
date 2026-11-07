// src/app/page.tsx
'use client';

import React, { useState, useMemo } from 'react';
import { OrientationMode } from '@/types/transportation';
import { solveNorthWestCorner } from '@/utils/northwestAlgorithm';
import MatrixControls from '@/components/MatrixControls';
import TransportationTable from '@/components/TransportationTable';
import SolutionSummary from '@/components/SolutionSummary';

// ข้อมูลเริ่มต้นตามรูปโจทย์ Q2 (3 Supply Rows x 4 Demand Columns)
const INITIAL_COSTS: number[][] = [
  [5, 1, 4, 9],
  [2, 8, 6, 3],
  [3, 10, 5, 7],
];
const INITIAL_SUPPLY: number[] = [250, 150, 300];
const INITIAL_DEMAND: number[] = [150, 200, 100, 250];

export default function HomePage() {
  // State เก็บข้อมูลหลักของตาราง
  const [costs, setCosts] = useState<number[][]>(INITIAL_COSTS);
  const [supply, setSupply] = useState<number[]>(INITIAL_SUPPLY);
  const [demand, setDemand] = useState<number[]>(INITIAL_DEMAND);
  const [orientation, setOrientation] = useState<OrientationMode>('standard');
  const [showSolution, setShowSolution] = useState<boolean>(true);

  // คำนวณผลลัพธ์ North-West Corner แบบ Real-time ทุกครั้งที่ตัวเลขหรือแกนเปลี่ยน
  const result = useMemo(() => {
    return solveNorthWestCorner(costs, supply, demand, orientation);
  }, [costs, supply, demand, orientation]);

  // --- ฟังก์ชันจัดการแก้ไขค่าในตาราง ---
  const handleCostChange = (
    supplyIdx: number,
    demandIdx: number,
    value: number
  ) => {
    setCosts((prev) =>
      prev.map((row, r) =>
        r === supplyIdx
          ? row.map((cell, c) => (c === demandIdx ? value : cell))
          : row
      )
    );
  };

  const handleSupplyChange = (index: number, value: number) => {
    setSupply((prev) => prev.map((v, i) => (i === index ? value : v)));
  };

  const handleDemandChange = (index: number, value: number) => {
    setDemand((prev) => prev.map((v, i) => (i === index ? value : v)));
  };

  // --- ฟังก์ชันเพิ่ม/ลดแถวและคอลัมน์ตามแกนปัจจุบัน ---
  const addSupply = () => {
    if (supply.length >= 8) return;
    setSupply((prev) => [...prev, 100]);
    setCosts((prev) => [...prev, new Array(demand.length).fill(0)]);
  };

  const removeSupply = () => {
    if (supply.length <= 1) return;
    setSupply((prev) => prev.slice(0, -1));
    setCosts((prev) => prev.slice(0, -1));
  };

  const addDemand = () => {
    if (demand.length >= 8) return;
    setDemand((prev) => [...prev, 100]);
    setCosts((prev) => prev.map((row) => [...row, 0]));
  };

  const removeDemand = () => {
    if (demand.length <= 1) return;
    setDemand((prev) => prev.slice(0, -1));
    setCosts((prev) => prev.map((row) => row.slice(0, -1)));
  };

  // ผูกปุ่มเพิ่ม/ลดแถวและคอลัมน์ให้ตรงกับแกนที่แสดงผลอยู่
  const handleAddRow = () =>
    orientation === 'standard' ? addSupply() : addDemand();
  const handleRemoveRow = () =>
    orientation === 'standard' ? removeSupply() : removeDemand();
  const handleAddCol = () =>
    orientation === 'standard' ? addDemand() : addSupply();
  const handleRemoveCol = () =>
    orientation === 'standard' ? removeDemand() : removeSupply();

  // --- ฟังก์ชันสลับแกน, รีเซ็ตโจทย์ตัวอย่าง, และล้างตาราง ---
  const handleToggleOrientation = () => {
    setOrientation((prev) => (prev === 'standard' ? 'transposed' : 'standard'));
  };

  const handleResetDefault = () => {
    setCosts(INITIAL_COSTS.map((row) => [...row]));
    setSupply([...INITIAL_SUPPLY]);
    setDemand([...INITIAL_DEMAND]);
    setOrientation('standard');
    setShowSolution(true);
  };

  const handleClearData = () => {
    setCosts((prev) => prev.map((row) => row.map(() => 0)));
    setSupply((prev) => prev.map(() => 0));
    setDemand((prev) => prev.map(() => 0));
  };

  const currentRowCount =
    orientation === 'standard' ? supply.length : demand.length;
  const currentColCount =
    orientation === 'standard' ? demand.length : supply.length;

  return (
    <main className="min-h-screen bg-slate-100 py-10 px-4 sm:px-6 lg:px-8 text-slate-900">
      <div className="max-w-6xl mx-auto">
        {/* ส่วนหัวข้อหน้าเว็บจำลองสไตล์ข้อสอบ */}
        <header className="mb-6 bg-white p-6 rounded-xl border-2 border-black shadow-sm">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-black">
              Transportation Model Solver:{' '}
              <span className="underline decoration-2 underline-offset-4">
                North–West Corner Method
              </span>
            </h1>
            <span className="font-serif text-sm font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded border border-slate-300">
              Interactive Matrix & Auto-Dummy
            </span>
          </div>
          <p className="mt-2 text-sm text-slate-600">
            คลิกที่ตัวเลขมุมขวาบนของแต่ละช่องเพื่อแก้ไขค่า{' '}
            <strong>Cost (c<sub>ij</sub>)</strong> หรือปรับค่า{' '}
            <strong>Supply / Demand</strong> ได้โดยตรง
            หากผลรวมไม่เท่ากันระบบจะเพิ่มแถวหรือคอลัมน์{' '}
            <strong>Dummy</strong> ให้อัตโนมัติ
          </p>
        </header>

        {/* แผงควบคุมการเพิ่ม/ลดแถว-คอลัมน์ และปุ่มสลับแกน */}
        <MatrixControls
          rowCount={currentRowCount}
          colCount={currentColCount}
          orientation={orientation}
          showSolution={showSolution}
          onAddRow={handleAddRow}
          onRemoveRow={handleRemoveRow}
          onAddCol={handleAddCol}
          onRemoveCol={handleRemoveCol}
          onToggleOrientation={handleToggleOrientation}
          onToggleSolution={() => setShowSolution((prev) => !prev)}
          onResetDefault={handleResetDefault}
          onClearData={handleClearData}
        />

        {/* พื้นที่แสดงตาราง Transportation */}
        <section className="bg-white p-6 rounded-xl border-2 border-slate-800 shadow-lg">
          <TransportationTable
            result={result}
            orientation={orientation}
            showSolution={showSolution}
            onCostChange={handleCostChange}
            onSupplyChange={handleSupplyChange}
            onDemandChange={handleDemandChange}
          />
        </section>

        {/* สรุปขั้นตอนการคำนวณและค่า Total Cost (TC) */}
        {showSolution && <SolutionSummary result={result} />}
      </div>
    </main>
  );
}