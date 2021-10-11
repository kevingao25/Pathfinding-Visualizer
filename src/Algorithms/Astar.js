export function Astar(grid, startNode, finishNode) {
	// Initial set up
	startNode.distance = 0;
	startNode.estimatedDistanceToEnd = calculatedManhattanDistance(
		startNode,
		finishNode
	);
	const nodesToVisit = new MinHeap([startNode]);
	const visitedNodesInOrder = [];

	// Computer shortest path
	while (!nodesToVisit.isEmpty()) {
		const currentMinDistanceNode = nodesToVisit.remove();
		if (currentMinDistanceNode === finishNode) break;
		// visitedNodesInOrder.push(currentMinDistanceNode);

		const neighbors = getNeighboringNodes(currentMinDistanceNode, grid);

		for (const neighbor of neighbors) {
			if (neighbor.isWall) continue; // neighbor is a wall
			visitedNodesInOrder.push(neighbor);

			const tentativeDistanceToNeighbor =
				currentMinDistanceNode.distance + 1;

			if (tentativeDistanceToNeighbor >= neighbor.distance) continue; // already has shorter path

			neighbor.previousNode = currentMinDistanceNode;
			neighbor.distance = tentativeDistanceToNeighbor;
			neighbor.estimatedDistanceToEnd =
				tentativeDistanceToNeighbor +
				calculatedManhattanDistance(neighbor, finishNode);

			if (!nodesToVisit.containsNode(neighbor)) {
				nodesToVisit.insert(neighbor);
			} else {
				nodesToVisit.update(neighbor);
			}
		}
	}
	return visitedNodesInOrder;
}

export function reconstructPath(finishNode) {
	if (finishNode.previousNode == null) {
		return [];
	}
	let currentNode = finishNode;
	const path = [];

	while (currentNode != null) {
		path.push(currentNode);
		currentNode = currentNode.previousNode;
	}

	path.reverse();
	return path;
}

function calculatedManhattanDistance(currentNode, finishNode) {
	const currentRow = currentNode.row;
	const currentCol = currentNode.col;
	const finishRow = finishNode.row;
	const finishCol = finishNode.col;
	return Math.abs(currentRow - finishRow) + Math.abs(currentCol - finishCol);
}

function getNeighboringNodes(node, grid) {
	const neighbors = [];
	const numRows = grid.length;
	const numCols = grid[0].length;
	const row = node.row;
	const col = node.col;

	// Down
	if (row < numRows - 1) {
		neighbors.push(grid[row + 1][col]);
	}

	// Up
	if (row > 0) {
		neighbors.push(grid[row - 1][col]);
	}

	// Right
	if (col < numCols - 1) {
		neighbors.push(grid[row][col + 1]);
	}

	// Left
	if (col > 0) {
		neighbors.push(grid[row][col - 1]);
	}

	return neighbors;
}

// ------------------------------------------------------------------------

class MinHeap {
	constructor(array) {
		// Holds the position in heap that each node is at
		this.nodePositionsInHeap = array.reduce((obj, node, i) => {
			obj[node.id] = i;
			return obj;
		}, {});
		this.heap = this.buildHeap(array);
	}

	isEmpty() {
		return this.heap.length === 0;
	}

	// O(n) time | O(1) space
	buildHeap(array) {
		const firstParentIdx = Math.floor((array.length - 2) / 2);
		for (let currentIdx = firstParentIdx; currentIdx >= 0; currentIdx--) {
			this.siftDown(currentIdx, array.length - 1, array);
		}
		return array;
	}

	// O(log(n)) time | O(1) space
	siftDown(currentIdx, endIdx, heap) {
		let childOneIdx = currentIdx * 2 + 1;
		while (childOneIdx <= endIdx) {
			const childTwoIdx =
				currentIdx * 2 + 2 <= endIdx ? currentIdx * 2 + 2 : -1;
			let idxToSwap;
			if (
				childTwoIdx !== -1 &&
				heap[childTwoIdx].estimatedDistanceToEnd <
					heap[childOneIdx].estimatedDistanceToEnd
			) {
				idxToSwap = childTwoIdx;
			} else {
				idxToSwap = childOneIdx;
			}
			if (
				heap[idxToSwap].estimatedDistanceToEnd <
				heap[currentIdx].estimatedDistanceToEnd
			) {
				this.swap(currentIdx, idxToSwap, heap);
				currentIdx = idxToSwap;
				childOneIdx = currentIdx * 2 + 1;
			} else {
				return;
			}
		}
	}

	// O(log(n)) time | O(1) space
	siftUp(currentIdx, heap) {
		let parentIdx = Math.floor((currentIdx - 1) / 2);
		while (
			currentIdx > 0 &&
			heap[currentIdx].estimatedDistanceToEnd <
				heap[parentIdx].estimatedDistanceToEnd
		) {
			this.swap(currentIdx, parentIdx, heap);
			currentIdx = parentIdx;
			parentIdx = Math.floor((currentIdx - 1) / 2);
		}
	}

	// O(log(n)) time | O(1) space
	remove() {
		if (this.isEmpty()) return;

		this.swap(0, this.heap.length - 1, this.heap);
		const node = this.heap.pop();
		delete this.nodePositionsInHeap[node.id];
		this.siftDown(0, this.heap.length - 1, this.heap);
		return node;
	}

	// O(log(n)) time | O(1) space
	insert(node) {
		this.heap.push(node);
		this.nodePositionsInHeap[node.id] = this.heap.length - 1;
		this.siftUp(this.heap.length - 1, this.heap);
	}

	swap(i, j, heap) {
		this.nodePositionsInHeap[this.heap[i].id] = j;
		this.nodePositionsInHeap[this.heap[j].id] = i;
		const temp = heap[j];
		heap[j] = heap[i];
		heap[i] = temp;
	}

	containsNode(node) {
		return node.id in this.nodePositionsInHeap;
	}

	update(node) {
		this.siftUp(this.nodePositionsInHeap[node.id], this.heap);
	}
}
