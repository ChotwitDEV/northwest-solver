// src/types/transportation.ts

/**
 * โหมดการวางแกนของตาราง (Orientation Mode)
 * - 'standard': แถวแนวนอนเป็น Supply (S_i), คอลัมน์แนวตั้งเป็น Demand (D_j) ตามรูปโจทย์ปกติ
 * - 'transposed': สลับเอา Demand (D_j) มาเป็นแถวแนวตั้งด้านซ้าย และ Supply (S_i) ไปเป็นคอลัมน์แนวนอนด้านบน
 */
export type OrientationMode = 'standard' | 'transposed';

/**
 * ข้อมูลของแต่ละช่องย่อย (Cell) ในตารางผลลัพธ์หลังจากคำนวณแล้ว
 */
export interface SolvedCell {
  rowIdx: number;           // ลำดับแถวในตาราง
  colIdx: number;           // ลำดับคอลัมน์ในตาราง
  cost: number;             // ค่าต้นทุนมุมขวาบน (c_ij)
  allocation: number | null;// จำนวนที่ถูกจัดสรร (x_ij) ถ้าไม่ได้จัดสรรจะเป็น null
  isAllocated: boolean;     // ช่องนี้ได้รับการจัดสรรหรือไม่ (ใช้ไฮไลต์สีพื้นหลังและเส้นทาง)
  isDummy: boolean;         // ช่องนี้อยู่ในแถวหรือคอลัมน์ Dummy หรือไม่
  stepOrder?: number;       // ลำดับขั้นตอนที่ถูกจัดสรร (Step 1, 2, 3...)
}

/**
 * ข้อมูลอธิบายวิธีทำทีละขั้นตอน (Step-by-Step Breakdown)
 */
export interface AllocationStep {
  stepNumber: number;       // ขั้นตอนที่เท่าไหร่
  rowLabel: string;         // ชื่อแถว ณ ขั้นตอนนั้น (เช่น S1 หรือ D1 หรือ Dummy)
  colLabel: string;         // ชื่อคอลัมน์ ณ ขั้นตอนนั้น (เช่น D1 หรือ S1 หรือ Dummy)
  allocated: number;        // ปริมาณสินค้าที่จัดสรรในรอบนี้: min(rowAvailable, colAvailable)
  cost: number;             // ต้นทุนต่อหน่วยของช่องนี้ (c_ij)
  subTotalCost: number;     // ต้นทุนรวมของช่องนี้ (allocated * cost)
  rowRemainingAfter: number;// ยอดคงเหลือของแถวหลังจากหักลบแล้ว
  colRemainingAfter: number;// ยอดคงเหลือของคอลัมน์หลังจากหักลบแล้ว
  isDummy: boolean;         // เป็นการจัดสรรเข้าช่อง Dummy หรือไม่
}

/**
 * โครงสร้างข้อมูลผลลัพธ์ทั้งหมดที่ได้จากอัลกอริทึม North-West Corner
 */
export interface SolverResult {
  // ข้อมูลตารางที่รวมแถวหรือคอลัมน์ Dummy เข้าไปแล้ว (พร้อมเอาไป Render วาดตารางทันที)
  grid: SolvedCell[][];
  
  // ป้ายชื่อแถวและคอลัมน์ (รวมตัวที่เป็น Dummy เช่น S_dummy หรือ D_dummy)
  rowLabels: string[];
  colLabels: string[];
  
  // ค่าขีดจำกัดของแต่ละแถวและคอลัมน์ (Supply / Demand ที่รวมค่าของ Dummy แล้ว)
  rowTotals: number[];
  colTotals: number[];
  
  // สถานะความสมดุลของโจทย์ตั้งต้น (ก่อนเติม Dummy)
  totalSupplyInput: number;
  totalDemandInput: number;
  isBalanced: boolean;
  dummyAdded: 'none' | 'row' | 'col';
  dummyAmount: number;
  
  // ผลลัพธ์การคำนวณและลำดับขั้นตอน
  steps: AllocationStep[];
  totalCost: number;        // ค่าคำตอบสุดท้าย Total Cost (TC)
}