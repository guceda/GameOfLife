'use strict';

export class Board {
    board: number[][];
    width: number;
    height: number; alive: number;

    constructor(pWidth, pHeight) {
        this.width = pWidth;
        this.height = pHeight;
        this.alive = 0;
        this.board = this._initialize();
    }

    randomize() {
        const board = [];
        this.alive = 0;
        const rdm = () =>(Math.random()>0.8)? 1 : 0;
        for (let i = 0; i < this.width; i++) {
            board[i] = [];
            for (let j = 0; j < this.height; j++) {
                const rd = rdm();
                this.alive += rd;
                board[i][j] = rd;
            }
        }
        this.board = board;
    }


    _initialize() {
        const board = [];
        for (let i = 0; i < this.width; i++) {
            board[i] = [];
            for (let j = 0; j < this.height; j++) {
                board[i][j] = 0;
            }
        }
        return board;
    }

    reset() {
        this.alive = 0;
        this.board = this._initialize();
    }

    status(coordX: number, coordY: number): number {
        return this.board[coordX][coordY];
    }

    changeStatus(coordX: number, coordY: number) {
        if (this.board[coordX][coordY] === 0) {
            this.board[coordX][coordY] = 1;
            this.alive++;
        } else {
            this.board[coordX][coordY] = 0;
            this.alive--;
        }
    }

    checkBoard() {
        const tmpBoard = [];
        for (let i = 0; i < this.board.length; i++) {
            tmpBoard[i] = [];
            for (let j = 0; j < this.board[i].length; j++) {
                const newState = this.checkRules(i, j);
                tmpBoard[i].push(newState);
            }
        }
        this.board = [...tmpBoard];
    }

    checkRules(coordX: number, coordY: number): number {
        // Si me salgo del tablero cojo por el otro lado
        const xPrev = coordX - 1 < 0 ? this.width - 1 : coordX - 1;
        const xNext = coordX + 1 >= this.width ? 0 : coordX + 1;

        const yPrev = coordY - 1 < 0 ? this.height - 1 : coordY - 1;
        const yNext = coordY + 1 >= this.height ? 0 : coordY + 1;

        const currentStatus = this.status(coordX, coordY);

        const neighbours =
            this.board[xPrev][yPrev] +
            this.board[xPrev][coordY] +
            this.board[xPrev][yNext] +
            this.board[coordX][yPrev] +
            this.board[coordX][yNext] +
            this.board[xNext][yPrev] +
            this.board[xNext][coordY] +
            this.board[xNext][yNext];

        // Alive cell keeps living
        if (currentStatus === 1 && (neighbours == 2 || neighbours == 3)) {
            return 1;
        }
        // Dead cell revives
        if (currentStatus === 0 && neighbours === 3) {
            this.alive++;
            return 1;
        }

        if (currentStatus === 1) this.alive--;
        return 0;

    }
}