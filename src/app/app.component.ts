import { Component } from '@angular/core';
import { Board } from './models/board.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  numCols:number;
  numRows:number;
  dragStatus:number;
  generation: number;
  gameStatus: number; // -1 iddle; 0 active; 1 Paused

  board: Board;

  constructor() {
    this.numCols = 40;
    this.numRows = 40;
    this.generation = 0;
    this.gameStatus = -1;
    this.dragStatus = 0;

    this.board = new Board(this.numCols, this.numRows);
  }

  ngOnInit() {
    setInterval(() => {
      if(this.gameStatus === 0) {
        this.board.checkBoard();
        this.generation++;
      }
    }, 100);
  }

  onMouseOver(pRow, pCol) {
    this.dragStatus && this.board.changeStatus(pRow, pCol);
  }

  onSelectionStart(pRow, pCol) {
    this.board.changeStatus(pRow, pCol);
    this.dragStatus = 1;
  }

  onSelectionEnd() {
    this.dragStatus = 0;
  }

  onClickPause() {
    this.gameStatus = this.gameStatus === 0 ? 1 : 0;
  }

  onClear() {
    this.gameStatus = -1;
    this.board.reset();
  }
}
