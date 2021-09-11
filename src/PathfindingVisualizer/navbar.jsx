import React, { Component } from "react";
import "jquery/dist/jquery.min.js";
import "bootstrap/dist/js/bootstrap.min.js"; // This ensure the dropdown works correctly
// import "bootstrap/dist/css/bootstrap.min.css";
// import "bootstrap/dist/css/bootstrap.min.css";
// import Popper from "popper.js";
import "bootswatch/dist/lux/bootstrap.min.css";
import "./navbar.css";

export default class Navbar extends Component {
    // constructor() {
    //     super();

    // }

    render() {
        return (
            <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
                <div className="container-fluid">
                    <a
                        className="navbar-brand"
                        href="/#"
                        onClick={() => window.location.reload()}
                    >
                        Kev's Mazer
                    </a>
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarColor01"
                        aria-controls="navbarColor01"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div
                        className="collapse navbar-collapse"
                        id="navbarColor01"
                    >
                        <ul className="navbar-nav me-auto">
                            {/* Select Algorithms */}
                            <li className="nav-item dropdown">
                                <a
                                    className="nav-link dropdown-toggle"
                                    data-bs-toggle="dropdown"
                                    href="/#"
                                    role="button"
                                    aria-haspopup="true"
                                    aria-expanded="false"
                                >
                                    Select Algorithms
                                </a>
                                <div className="dropdown-menu">
                                    <a
                                        className="dropdown-item"
                                        data-toggle="tab"
                                        href="/#"
                                    >
                                        Dijkstra's Algorithm
                                    </a>
                                    <a
                                        className="dropdown-item"
                                        data-toggle="tab"
                                        href="/#"
                                    >
                                        A Star Algorithm
                                    </a>
                                    <a
                                        className="dropdown-item"
                                        data-toggle="tab"
                                        href="/#"
                                    >
                                        Depth First Search
                                    </a>

                                    <div className="dropdown-divider"></div>
                                    <a
                                        className="dropdown-item"
                                        data-toggle="tab"
                                        href="/#"
                                    >
                                        Separated link
                                    </a>
                                </div>
                            </li>

                            {/* Select Algorithms */}
                            <li className="nav-item dropdown">
                                <a
                                    className="nav-link dropdown-toggle"
                                    data-bs-toggle="dropdown"
                                    href="/#"
                                    role="button"
                                    aria-haspopup="true"
                                    aria-expanded="false"
                                >
                                    Maze Generator
                                </a>
                                <div className="dropdown-menu">
                                    <a
                                        className="dropdown-item"
                                        data-toggle="tab"
                                        href="/#"
                                    >
                                        Dijkstra
                                    </a>
                                    <a
                                        className="dropdown-item"
                                        data-toggle="tab"
                                        href="/#"
                                    >
                                        Another action
                                    </a>
                                    <a
                                        className="dropdown-item"
                                        data-toggle="tab"
                                        href="/#"
                                    >
                                        Something else here
                                    </a>

                                    <div className="dropdown-divider"></div>
                                    <a
                                        className="dropdown-item"
                                        data-toggle="tab"
                                        href="/#"
                                    >
                                        Separated link
                                    </a>
                                </div>
                            </li>

                            <li className="nav-item">
                                <a className="nav-link" href="/#">
                                    Generate Maze
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        );
    }
}
