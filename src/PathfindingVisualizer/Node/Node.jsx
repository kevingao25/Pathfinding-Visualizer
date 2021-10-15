import React, { Component } from "react";
import "./Node.css";

export default class Node extends Component {
	// Only re-render the node if the prop of node has change.
	shouldComponentUpdate(nextProps, nextState) {
		return this.props.isWall !== nextProps.isWall;
	}

	render() {
		// Pass in the node type from props
		const {
			col,
			row,
			nodeSize,
			isFinish,
			isStart,
			isWall,
			onMouseDown,
			onMouseEnter,
			onMouseUp,
		} = this.props;

		// Return the correct class name for each node
		function getSecondClassName(isFinish, isStart, isWall) {
			if (isFinish) {
				return "node-finish";
			} else if (isStart) {
				return "node-start";
			} else if (isWall) {
				return "node-wall";
			} else {
				return "";
			}
		}

		function getFirstClassName(nodeSize) {
			if (nodeSize === "grand") {
				return "node-grand";
			} else {
				return "node";
			}
		}

		const nodeClassName = getFirstClassName(nodeSize);
		const extraClassName = getSecondClassName(isFinish, isStart, isWall);

		return (
			<div
				id={`node-${row}-${col}`}
				className={`${nodeClassName} ${extraClassName}`}
				onMouseUp={() => onMouseUp()}
				onMouseEnter={() => onMouseEnter(row, col)}
				onMouseDown={() => onMouseDown(row, col)}></div>
		);
	}
}
