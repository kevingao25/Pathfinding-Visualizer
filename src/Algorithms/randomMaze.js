export function randomMaze(grid, startNode, finishNode) {
	let newGrid = [];
	for (let row = 0; row < grid.length; row++) {
		for (let col = 0; col < grid[0].length; col++) {
			const currNode = grid[row][col];
			if (currNode === startNode || currNode === finishNode) continue;
			if (Math.random() < 0.33) {
				currNode.isWall = true;
				newGrid.push(currNode);
			}
		}
	}
	// newGrid.sort(() => Math.random() - 0.5);
	return newGrid;
}
