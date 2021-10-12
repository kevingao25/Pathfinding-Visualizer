import React, { Component } from "react";
import Node from "./Node/Node";
import "bootswatch/dist/lux/bootstrap.min.css";
import "./PathfindingVisualizer.css";
import Navbar from "./navbar";
import { dijkstra, getNodesInShortestPathOrder } from "../Algorithms/dijkstra";
import { Astar, reconstructPath } from "../Algorithms/Astar";
import { randomMaze } from "../Algorithms/randomMaze";

const ROW_NUM = Math.floor((window.innerHeight * 0.75) / 25);
const COL_NUM = Math.floor(window.innerWidth / 25);
// console.log(ROW_NUM, COL_NUM);

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
			algorithm: "Dijkstra",
			maze: "randomMaze",
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

	clearWall() {
		if (this.state.visualizing === false) {
			for (let row = 0; row < ROW_NUM; row++) {
				for (let col = 0; col < COL_NUM; col++) {
					if (
						document.getElementById(`node-${row}-${col}`)
							.className === "node node-wall"
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
			this.clearWall();
			this.setInitialGrid();
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
			const newGrid = getNewGridWithWallToggled(
				this.state.grid,
				row,
				col
			);
			this.setState({ grid: newGrid, mouseIsPressed: true });
		}
	}

	handleMouseEnter(row, col) {
		if (this.state.mouseIsPressed && this.state.visualizing === false) {
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
		if (
			visitedNodesInOrder === undefined ||
			nodeInShortestPathOrder === undefined
		) {
			return;
		}
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

	// Part of visualizeAlgorithm
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
			console.log(visitedNodesInOrder);
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
			console.log(walls);
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
				document.getElementById(
					`node-${node.row}-${node.col}`
				).className = "node node-wall";
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
		}, 2000);
	};

	handleMazeSelection = (childData) => {
		this.setState({ maze: childData });
		// testing
		setTimeout(() => {
			console.log(this.state.maze);
		}, 2000);
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
						fire={() => this.visualizeAlgorithm()}
						generateMaze={() => this.visualizeMaze()}></Navbar>
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
											}></Node>
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
