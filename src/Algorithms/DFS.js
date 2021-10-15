export function depthFirstSearch(grid, startNode, finishNode) {
	// Initial setup
	let unvisitedNodes = [];
	let visitedNodesInOrder = [];
	unvisitedNodes.push(startNode);

	// BFS call
	while (unvisitedNodes.length !== 0) {
		let closestNode = unvisitedNodes.shift();
		if (closestNode.isWall) continue;
		if (closestNode === finishNode) break;

		visitedNodesInOrder.push(closestNode);
		closestNode.isVisited = true;

		// Get neighbors
		let unvisitedNeighbours = getUnvisitedNeighbours(closestNode, grid);
		for (let neighbor of unvisitedNeighbours) {
			neighbor.previousNode = closestNode;
			unvisitedNodes.unshift(neighbor);
		}
	}
	return visitedNodesInOrder;
}

function getUnvisitedNeighbours(node, grid) {
	let neighbours = [];
	let { row, col } = node;
	if (col !== 0) neighbours.push(grid[row][col - 1]);
	if (row !== 0) neighbours.push(grid[row - 1][col]);
	if (col !== grid[0].length - 1) neighbours.push(grid[row][col + 1]);
	if (row !== grid.length - 1) neighbours.push(grid[row + 1][col]);
	return neighbours.filter((neighbour) => !neighbour.isVisited);
}

export function NodesInPathOrder_DFS(finishNode) {
	let nodesInShortestPathOrder = [];
	let currentNode = finishNode;
	while (currentNode !== null) {
		nodesInShortestPathOrder.unshift(currentNode);
		currentNode = currentNode.previousNode;
	}
	return nodesInShortestPathOrder;
}
