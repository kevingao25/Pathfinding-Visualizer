import React from "react";
import "./App.css";
import PathfindingVisualizer from "./PathfindingVisualizer/PathfindingVisualizer";
import Navbar from "./PathfindingVisualizer/navbar";

function App() {
    return (
        <div className="App">
            <Navbar></Navbar>
            <PathfindingVisualizer></PathfindingVisualizer>
        </div>
    );
}

export default App;
