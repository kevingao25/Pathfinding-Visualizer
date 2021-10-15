import React, { Component } from "react";
import Node from "./Node/Node";
import "bootswatch/dist/lux/bootstrap.min.css";
import "./PathfindingVisualizer.css";
import Navbar from "./navbar";
import { dijkstra, getNodesInShortestPathOrder } from "../Algorithms/dijkstra";
import { Astar, reconstructPath } from "../Algorithms/Astar";
import { randomMaze } from "../Algorithms/randomMaze";
import { depthFirstSearch, NodesInPathOrder_DFS } from "../Algorithms/DFS";
import { breadthFirstSearch, NodesInPathOrder_BFS } from "../Algorithms/BFS";
import { recursiveDivisionMaze } from "../Algorithms/recursiveDivision";
import { verticalMaze } from "../Algorithms/verticalMaze";

var ROW_NUM = Math.floor((window.innerHeight * 0.75) / 25);
var COL_NUM = Math.floor(window.innerWidth / 25);

var START_NODE_ROW = 6;
var START_NODE_COL = 7;
var FINISH_NODE_ROW = ROW_NUM - 5;
var FINISH_NODE_COL = COL_NUM - 5;

export default class PathfindingVisualizer extends Component {
	constructor() {
		super();
		this.state = {
			grid: [],
			mouseIsPressed: false,
			visualizing: false,
			algorithm: "Dijkstra",
			maze: "randomMaze",
			speed: 2,
			nodeSize: "normal",
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
			nodeSize: this.state.nodeSize,
			isStart: row === START_NODE_ROW && col === START_NODE_COL,
			isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
			distance: Infinity,
			isVisited: false,
			isWall: false,
			previousNode: null,
			estimatedDistanceToEnd: Infinity,
			id: row.toString() + "-" + col.toString(),
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
						document.getElementById(`node-${row}-${col}`).className ===
							"node node-shortest-path" ||
						document.getElementById(`node-${row}-${col}`).className ===
							"node node-visited"
					) {
						document.getElementById(`node-${row}-${col}`).className = "node";
					}
				}
			}
		}
	}

	clearWall() {
		if (this.state.visualizing === false) {
			for (let row = 0; row < ROW_NUM; row++) {
				for (let col = 0; col < COL_NUM; col++) {
					if (
						document.getElementById(`node-${row}-${col}`).className === "node node-wall"
					) {
						document.getElementById(`node-${row}-${col}`).className = "node";
					}
				}
			}
		}
	}

	clearGrid() {
		if (this.state.visualizing === false) {
			this.setInitialGrid();
			this.clearPath();
			this.clearWall();
		}
	}

	createNewBoard() {
		const grid = [];
		for (let row = 0; row < ROW_NUM; row++) {
			const currentRow = [];
			for (let col = 0; col < COL_NUM; col++) {
				currentRow.push(this.createNode(col, row));
			}
			grid.push(currentRow);
		}
		return grid;
	}

	// Handle mouse events for wall setting
	handleMouseDown(row, col) {
		if (this.state.visualizing === false) {
			const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
			this.setState({ grid: newGrid, mouseIsPressed: true });
		}
	}

	handleMouseEnter(row, col) {
		if (this.state.mouseIsPressed && this.state.visualizing === false) {
			const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
			this.setState({ grid: newGrid, mouseIsPressed: true });
		}
	}

	handleMouseUp() {
		this.setState({ mouseIsPressed: false });
	}

	// Clear nodes states except wall
	clearNodeStates() {
		const grid = [];
		for (let row = 0; row < ROW_NUM; row++) {
			const currentRow = [];
			for (let col = 0; col < COL_NUM; col++) {
				const currNode = this.createNode(col, row);
				const oldNode = this.state.grid[row][col];
				if (oldNode.isWall) {
					currNode.isWall = true;
				}
				currentRow.push(currNode);
			}
			grid.push(currentRow);
		}
		this.setState({ grid });
	}

	// visualizeAlgorithm -> animateVisitedNodes -> animateShortestPath
	animateVisitedNodes(visitedNodesInOrder, nodeInShortestPathOrder) {
		if (visitedNodesInOrder === undefined || nodeInShortestPathOrder === undefined) {
			return;
		}
		const speed = this.state.speed;
		for (let i = 0; i <= visitedNodesInOrder.length; i++) {
			// Animate the shortest path after animating dijkstra
			if (i === visitedNodesInOrder.length) {
				setTimeout(() => {
					this.animateShortestPath(nodeInShortestPathOrder);
				}, speed * i);
				return;
			}
			setTimeout(() => {
				const node = visitedNodesInOrder[i];
				if (!node.isStart && !node.isFinish) {
					document.getElementById(`node-${node.row}-${node.col}`).className =
						"node node-visited";
				}
			}, speed * i);
		}
	}

	// Part of visualizeAlgorithm
	animateShortestPath(nodeInShortestPathOrder) {
		for (let i = 0; i < nodeInShortestPathOrder.length; i++) {
			setTimeout(() => {
				const node = nodeInShortestPathOrder[i];
				if (!node.isStart && !node.isFinish) {
					document.getElementById(`node-${node.row}-${node.col}`).className =
						"node node-shortest-path";
				}
			}, 30 * i);
		}

		setTimeout(() => {
			this.setState({ visualizing: false });
		}, 30 * nodeInShortestPathOrder.length);
	}

	visualizeAlgorithm() {
		if (this.state.visualizing === true) return;
		this.clearPath();
		this.clearNodeStates();
		this.setState({ visualizing: true });
		const grid = this.state.grid;
		const startNode = grid[START_NODE_ROW][START_NODE_COL];
		const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];

		let visitedNodesInOrder;
		let nodeInShortestPathOrder;

		if (this.state.algorithm === "Dijkstra") {
			visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
			nodeInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
		} else if (this.state.algorithm === "A*") {
			visitedNodesInOrder = Astar(grid, startNode, finishNode);
			nodeInShortestPathOrder = reconstructPath(finishNode);
		} else if (this.state.algorithm === "DFS") {
			visitedNodesInOrder = depthFirstSearch(grid, startNode, finishNode);
			nodeInShortestPathOrder = NodesInPathOrder_DFS(finishNode);
		} else if (this.state.algorithm === "BFS") {
			visitedNodesInOrder = breadthFirstSearch(grid, startNode, finishNode);
			nodeInShortestPathOrder = NodesInPathOrder_BFS(finishNode);
		}
		this.animateVisitedNodes(visitedNodesInOrder, nodeInShortestPathOrder);
	}

	// Visualize Maze generation
	visualizeMaze() {
		if (this.state.visualizing === true) return;
		this.clearGrid();
		this.setState({ visualizing: true });

		const grid = this.state.grid;
		const startNode = grid[START_NODE_ROW][START_NODE_COL];
		const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];

		let walls;

		if (this.state.maze === "randomMaze") {
			walls = randomMaze(grid, startNode, finishNode);
		} else if (this.state.maze === "recursiveDivision") {
			walls = recursiveDivisionMaze(grid, startNode, finishNode);
		} else if (this.state.maze === "vertical") {
			walls = verticalMaze(grid, startNode, finishNode);
		}

		this.animateWalls(walls);
	}

	animateWalls(walls) {
		if (walls === undefined) return;
		const grid = this.createNewBoard();

		for (let i = 0; i < walls.length; i++) {
			// Animate the shortest path after animating dijkstra
			setTimeout(() => {
				const node = walls[i];
				grid[node.row][node.col].isWall = true;
				document.getElementById(`node-${node.row}-${node.col}`).className =
					"node node-wall";
			}, 5 * i);
		}
		setTimeout(() => {
			this.setState({ visualizing: false, grid });
		}, 5 * walls.length);
	}

	handleAlgoSelection = (childData) => {
		this.setState({ algorithm: childData });
		// testing
		setTimeout(() => {
			console.log(this.state.algorithm);
		}, 1000);
	};

	handleMazeSelection = (childData) => {
		this.setState({ maze: childData });
	};

	changeSpeed = (childData) => {
		this.setState({ speed: childData });
	};

	// NOT WORKING
	changeNodeSize = (childData) => {
		console.log(childData);
		if (childData === "grand") {
			this.setState({ nodeSize: "grand" });
			ROW_NUM = Math.floor((window.innerHeight * 0.75) / 15);
			COL_NUM = Math.floor(window.innerWidth / 15);
			START_NODE_ROW = 6;
			START_NODE_COL = 7;
			FINISH_NODE_ROW = ROW_NUM - 5;
			FINISH_NODE_COL = COL_NUM - 5;
			setTimeout(() => {
				console.log(this.state.nodeSize);
				this.setInitialGrid();
			}, 1000);
		}
	};

	render() {
		const { grid, mouseIsPressed } = this.state;
		return (
			<div className="main">
				<div className="main-navigation">
					<Navbar
						clearGrid={() => this.clearGrid()}
						selectAlgo={this.handleAlgoSelection}
						selectMaze={this.handleMazeSelection}
						changeSpeed={this.changeSpeed}
						// nodeSize={this.changeNodeSize}
						fire={() => this.visualizeAlgorithm()}
						generateMaze={() => this.visualizeMaze()}></Navbar>
				</div>

				{/* Initialize the grid */}
				<div className="grid">
					{grid.map((row, rowIdx) => {
						return (
							<div key={rowIdx} className="row-default">
								{row.map((node, nodeIdx) => {
									const { row, col, isFinish, isStart, isWall, nodeSize } = node;
									return (
										<Node
											// Pass in the props to Node component
											key={nodeIdx}
											col={col}
											row={row}
											nodeSize={nodeSize}
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
											onMouseUp={() => this.handleMouseUp()}></Node>
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
