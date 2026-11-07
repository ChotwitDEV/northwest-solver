// src/components/MatrixCell.tsx
'use client';

import React from 'react';
import { SolvedCell } from '@/types/transportation';

interface MatrixCellProps {
  cell: SolvedCell;
  showSolution: boolean;
  onCostChange: (newCost: number) => void;
}

export default function MatrixCell({
  cell,
  showSolution,
  onCostChange,
}: MatrixCellProps) {
  const { cost, allocation, isAllocated, isDummy, stepOrder } = cell;

  // กำหนดสีพื้นหลังแยกตามสถานะ: ช่อง Dummy, ช่องที่ได้รับจัดสรรสินค้า, และช่องปกติ
  const getBackgroundStyle = () => {
    if (isDummy) {
      return showSolution && isAllocated
        ? 'bg-amber-50/90'
        : 'bg-stone-100/70';
    }
    if (showSolution && isAllocated) {
      return 'bg-blue-50/80';
    }
    return 'bg-white hover:bg-slate-50/60';
  };

  return (
    <td
      className={`relative border-2 border-black w-32 h-24 p-0 align-middle select-none transition-colors ${getBackgroundStyle()}`}
    >
      {/* ป้ายบอกลำดับขั้นตอน (Step 1, 2, 3...) ที่มุมซ้ายบนเมื่อกดแสดงผลลัพธ์ */}
      {showSolution && isAllocated && stepOrder !== undefined && (
        <span
          className={`absolute top-1 left-1.5 text-[11px] font-mono font-bold px-1.5 py-0.5 rounded ${
            isDummy
              ? 'bg-amber-200/80 text-amber-900'
              : 'bg-blue-200/80 text-blue-900'
          }`}
          title={`จัดสรรเป็นลำดับที่ ${stepOrder}`}
        >
          #{stepOrder}
        </span>
      )}

      {/* กรอบย่อยมุมขวาบนสำหรับค่า Cost (c_ij) ตามดีไซน์รูปต้นฉบับ */}
      <div
        className={`absolute top-0 right-0 w-14 h-9 border-l-2 border-b-2 border-black flex items-center justify-center ${
          isDummy ? 'bg-stone-200/80' : 'bg-white'
        }`}
      >
        {isDummy ? (
          <span
            className="font-serif font-bold text-lg text-stone-500 cursor-not-allowed"
            title="ช่อง Dummy มีค่าต้นทุนเท่ากับ 0 เสมอ"
          >
            0
          </span>
        ) : (
          <input
            type="number"
            min={0}
            value={cost === 0 ? 0 : cost || ''}
            onChange={(e) => {
              const val = e.target.value === '' ? 0 : parseFloat(e.target.value);
              onCostChange(isNaN(val) ? 0 : Math.max(0, val));
            }}
            className="w-full h-full text-center font-serif font-bold text-lg text-black bg-transparent focus:bg-yellow-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-600 transition-colors"
            title="คลิกเพื่อแก้ไขค่าต้นทุน (Cost)"
          />
        )}
      </div>

      {/* พื้นที่แสดงผลลัพธ์การจัดสรร (Allocation: x_ij) ตรงกลางค่อนลงล่างของช่อง */}
      <div className="w-full h-full flex items-end justify-center pb-2.5 pt-8 px-2">
        {showSolution && isAllocated && allocation !== null ? (
          <div className="flex flex-col items-center">
            <span
              className={`font-serif font-extrabold text-2xl tracking-tight leading-none ${
                isDummy ? 'text-amber-700' : 'text-blue-700'
              }`}
            >
              {allocation.toLocaleString()}
            </span>
            {isDummy && (
              <span className="text-[10px] font-sans font-semibold uppercase tracking-wider text-amber-600 mt-0.5">
                (Dummy)
              </span>
            )}
          </div>
        ) : null}
      </div>
    </td>
  );
}