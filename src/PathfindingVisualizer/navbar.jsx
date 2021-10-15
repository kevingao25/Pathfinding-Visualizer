import React, { Component } from "react";
import "jquery/dist/jquery.min.js";
import "bootstrap/dist/js/bootstrap.min.js"; // This ensure the dropdown works correctly
// import "bootstrap/dist/css/bootstrap.min.css";
// import "bootstrap/dist/css/bootstrap.min.css";
// import Popper from "popper.js";
import "bootswatch/dist/lux/bootstrap.min.css";
import "./navbar.css";

export default class Navbar extends Component {
	constructor() {
		super();
		this.state = {
			algorithm: "Dijkstra",
			maze: "Generate Maze",
		};
	}

	selectAlgorithm(selection) {
		this.setState({ algorithm: selection });
		this.props.selectAlgo(selection);
	}

	selectMaze(selection) {
		this.setState({ maze: selection });
		this.props.selectMaze(selection);
	}

	changeSpeed(selection) {
		this.props.changeSpeed(selection);
	}

	render() {
		const { clearGrid, fire, generateMaze } = this.props;

		const algoName = this.state.algorithm;

		return (
			<div>
				<nav className="navbar navbar-expand-lg navbar-dark bg-primary">
					<div className="container-fluid">
						<a
							className="navbar-brand"
							href="/#"
							onClick={() => window.location.reload()}>
							Kev's Mazer
						</a>
						<button
							className="navbar-toggler"
							type="button"
							data-bs-toggle="collapse"
							data-bs-target="#navbarColor01"
							aria-controls="navbarColor01"
							aria-expanded="false"
							aria-label="Toggle navigation">
							<span className="navbar-toggler-icon"></span>
						</button>

						<div className="collapse navbar-collapse" id="navbarColor01">
							<ul className="navbar-nav me-auto">
								{/* Select Algorithms */}
								<li className="nav-item dropdown">
									<a
										className="nav-link dropdown-toggle"
										data-bs-toggle="dropdown"
										href="/#"
										role="button"
										aria-haspopup="true"
										aria-expanded="false">
										Select Algorithms
									</a>
									<div className="dropdown-menu">
										<a
											className="dropdown-item"
											data-toggle="tab"
											href="/#"
											onClick={() => this.selectAlgorithm("Dijkstra")}>
											Dijkstra's Algorithm
										</a>
										<a
											className="dropdown-item"
											data-toggle="tab"
											href="/#"
											onClick={() => this.selectAlgorithm("A*")}>
											A Star Algorithm
										</a>
										<a
											className="dropdown-item"
											data-toggle="tab"
											href="/#"
											onClick={() => this.selectAlgorithm("DFS")}>
											Depth First Search (DFS)
										</a>

										{/* <div className="dropdown-divider"></div> */}
										<a
											className="dropdown-item"
											data-toggle="tab"
											href="/#"
											onClick={() => this.selectAlgorithm("BFS")}>
											Breath First Search (BFS)
										</a>
									</div>
								</li>

								{/* Select Maze */}
								<li className="nav-item dropdown">
									<a
										className="nav-link dropdown-toggle"
										data-bs-toggle="dropdown"
										href="/#"
										role="button"
										aria-haspopup="true"
										aria-expanded="false">
										Maze Generator
									</a>
									<div className="dropdown-menu">
										<a
											className="dropdown-item"
											data-toggle="tab"
											href="/#"
											onClick={() => this.selectMaze("randomMaze")}>
											Random Maze
										</a>
										<a
											className="dropdown-item"
											data-toggle="tab"
											href="/#"
											onClick={() => this.selectMaze("Prim")}>
											Prim's Algorithm
										</a>
										<a
											className="dropdown-item"
											data-toggle="tab"
											href="/#"
											onClick={() => this.selectMaze("...")}>
											Something else here
										</a>
									</div>
								</li>

								{/* Change Speed */}
								<li className="nav-item dropdown">
									<a
										className="nav-link dropdown-toggle"
										data-bs-toggle="dropdown"
										href="/#"
										role="button"
										aria-haspopup="true"
										aria-expanded="false">
										Change Visualize Speed
									</a>
									<div className="dropdown-menu">
										<a
											className="dropdown-item"
											data-toggle="tab"
											href="/#"
											onClick={() => this.changeSpeed(30)}>
											Slow
										</a>
										<a
											className="dropdown-item"
											data-toggle="tab"
											href="/#"
											onClick={() => this.changeSpeed(15)}>
											Normal
										</a>
										<a
											className="dropdown-item"
											data-toggle="tab"
											href="/#"
											onClick={() => this.changeSpeed(2)}>
											Fast
										</a>
									</div>
								</li>
							</ul>
						</div>
					</div>
				</nav>
				<div className="fireBtn">
					<h1>Pathfinding Visualizer</h1>
					<button className="bg-info" onClick={() => generateMaze()}>
						Generate Maze
					</button>
					<button
						className="bg-warning"
						// Change later
						onClick={() => fire()}>
						Visualize {algoName} Algorithm
					</button>
					<button className="bg-dark text-light" onClick={() => clearGrid()}>
						Clear Board
					</button>
				</div>
			</div>
		);
	}
}
