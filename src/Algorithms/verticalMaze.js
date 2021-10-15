let walls;
export function verticalMaze(grid, startNode, finishNode) {
	let vertical = range(grid[0].length);
	let horizontal = range(grid.length);
	walls = [];
	getVerticalWalls(vertical, horizontal, startNode, finishNode);
	for (let i = 0; i < walls.length; i++) {
		const currentNode = grid[walls[i][0]][walls[i][1]];
		walls[i] = currentNode;
	}
	return walls;
}

function range(len) {
	let result = [];
	for (let i = 0; i < len; i++) {
		result.push(i);
	}
	return result;
}

function getVerticalWalls(vertical, horizontal, startNode, finishNode) {
	if (vertical.length < 2) {
		return;
	}

	let choice = Math.floor(Math.random() * 2);
	for (let num of vertical) {
		if (choice === 0 && num % 2 !== 0) {
			addWall(num, horizontal, startNode, finishNode);
		}
		if (choice === 1 && num % 2 === 0) {
			addWall(num, horizontal, startNode, finishNode);
		}
	}
}

function addWall(num, horizontal, startNode, finishNode) {
	let isStartFinish = false;
	let tempWalls = [];
	for (let temp of horizontal) {
		if (
			(temp === startNode.row && num === startNode.col) ||
			(temp === finishNode.row && num === finishNode.col)
		) {
			isStartFinish = true;
			continue;
		}
		tempWalls.push([temp, num]);
	}
	if (!isStartFinish) {
		tempWalls.splice(Math.floor(Math.random() * tempWalls.length), 1);
	}
	for (let wall of tempWalls) {
		walls.push(wall);
	}
}
