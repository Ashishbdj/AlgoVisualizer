import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import About from "./About";
import Algorithms from "./components/Algorithm";
import Login from "./components/Login";
import BubbleSortVisualizer from "./components/BubbleSortVisualizer";
import InsertionSort from "./Algorithm/Inserstionsort";
import SelectionSort from "./Algorithm/SelectionSort";
import BubbleSort from "./Algorithm/BinarySerach";
import QuickSort from "./Algorithm/QuickSort";
import MergeSort from "./Algorithm/MergeSort";
import LinearSearch from "./Algorithm/LinearSearch";
import BinarySearch from "./Algorithm/BinarySerach";
import Signup from "./components/Signup";
import DijkstraVisualizer from "./components/DijkstraVisualizer";
import FactorialVisualizer from "./Algorithm/FactorialVisualizer";
import FibonacciVisualizer from "./Algorithm/FibonacciVisualizer";
import TowerOfHanoiVisualizer from "./Algorithm/TowerOfHanoiVisualizer";
import BinaryTreeVisualizer from "./Algorithm/Tree/BinaryTreeVisualizer";
import Bfs from "./Algorithm/Graph/Bfs";
import Dfs from "./Algorithm/Graph/Dfs";
import KruskalVisualizer from "./Algorithm/Graph/KruskalVisualizer";
import PrimVisualizer from "./Algorithm/Graph/PrimVisualizer";

function App() {
  return (
    <Router>
      <Navbar />
      <div className="pt-20"> {/* To prevent navbar overlap */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/algorithms" element={<Algorithms />} />
          <Route path="/algorithm/linear-search" element={<LinearSearch/>}/>
          <Route path="/algorithm/binary-search" element={<BinarySearch/>}/>
          <Route path="/algorithm/insertion-sort" element={<InsertionSort/>}/>
          <Route path="/algorithm/selection-sort" element={<SelectionSort/>}/>
          <Route path="/algorithm/bubble-sort" element={<BubbleSort/>}/>
          <Route path="/algorithm/merge-sort" element={<MergeSort/>}/>
          <Route path="/algorithm/quick-sort" element={<QuickSort/>}/>
          <Route path="/algorithm/factorial-recursion" element={<FactorialVisualizer/>}/>
          <Route path="/algorithm/fibonacci-recursion" element={<FibonacciVisualizer/>}/>     
          <Route path="/algorithm/tower-of-hanoi" element={<TowerOfHanoiVisualizer/>}/>   
          <Route path="/algorithm/inorder-traversal" element={<BinaryTreeVisualizer/>}/>  
          <Route path="/algorithm/dijkstra" element={<DijkstraVisualizer/>}/>  
          <Route path="/algorithm/bfs" element={<Bfs/>}/>   
          <Route path="/algorithm/kruskal" element={<KruskalVisualizer/>}/>   
          <Route path="/algorithm/prim" element={<PrimVisualizer/>}/>   
          <Route path="/algorithm/dfs" element={<Dfs/>}/>   
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;
