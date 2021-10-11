// Implementation of dijkstra's algorithm
// Returns all the visited nodes, and nodes point back to their previous node
// allowing us to compute the shortest path by backtracking from the finish node.
// Typically, we use a minHeap.

export function dijkstra(grid, startNode, finishNode) {
	const visitedNodesInOrder = [];
	const unvisitedNodes = getAllNodes(grid); // Note that unvisitedNode contains all nodes
	startNode.distance = 0;

	// Keep iterating until there are no more unvisited nodes
	while (!!unvisitedNodes.length) {
		// Reverse sort by shortest distance and get closest node
		unvisitedNodes.sort((nodeA, nodeB) => nodeB.distance - nodeA.distance);
		const closestNode = unvisitedNodes.pop();

		// If we encounter a wall, continue
		if (closestNode.isWall) continue;

		// Cases where we return the visitedNodesInOrder
		if (closestNode.distance === Infinity || closestNode === finishNode) {
			return visitedNodesInOrder;
		}
		closestNode.isVisited = true;
		visitedNodesInOrder.push(closestNode);

		// Update the unvisited neighbors
		updateUnvisitedNeighbors(closestNode, grid);
	}
}

// Unpack two dimensional grid into one dimensional nodes
function getAllNodes(grid) {
	const nodes = [];
	for (const row of grid) {
		for (const node of row) {
			nodes.push(node);
		}
	}
	return nodes;
}

function updateUnvisitedNeighbors(node, grid) {
	// Get all neighbors and filters out the visited nodes
	const neighbors = [];
	const { col, row } = node;
	if (row > 0) neighbors.push(grid[row - 1][col]);
	if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
	if (col > 0) neighbors.push(grid[row][col - 1]);
	if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
	const unvisitedNeighbors = neighbors.filter(
		(neighbor) => !neighbor.isVisited
	);

	// Update the distance of neighbor nodes
	for (const neighbor of unvisitedNeighbors) {
		neighbor.distance = node.distance + 1;
		neighbor.previousNode = node;
	}
}
// Backtrack from finish node to start node to get the shortest path
export function getNodesInShortestPathOrder(finishNode, startNode) {
	const nodesInShortestPathOrder = [];
	let currentNode = finishNode;
	while (currentNode !== null) {
		nodesInShortestPathOrder.unshift(currentNode);
		currentNode = currentNode.previousNode;
	}
	return nodesInShortestPathOrder;
}
