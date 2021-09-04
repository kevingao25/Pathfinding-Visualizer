import React, { Component } from "react";
import Node from "./Node/Node";
import "./PathfindingVisualizer.css";
import { dijkstra, getNodesInShortestPathOrder } from "../Algorithms/dijkstra";

const START_NODE_ROW = 6;
const START_NODE_COL = 12;
const FINISH_NODE_ROW = 23;
const FINISH_NODE_COL = 60;

const ROW_NUM = 30;
const COL_NUM = 75;

export default class PathfindingVisualizer extends Component {
    constructor() {
        super();
        this.state = {
            grid: [],
            mouseIsPressed: false,
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

    // Initialize the grid to the DOM
    componentDidMount() {
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
        const grid = this.state.grid;
        const startNode = grid[START_NODE_ROW][START_NODE_COL];
        const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
        const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
        const nodeInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
        this.animateDijkstra(visitedNodesInOrder, nodeInShortestPathOrder);

        console.log("finish");
    }

    render() {
        const { grid, mouseIsPressed } = this.state;
        return (
            <div className="main">
                <h1>Pathfinding Visualizer</h1>
                <button onClick={() => this.visualizeDijkstra()}>
                    Visualize Dijkstra's Algorithm
                </button>

                {/* Initialize the grid */}
                <div className="grid">
                    {grid.map((row, rowIdx) => {
                        return (
                            <div key={rowIdx} className="row">
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
