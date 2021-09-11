import React, { Component } from "react";
import Node from "./Node/Node";
import "bootswatch/dist/lux/bootstrap.min.css";
import "./PathfindingVisualizer.css";
import Navbar from "./navbar";
import { dijkstra, getNodesInShortestPathOrder } from "../Algorithms/dijkstra";

const ROW_NUM = Math.floor((window.innerHeight * 0.75) / 25);
const COL_NUM = Math.floor(window.innerWidth / 25);
console.log(ROW_NUM, COL_NUM);

const START_NODE_ROW = 6;
const START_NODE_COL = 7;
const FINISH_NODE_ROW = ROW_NUM - 5;
const FINISH_NODE_COL = COL_NUM - 5;

export default class PathfindingVisualizer extends Component {
    constructor() {
        super();
        this.state = {
            grid: [],
            mouseIsPressed: false,
            visualizing: false,
        };
    }

    shouldComponentUpdate(nextProps, nextState) {
        return this.state.mouseIsPressed !== nextState.mouse;
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

    setInitialGrid() {
        const grid = [];
        for (let row = 0; row < ROW_NUM; row++) {
            const currentRow = [];
            for (let col = 0; col < COL_NUM; col++) {
                currentRow.push(this.createNode(col, row));
            }
            grid.push(currentRow);
        }
        this.setState({ grid });
    }

    // Initialize the grid to the DOM
    componentDidMount() {
        this.setInitialGrid();
    }

    clearPath() {
        if (this.state.visualizing === false) {
            for (let row = 0; row < ROW_NUM; row++) {
                for (let col = 0; col < COL_NUM; col++) {
                    if (
                        document.getElementById(`node-${row}-${col}`)
                            .className === "node node-shortest-path" ||
                        document.getElementById(`node-${row}-${col}`)
                            .className === "node node-visited"
                    ) {
                        document.getElementById(
                            `node-${row}-${col}`
                        ).className = "node";
                    }
                }
            }
        }
    }

    clearGrid() {
        if (this.state.visualizing === false) {
            this.clearPath();
            this.setInitialGrid();
        }
    }

    // Handle mouse events for wall setting
    handleMouseDown(row, col) {
        const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
        this.setState({ grid: newGrid, mouseIsPressed: true });
    }

    handleMouseEnter(row, col) {
        if (this.state.mouseIsPressed) {
            const newGrid = getNewGridWithWallToggled(
                this.state.grid,
                row,
                col
            );
            this.setState({ grid: newGrid, mouseIsPressed: true });
        }
    }

    handleMouseUp() {
        this.setState({ mouseIsPressed: false });
    }

    // visualizeDijkstra -> animateDijkstra -> animateShortestPath
    animateDijkstra(visitedNodesInOrder, nodeInShortestPathOrder) {
        for (let i = 0; i <= visitedNodesInOrder.length; i++) {
            // Animate the shortest path after animating dijkstra
            if (i === visitedNodesInOrder.length) {
                setTimeout(() => {
                    this.animateShortestPath(nodeInShortestPathOrder);
                }, 2 * i);
                return;
            }
            setTimeout(() => {
                const node = visitedNodesInOrder[i];
                if (!node.isStart && !node.isFinish) {
                    document.getElementById(
                        `node-${node.row}-${node.col}`
                    ).className = "node node-visited";
                }
            }, 2 * i);
        }
    }

    // Part of visualizeDijkstra
    animateShortestPath(nodeInShortestPathOrder) {
        for (let i = 0; i < nodeInShortestPathOrder.length; i++) {
            setTimeout(() => {
                const node = nodeInShortestPathOrder[i];
                if (!node.isStart && !node.isFinish) {
                    document.getElementById(
                        `node-${node.row}-${node.col}`
                    ).className = "node node-shortest-path";
                }
            }, 30 * i);
        }

        setTimeout(() => {
            this.setState({ visualizing: false });
        }, 30 * nodeInShortestPathOrder.length);
        // Allow clear board

        // test
        // for (let row = 0; row < ROW_NUM; row++) {
        //     for (let col = 0; col < COL_NUM; col++) {
        //         const node = this.state.grid[row][col];
        //         if (!node.isVisited) {
        //             document.getElementById(`node-${row}-${col}`).className =
        //                 "node node-unvisited";
        //         }
        //     }
        // }
    }

    visualizeDijkstra() {
        if (this.state.visualizing === false) {
            this.clearPath();
            this.setState({ visualizing: true });
            const grid = this.state.grid;
            const startNode = grid[START_NODE_ROW][START_NODE_COL];
            const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
            const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
            const nodeInShortestPathOrder =
                getNodesInShortestPathOrder(finishNode);
            this.animateDijkstra(visitedNodesInOrder, nodeInShortestPathOrder);
            console.log("finish");
        }
    }

    render() {
        const { grid, mouseIsPressed } = this.state;
        return (
            <div className="main">
                <div className="main-navigation">
                    <Navbar></Navbar>
                    <div className="fireBtn">
                        <h1>Pathfinding Visualizer</h1>
                        <button onClick={() => this.visualizeDijkstra()}>
                            Visualize Dijkstra's Algorithm
                        </button>
                        <button onClick={() => this.clearGrid()}>
                            Clear Board
                        </button>
                    </div>
                </div>

                {/* Initialize the grid */}
                <div className="grid">
                    {grid.map((row, rowIdx) => {
                        return (
                            <div key={rowIdx} className="row-default">
                                {row.map((node, nodeIdx) => {
                                    const {
                                        row,
                                        col,
                                        isFinish,
                                        isStart,
                                        isWall,
                                    } = node;
                                    return (
                                        <Node
                                            // Pass in the props to Node component
                                            key={nodeIdx}
                                            col={col}
                                            row={row}
                                            isFinish={isFinish}
                                            isStart={isStart}
                                            isWall={isWall}
                                            mouseIsPressed={mouseIsPressed}
                                            onMouseDown={(row, col) =>
                                                this.handleMouseDown(row, col)
                                            }
                                            onMouseEnter={(row, col) =>
                                                this.handleMouseEnter(row, col)
                                            }
                                            onMouseUp={() =>
                                                this.handleMouseUp()
                                            }
                                        ></Node>
                                    );
                                })}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }
}

const getNewGridWithWallToggled = (grid, row, col) => {
    const newGrid = grid.slice();
    newGrid[row][col].isWall = true;
    return newGrid;
};
