import React, { Component } from "react";
import "./App.css";

const COLORS = [
    "red",
    "yellow",
    "green",
    "blue",
    "purple",
    "orange",
    "pink",
    "brown",
];

class StartScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rows: 6,
            cols: 7,
            player1Color: "red",
            player2Color: "yellow",
            error: "",
        };
    }

    handleStart = () => {
        const { rows, cols, player1Color, player2Color } = this.state;
        if (rows < 4 || rows > 20 || cols < 4 || cols > 20) {
            this.setState({ error: "Rows and columns must be between 4 and 20." });
            return;
        }
        if (player1Color === player2Color) {
            this.setState({ error: "Player 1 and Player 2 cannot choose the same color." });
            return;
        }
        this.setState({ error: "" });
        this.props.onStartGame(rows, cols, player1Color, player2Color);
    };

    render() {
        return (
            <div className="start-screen-container">
                <h2>Game Settings</h2>
                <div>
                    <label>Rows (Height): </label>
                    <input
                        type="number"
                        min={4}
                        max={20}
                        value={this.state.rows}
                        onChange={(e) => this.setState({ rows: +e.target.value })}
                    />
                </div>
                <div>
                    <label>Columns (Width): </label>
                    <input
                        type="number"
                        min={4}
                        max={20}
                        value={this.state.cols}
                        onChange={(e) => this.setState({ cols: +e.target.value })}
                    />
                </div>
                <div>
                    <label>Player 1 Color: </label>
                    <select
                        value={this.state.player1Color}
                        onChange={(e) => this.setState({ player1Color: e.target.value })}
                    >
                        {COLORS.map((c) => (
                            <option key={c} value={c}>
                                {c}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>Player 2 Color: </label>
                    <select
                        value={this.state.player2Color}
                        onChange={(e) => this.setState({ player2Color: e.target.value })}
                    >
                        {COLORS.map((c) => (
                            <option key={c} value={c} disabled={c === this.state.player1Color}>
                                {c}
                            </option>
                        ))}
                    </select>
                </div>
                {this.state.error && <p className="error-message">{this.state.error}</p>}
                <button onClick={this.handleStart}>Start Game</button>
            </div>
        );
    }
}

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            gameStarted: false,
            rows: 6,
            cols: 7,
            board: [],
            currentPlayer: 1,
            player1Color: "red",
            player2Color: "yellow",
            winner: null,
        };
    }

    initBoard = (rows, cols) => {
        const board = [];
        for (let r = 0; r < rows; r++) {
            board.push(new Array(cols).fill(0));
        }
        return board;
    };

    handleStartGame = (rows, cols, p1Color, p2Color) => {
        this.setState({
            gameStarted: true,
            rows,
            cols,
            board: this.initBoard(rows, cols),
            currentPlayer: 1,
            player1Color: p1Color,
            player2Color: p2Color,
            winner: null,
        });
    };

    handleCellClick = (colIndex) => {
        if (this.state.winner) return;

        const { board, rows, currentPlayer } = this.state;
        const newBoard = board.map((row) => row.slice());
        let placedRow = -1;
        for (let r = rows - 1; r >= 0; r--) {
            if (newBoard[r][colIndex] === 0) {
                placedRow = r;
                break;
            }
        }
        if (placedRow === -1) return;

        newBoard[placedRow][colIndex] = currentPlayer;
        const winner = this.checkWinner(newBoard, placedRow, colIndex, currentPlayer);

        this.setState({
            board: newBoard,
            currentPlayer: winner ? currentPlayer : currentPlayer === 1 ? 2 : 1,
            winner,
        });
    };

    checkWinner = (board, row, col, player) => {
        const directions = [
            { dr: 0, dc: 1 },
            { dr: 1, dc: 0 },
            { dr: 1, dc: 1 },
            { dr: 1, dc: -1 },
        ];

        for (let { dr, dc } of directions) {
            let count = 1;
            let r = row + dr, c = col + dc;
            while (r >= 0 && r < this.state.rows && c >= 0 && c < this.state.cols && board[r][c] === player) {
                count++;
                r += dr;
                c += dc;
            }
            r = row - dr; c = col - dc;
            while (r >= 0 && r < this.state.rows && c >= 0 && c < this.state.cols && board[r][c] === player) {
                count++;
                r -= dr;
                c -= dc;
            }
            if (count >= 4) return true;
        }
        return false;
    };

    handleRestart = () => {
        this.setState({ gameStarted: false });
    };

    render() {
        if (!this.state.gameStarted) {
            return <StartScreen onStartGame={this.handleStartGame} COLORS={COLORS} />;
        }

        const { board, currentPlayer, winner, player1Color, player2Color, rows, cols } = this.state;

        return (
            <div style={{ textAlign: "center" }}>
                <div
                    className="board"
                    style={{
                        display: "grid",
                        gridTemplateColumns: `repeat(${cols}, 60px)`,
                        gridTemplateRows: `repeat(${rows}, 60px)`,
                        gap: "5px",
                        margin: "20px auto",
                    }}
                >
                    {board.map((row, rIdx) =>
                        row.map((cell, cIdx) => {
                            const cellClass = cell === 1 ? "player1" : cell === 2 ? "player2" : "";
                            const style = {};
                            if (cell === 1) style.backgroundColor = player1Color;
                            else if (cell === 2) style.backgroundColor = player2Color;
                            return (
                                <div
                                    key={`${rIdx}-${cIdx}`}
                                    className={`cell ${cellClass}`}
                                    style={style}
                                    onClick={() => this.handleCellClick(cIdx)}
                                />
                            );
                        })
                    )}
                </div>

                {!winner ? (
                    <div className="current-player">
                        Player {currentPlayer}'s turn{' '}
                        <span style={{ color: currentPlayer === 1 ? player1Color : player2Color }}>●</span>
                    </div>
                ) : (
                    <div
                        className="current-player"
                        style={{
                            color: winner === 1 ? player1Color : player2Color,
                            fontWeight: "bold",
                            fontSize: "24px",
                        }}
                    >
                        Player {winner} wins!
                    </div>
                )}

                <button className="restart-button" onClick={this.handleRestart}>
                    Back to Settings
                </button>
            </div>
        );
    }
}

export default App;







