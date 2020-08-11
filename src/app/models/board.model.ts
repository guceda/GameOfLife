'use strict';

export class Board {
    board: number[][];

    constructor(pWidth, pHeight) {
        this.board = [];
        //FIXME: sacar de aquí
        for (let i = 0; i < pWidth; i++) {
            this.board[i] = [];
            for (let j = 0; j < pHeight; j++) {
                this.board[i][j] = 0;
            }
        }
    }

    status(coordX: number, coordY: number): number {
        return this.board[coordX][coordY];
    }

    changeStatus(coordX: number, coordY: number) {
        //FIXME Cambiar el bit NOT
        this.board[coordX][coordY] = this.board[coordX][coordY] === 0 ? 1 : 0;
    }

    checkBoard() {
        //FIXME: simplify and optimize
        const tmpBoard = [];
        for (let i = 0; i < this.board.length; i++) {
            tmpBoard[i] = [];
            for (let j = 0; j < this.board[i].length; j++) {
                tmpBoard[i].push(this.checkRules(i,j));
            }
        }
        this.board = [...tmpBoard];
    }

    checkRules(coordX: number, coordY: number): number {
        //FIXME: crear ambas en el constructor
        const width = this.board.length;
        const height = this.board[0].length;

        //FIXME: sacar a metodos privados.
        // Si me salgo del tablero cojo por el otro lado
        const xPrev = coordX - 1 < 0 ? width - 1 : coordX - 1;
        const xNext = coordX + 1 >= width ? 0 : coordX + 1;

        const yPrev = coordY - 1 < 0 ? height - 1 : coordY - 1;
        const yNext = coordY + 1 >= height ? 0 : coordY + 1;

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
        if (currentStatus === 1 && neighbours == 2 || neighbours == 3) {
            return 1;
        }
        // Dead cell revives
        if (currentStatus === 0 && neighbours === 3) {
            return 1;
        } 
        return 0;
        
    }
}