# AlgoTrace C++ · Sorting Algorithms Visualizer & Step Debugger

[![Live Interactive App](https://img.shields.io/badge/Play%20Online-Live%20Visualizer-06b6d4?style=for-the-badge&logo=googlechrome&logoColor=white)](https://ais-pre-qjy3k3vwzmqpzf665ivibh-838265961928.us-east1.run.app)
[![C++ Beginner Friendly](https://img.shields.io/badge/C%2B%2B-Arrays%20Only-0284c7?style=for-the-badge&logo=c%2B%2B&logoColor=white)](https://ais-pre-qjy3k3vwzmqpzf665ivibh-838265961928.us-east1.run.app)
[![Audio & Voice](https://img.shields.io/badge/Audio-Sonification%20%2B%20Voice%20Instructor-8b5cf6?style=for-the-badge)](https://ais-pre-qjy3k3vwzmqpzf665ivibh-838265961928.us-east1.run.app)

> **Developed for Beginner Computer Science & Programming Students**  
> **Author:** Prof. Vinay Kagitha  
> **Position:** Professor of Computer Science – Programming  
> **Institution:** Oklahoma City Community College (OCCC)  

---

## 🚀 Play Directly in Your Browser (No Installation Required)

Click the link below to open and use the live interactive application immediately:

### 🔗 **[Launch AlgoTrace C++ Live App](https://ais-pre-qjy3k3vwzmqpzf665ivibh-838265961928.us-east1.run.app)**

```
https://ais-pre-qjy3k3vwzmqpzf665ivibh-838265961928.us-east1.run.app
```

Students can run this on any laptop, tablet, Chromebook, or mobile browser without having to install compilers or development tools.

---

## 📖 Pedagogical Purpose & Classroom Philosophy

Many introductory computer science students struggle when first transitioning from basic programming to sorting algorithms and algorithmic thinking. Standard textbooks and code snippets often hide what happens inside computer memory at each line of code.

**AlgoTrace C++** was specifically engineered by **Prof. Vinay Kagitha** for college beginner programming courses (CS1, CS2, Intro to C++, Data Structures) with three strict pedagogical rules:

1. **Pure Raw C++ Arrays Only (`int arr[]`, `int n`)**:
   - Zero vectors, iterators, templates, or modern STL abstractions.
   - Teaches students why we must pass both the array `arr[]` and its length `int n` (due to array decay to pointers).
   - Shows physical 0-indexed memory slots (`arr[0]` to `arr[n - 1]`).

2. **Explicit 3-Step Swap Mechanics**:
   - No black-box `std::swap()`.
   - Explicitly displays and traces the classic 3-step swap taught on whiteboards:
     ```cpp
     int temp = arr[j];
     arr[j] = arr[j + 1];
     arr[j + 1] = temp;
     ```

3. **Multi-Sensory Learning (Visual + Audio Sonification + Spoken AI Instructor)**:
   - **Visual**: Dynamic height bars and array indices with pointers (`i`, `j`, `min_idx`, `key`, `pivot`).
   - **Audio Pitch**: Value-mapped musical frequencies (180 Hz to 880 Hz) so students can literally *hear* the order forming.
   - **Voice Instructor**: Spoken English voice narrating the exact reason for every comparison, swap, and shift.

---

## ✨ Key Features

### 1. Step-by-Step C++ Line-by-Line Debugger
- Synchronized code viewer highlighting the exact executing C++ line (`▶ Line 7: if (arr[j] > arr[j + 1])`).
- Live **Variable Watch Window** tracking variables (`i`, `j`, `min_idx`, `key`, `pivot`, `temp`, `swapped`) at every instant.
- **Recursion Call Stack** for Quick Sort and Merge Sort showing active stack frames and depth.
- Full transport controls: Play/Pause, Step Forward, Step Backward, Jump to Start, Fast Forward, and Scrubbing Slider.
- Adjustable speed multiplier (0.25x slow-motion up to 4x).

### 2. Supported Sorting & Searching Algorithms (10 Algorithms Total)

#### 🔄 Sorting Algorithms (5)
| Algorithm | C++ Function Signature | Best Case | Average Case | Worst Case | Extra Space | Stability |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: |
| **Bubble Sort** | `void bubbleSort(int arr[], int n)` | $O(N)$ | $O(N^2)$ | $O(N^2)$ | $O(1)$ | Yes |
| **Selection Sort** | `void selectionSort(int arr[], int n)` | $O(N^2)$ | $O(N^2)$ | $O(N^2)$ | $O(1)$ | No |
| **Insertion Sort** | `void insertionSort(int arr[], int n)` | $O(N)$ | $O(N^2)$ | $O(N^2)$ | $O(1)$ | Yes |
| **Quick Sort** | `void quickSort(int arr[], int low, int high)` | $O(N \log N)$ | $O(N \log N)$ | $O(N^2)$ | $O(\log N)$ | No |
| **Merge Sort** | `void mergeSort(int arr[], int left, int right)` | $O(N \log N)$ | $O(N \log N)$ | $O(N \log N)$ | $O(N)$ | Yes |

#### 🔍 Searching Algorithms (5)
| Algorithm | C++ Function Signature | Best Case | Average Case | Worst Case | Extra Space | Sorted Required? |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: |
| **Linear Search** | `int linearSearch(int arr[], int n, int target)` | $O(1)$ | $O(N)$ | $O(N)$ | $O(1)$ | No |
| **Binary Search** | `int binarySearch(int arr[], int n, int target)` | $O(1)$ | $O(\log N)$ | $O(\log N)$ | $O(1)$ | Yes |
| **Jump Search** | `int jumpSearch(int arr[], int n, int target)` | $O(1)$ | $O(\sqrt{N})$ | $O(\sqrt{N})$ | $O(1)$ | Yes |
| **Interpolation Search** | `int interpolationSearch(int arr[], int n, int target)` | $O(1)$ | $O(\log \log N)$ | $O(N)$ | $O(1)$ | Yes |
| **Exponential Search** | `int exponentialSearch(int arr[], int n, int target)` | $O(1)$ | $O(\log i)$ | $O(\log N)$ | $O(1)$ | Yes |

### 3. List of Lists (Custom Datasets & Test Suites)
- **Built-in Presets**:
  - *Classic Textbook* `[64, 34, 25, 12, 22, 11, 90]`
  - *Compact 5-Node* `[29, 10, 14, 37, 13]` (ideal for handwritten trace assignments)
  - *Nearly Sorted* (demonstrates the early-break $O(N)$ optimization)
  - *Reversed Order* (worst-case stress test)
  - *With Duplicates* (demonstrates algorithm stability)
  - *Varied Dynamic Range* `[42, 8, 99, 17, 63, 25, 74, 3, 51]`
- **Custom List Creator**: Students can type their own comma-separated homework problems or generate random arrays with customizable sizes (5 to 15 items).
- **Multi-List Lab**: Runs any algorithm across all lists in the collection simultaneously to compare comparison and swap tallies.

### 4. Side-by-Side Algorithm Arena
- Run any two algorithms concurrently on the identical array (e.g., Quick Sort vs. Bubble Sort) to visually prove why $O(N \log N)$ outperforms $O(N^2)$.

### 5. AI Voice Instructor & "Lecture Auto-Step"
- Built-in spoken voice tutor that explains each step in natural English.
- **Lecture Auto-Step**: Plays the step, speaks the explanation, pauses, and automatically advances when speech finishes—ideal for self-paced study or classroom demonstrations.

---

## 💻 Recommended Classroom Activities & Homework Ideas

1. **Handwritten Trace Verification**:
   - Assign students the 5-element array `[29, 10, 14, 37, 13]`.
   - Ask them to trace Bubble Sort on paper, recording values of `i`, `j`, `temp`, and `swapped` at each step.
   - Use the **Step Debugger** in class or at home to verify each row of their trace table.

2. **Understanding the Early-Exit Flag**:
   - Load the *Nearly Sorted* preset in Bubble Sort.
   - Step through to see the `swapped` flag remain `false` on the second pass and watch the `break;` statement terminate in $O(N)$ time.

3. **Swap Cost vs. Comparison Cost**:
   - Compare **Selection Sort** and **Bubble Sort** on the *Reversed Order* list.
   - Notice that while both make $N(N - 1)/2$ comparisons, Selection Sort makes at most $N - 1$ swaps.

---

## 🛠️ Local Development & Running from Source

If you would like to run this project locally or modify the source code:

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation
```bash
# 1. Clone the repository
git clone https://github.com/<your-username>/<your-repo-name>.git
cd <your-repo-name>

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev
```

Open your browser at `http://localhost:3000` to interact with the visualizer.

### Building for Production
```bash
npm run build
npm run preview
```

---

## 🎓 Instructor Attribution

- **Creator:** Prof. Vinay Kagitha
- **Role:** Professor of Computer Science – Programming
- **Institution:** Oklahoma City Community College (OCCC)
- **Contact:** [kagithavinay2001@gmail.com](mailto:kagithavinay2001@gmail.com)

---

## 📄 License

This educational software is released under the **Apache-2.0 License**. Free for students, educators, and academic institutions worldwide.
