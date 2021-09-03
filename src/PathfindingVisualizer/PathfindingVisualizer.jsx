import React, { Component } from "react";
import Node from "./Node/Node";
import "./PathfindingVisualizer.css";

const START_NODE_ROW = 10;
const START_NODE_COL = 15;
const FINISH_NODE_ROW = 10;
const FINISH_NODE_COL = 35;

export default class PathfindingVisualizer extends Component {
    constructor() {
        super();
        this.state = {
            grid: [],
            mouseIsPressed: false,
        };
    }

    // Create a single node with specified column and row
    createNode(col, row) {
        return {
            col,
            row,
            isStart: row === START_NODE_ROW && col === START_NODE_COL,
            isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
            distance: Infinity,
            isVisited: false,
            isWall: false,
            previousNode: null,
        };
    }

    // Initialize the grid to the DOM
    componentDidMount() {
        const grid = [];
        for (let row = 0; row < 20; row++) {
            const currentRow = [];
            for (let col = 0; col < 50; col++) {
                currentRow.push(this.createNode(col, row));
            }
            grid.push(currentRow);
        }
        this.setState({ grid });
    }

    render() {
        const { grid, mouseIsPressed } = this.state;
        return (
            <div className="main">
                <h1>Pathfinding Visualizer</h1>

                {/* Initialize the grid */}
                <div className="grid">
                    {grid.map((row, rowIdx) => {
                        return (
                            <div>
                                {row.map((node, nodeIdx) => (
                                    <Node></Node>
                                ))}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }
}
