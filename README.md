# North-West Corner Transportation Solver

An interactive web application built with **Next.js**, **TypeScript**, and **Tailwind CSS** designed to solve operations research **Transportation Problems** using the **North–West Corner Method**.

The UI replicates standard academic matrix notation—complete with upper-right unit cost sub-cells, diagonal split headers, real-time allocation updates, and automatic dummy row/column generation for unbalanced models.

---

## ✨ Key Features

- **Academic Matrix UI**: Classic textbook/exam layout featuring top-right sub-cells for unit costs ($c_{ij}$), central allocation values ($x_{ij}$), and SVG diagonal split cells for headers and total Supply/Demand comparison.
- **Real-Time Calculation**: Automatically computes step-by-step allocations and Total Cost ($TC$) instantly as values are modified.
- **Auto-Dummy Balancing (Unbalanced Handling)**:
  - Automatically appends a **Dummy Column ($D_{\text{dummy}}$)** with zero unit costs when $\sum \text{Supply} > \sum \text{Demand}$.
  - Automatically appends a **Dummy Row ($S_{\text{dummy}}$)** with zero unit costs when $\sum \text{Demand} > \sum \text{Supply}$.
- **Dynamic Matrix Scaling**: Easily add or remove Supply rows and Demand columns (from $1 \times 1$ up to $8 \times 8$) to match any problem size.
- **Axis Transposition ($S \leftrightarrow D$)**: One-click toggle to transpose the matrix orientation between standard ($S_i$ on vertical rows, $D_j$ on horizontal columns) and transposed ($D_j$ on vertical rows, $S_i$ on horizontal columns).
- **Step-by-Step Breakdown**: Displays the complete sequence of allocations, remaining capacities at each step, and the final Total Cost ($TC$) equation.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 🚀 Getting Started
Prerequisites
Make sure you have Node.js (v18.17 or later) installed on your machine.

Installation & Run Locally
1. Clone the repository:  
git clone [https://github.com/ChotwitDEV/northwest-solver.git](https://github.com/YOUR_USERNAME/northwest-solver.git)
 
     cd northwest-solver

2. Install dependencies: npm install
3. Start the development server: npm run dev
4. Open in browser: Navigate to http://localhost:3000 to use the application.

📐 How the Algorithm WorksBalance Verification:
The solver compares total Supply ($\sum S_i$) and total Demand ($\sum D_j$). If unequal, a dummy row or column with unit cost $c_{ij} = 0$ is injected to absorb the excess capacity or shortage.North-West Corner Allocation:
Starting at the top-left corner cell $(0, 0)$, the algorithm allocates the maximum possible units:$$x_{ij} = \min(\text{RowAvailable}_i, \text{ColAvailable}_j)$$Pointer Advancement:Subtract $x_{ij}$ from both row and column capacities.Move down $(i + 1)$ if the current row capacity reaches $0$.Move right $(j + 1)$ if the current column capacity reaches $0$.Repeat until the bottom-right corner cell is resolved.Total Cost Computation:$$TC = \sum_{i=1}^{m} \sum_{j=1}^{n} (c_{ij} \times x_{ij})$$

---

## 📁 Project Structure

```text
northwest-solver/
├── src/
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.tsx                # Root layout & typography configuration
│   │   └── page.tsx                  # Main dashboard & state management
│   ├── components/
│   │   ├── MatrixCell.tsx            # Individual cell with top-right cost box & allocation display
│   │   ├── MatrixControls.tsx        # Control bar for dimensions, axis transpose, and presets
│   │   ├── SolutionSummary.tsx       # Step-by-step allocation table & Total Cost summary
│   │   └── TransportationTable.tsx   # Main matrix grid with diagonal SVG headers
│   ├── types/
│   │   └── transportation.ts         # TypeScript interfaces for grid cells, steps, and solver results
│   └── utils/
│       └── northwestAlgorithm.ts     # Core North-West Corner logic & auto-dummy balancing
├── package.json
└── tsconfig.json
```
