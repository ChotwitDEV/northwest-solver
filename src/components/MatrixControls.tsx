// src/components/MatrixControls.tsx
'use client';

import React from 'react';
import { OrientationMode } from '@/types/transportation';
import { Plus, Minus, RotateCw, RefreshCw, Play, FileText } from 'lucide-react';

interface MatrixControlsProps {
  rowCount: number;
  colCount: number;
  orientation: OrientationMode;
  showSolution: boolean;
  onAddRow: () => void;
  onRemoveRow: () => void;
  onAddCol: () => void;
  onRemoveCol: () => void;
  onToggleOrientation: () => void;
  onToggleSolution: () => void;
  onResetDefault: () => void;
  onClearData: () => void;
}

export default function MatrixControls({
  rowCount,
  colCount,
  orientation,
  showSolution,
  onAddRow,
  onRemoveRow,
  onAddCol,
  onRemoveCol,
  onToggleOrientation,
  onToggleSolution,
  onResetDefault,
  onClearData,
}: MatrixControlsProps) {
  return (
    <div className="bg-slate-900 text-white p-4 rounded-xl shadow-lg mb-6 flex flex-wrap items-center justify-between gap-4">
      {/* กลุ่มควบคุมขนาดแถวและคอลัมน์ */}
      <div className="flex flex-wrap items-center gap-4">
        {/* แถว Supply/Demand */}
        <div className="flex items-center space-x-2 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">
          <span className="text-sm font-semibold text-slate-300">
            {orientation === 'standard' ? 'Supply Rows:' : 'Demand Rows:'}
          </span>
          <button
            onClick={onRemoveRow}
            disabled={rowCount <= 1}
            className="p-1 rounded bg-slate-700 hover:bg-slate-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            title="ลดจำนวนแถว"
          >
            <Minus size={16} />
          </button>
          <span className="font-mono font-bold text-lg w-6 text-center">
            {rowCount}
          </span>
          <button
            onClick={onAddRow}
            disabled={rowCount >= 8}
            className="p-1 rounded bg-slate-700 hover:bg-slate-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            title="เพิ่มจำนวนแถว"
          >
            <Plus size={16} />
          </button>
        </div>

        {/* คอลัมน์ Demand/Supply */}
        <div className="flex items-center space-x-2 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">
          <span className="text-sm font-semibold text-slate-300">
            {orientation === 'standard' ? 'Demand Cols:' : 'Supply Cols:'}
          </span>
          <button
            onClick={onRemoveCol}
            disabled={colCount <= 1}
            className="p-1 rounded bg-slate-700 hover:bg-slate-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            title="ลดจำนวนคอลัมน์"
          >
            <Minus size={16} />
          </button>
          <span className="font-mono font-bold text-lg w-6 text-center">
            {colCount}
          </span>
          <button
            onClick={onAddCol}
            disabled={colCount >= 8}
            className="p-1 rounded bg-slate-700 hover:bg-slate-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            title="เพิ่มจำนวนคอลัมน์"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      {/* กลุ่มปุ่มฟังก์ชันพิเศษ (สลับแกน, โหลดโจทย์ตัวอย่าง, เคลียร์ค่า) */}
      <div className="flex flex-wrap items-center gap-2">
        {/* ปุ่มสลับแกนตาราง (Transpose) */}
        <button
          onClick={onToggleOrientation}
          className="flex items-center space-x-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg text-sm font-medium transition-colors"
          title="สลับฝั่งระหว่าง Supply และ Demand"
        >
          <RotateCw size={16} className="text-cyan-400" />
          <span>แกน: {orientation === 'standard' ? 'S แนวตั้ง / D แนวนอน' : 'D แนวตั้ง / S แนวนอน'}</span>
        </button>

        {/* ปุ่มโหลดโจทย์ตัวอย่างตามรูป */}
        <button
          onClick={onResetDefault}
          className="flex items-center space-x-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg text-sm font-medium transition-colors text-amber-300"
          title="โหลดค่าเริ่มต้นตามโจทย์ในรูปภาพ"
        >
          <FileText size={16} />
          <span>โจทย์ตัวอย่าง</span>
        </button>

        {/* ปุ่มล้างค่าทั้งหมด */}
        <button
          onClick={onClearData}
          className="flex items-center space-x-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg text-sm font-medium transition-colors text-rose-300"
          title="ล้างข้อมูลในตารางให้เป็น 0"
        >
          <RefreshCw size={16} />
          <span>รีเซ็ต</span>
        </button>

        {/* ปุ่มหลัก: คำนวณ / แสดงวิธีทำ */}
        <button
          onClick={onToggleSolution}
          className={`flex items-center space-x-2 px-5 py-2 rounded-lg font-bold shadow-md transition-all ${
            showSolution
              ? 'bg-amber-600 hover:bg-amber-500 text-white'
              : 'bg-blue-600 hover:bg-blue-500 text-white'
          }`}
        >
          <Play size={18} fill="currentColor" />
          <span>{showSolution ? 'ซ่อนวิธีทำ' : 'คำนวณ North-West'}</span>
        </button>
      </div>
    </div>
  );
}