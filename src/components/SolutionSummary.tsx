// src/components/SolutionSummary.tsx
'use client';

import React from 'react';
import { SolverResult } from '@/types/transportation';
import { CheckCircle2, AlertCircle, Award } from 'lucide-react';

interface SolutionSummaryProps {
  result: SolverResult;
}

export default function SolutionSummary({ result }: SolutionSummaryProps) {
  const {
    steps,
    totalCost,
    totalSupplyInput,
    totalDemandInput,
    isBalanced,
    dummyAdded,
    dummyAmount,
  } = result;

  return (
    <div className="mt-8 bg-white border-2 border-slate-800 rounded-xl shadow-xl overflow-hidden max-w-4xl mx-auto">
      {/* ส่วนหัวสรุปผลลัพธ์ Total Cost */}
      <div className="bg-gradient-to-r from-slate-900 to-blue-950 text-white p-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold font-serif flex items-center space-x-2">
            <Award className="text-yellow-400" size={24} />
            <span>ผลลัพธ์การคำนวณวิธี North-West Corner Method</span>
          </h3>
          <p className="text-slate-300 text-sm mt-1">
            {isBalanced ? (
              <span className="flex items-center text-emerald-400 font-medium">
                <CheckCircle2 size={16} className="mr-1.5" /> โจทย์มีความสมดุลแล้ว (Total Supply = Total Demand = {totalSupplyInput})
              </span>
            ) : (
              <span className="flex items-center text-amber-400 font-medium">
                <AlertCircle size={16} className="mr-1.5" /> โจทย์ไม่สมดุล (Unbalanced): ระบบได้เพิ่ม{' '}
                {dummyAdded === 'row' ? 'แถว Dummy' : 'คอลัมน์ Dummy'} มูลค่า {dummyAmount} เรียบร้อยแล้ว
              </span>
            )}
          </p>
        </div>

        {/* กล่องแสดงค่า TC รวม */}
        <div className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-xl border border-white/20 text-right">
          <div className="text-xs uppercase tracking-wider text-slate-300 font-semibold">
            Total Cost (TC)
          </div>
          <div className="text-3xl font-extrabold font-serif text-yellow-400">
            {totalCost.toLocaleString()}
          </div>
        </div>
      </div>

      {/* ส่วนแสดงตารางขั้นตอนวิธีทำ (Step-by-Step Breakdown) */}
      <div className="p-6">
        <h4 className="text-lg font-bold text-slate-800 mb-4 font-serif border-b pb-2">
          ลำดับขั้นตอนการจัดสรร (Allocation Steps)
        </h4>

        {steps.length === 0 ? (
          <p className="text-slate-500 italic py-4 text-center">ไม่มีข้อมูลการจัดสรร</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 border-b-2 border-slate-300 text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  <th className="py-3 px-4">Step</th>
                  <th className="py-3 px-4">Cell (Row, Col)</th>
                  <th className="py-3 px-4 text-center">Allocated (x_ij)</th>
                  <th className="py-3 px-4 text-center">Cost (c_ij)</th>
                  <th className="py-3 px-4 text-right">Subtotal TC</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-sm font-mono">
                {steps.map((st) => (
                  <tr
                    key={st.stepNumber}
                    className={`hover:bg-slate-50 transition-colors ${
                      st.isDummy ? 'bg-amber-50/50' : ''
                    }`}
                  >
                    <td className="py-3 px-4 font-bold text-blue-600">
                      #{st.stepNumber}
                    </td>
                    <td className="py-3 px-4 font-sans font-medium text-slate-800">
                      {st.rowLabel} → {st.colLabel}{' '}
                      {st.isDummy && (
                        <span className="text-xs bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded ml-1 font-sans">
                          Dummy
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-slate-900">
                      {st.allocated.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-center text-slate-600">
                      {st.cost}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-slate-900">
                      {st.allocated} x {st.cost} = {st.subTotalCost.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* สูตรคำนวณสรุป */}
        <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-200 text-slate-700 text-sm">
          <span className="font-bold text-slate-900">สมการคำนวณ Total Cost:</span>{' '}
          <span className="font-mono text-xs md:text-sm mt-1 block overflow-x-auto text-blue-800 font-semibold">
            TC = {steps.map((s) => `(${s.allocated} × ${s.cost})`).join(' + ')} = {totalCost.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}