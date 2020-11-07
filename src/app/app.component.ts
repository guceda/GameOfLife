import { Component } from '@angular/core';
import { Board } from './models/board.model';

import * as Highcharts from 'highcharts/highcharts';
import Exporting from 'highcharts/modules/exporting';
Exporting(Highcharts);

type LSBoard = { // LocalStorage item type
  board: number[][];
  id: string;
  name: string;
  created: number;
  period: number;
  aliveCells: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  numCols: number;
  numRows: number;
  dragStatus: number; // 0 none; 1 dragging;
  generation: number; // number of the current iteration
  gameStatus: number; // -1 iddle; 0 active; 1 Paused;
  interval: number; // interval between generations

  boards: any; // boards available in LS

  stats: number[];
  chart: any;

  board: Board;

  constructor() {
    this.numCols = 60;
    this.numRows = 60;
    this.generation = 0;
    this.gameStatus = -1;
    this.dragStatus = 0;
    this.interval = null;

    this.boards = null;

    this.chart = null;
    this.stats = [];

    this.board = new Board(this.numCols, this.numRows);
  }

  ngOnInit() {
    this.chart = this.generateChart();
    this.boards = this.fetchBoards();
  }

  generateChart() {
    return Highcharts.chart({
      tooltip: { enabled: false },
      title : {text:''},
      subtitle: { text:''},
      exporting: { enabled: false },
      chart: { type: 'line', renderTo:document.getElementById('chart')},
      legend: { enabled: false },
      xAxis: { visible: false },
      yAxis: { type: 'logarithmic', visible: false },
      credits: { enabled: false },
      series: [{ data: [], color: 'coral', type:'line' }],
      plotOptions: { series: { marker: { enabled: false } } }
    });
  }

  fetchBoards() {
    const boards = Object.values(this.getAllBoards());
    return boards.map((x: LSBoard) => ({ name: x.name, id: x.id }));
  }

  start() {
    this.interval = setInterval(() => {
      if (this.gameStatus === 0) {
        this.board.checkBoard();
        this.generation++;
        if (this.stats.length >= 1000) {
          this.stats.shift();
        }
        this.stats.push(this.board.alive);
        this.chart.series[0].setData(this.stats);
        this.chart.reflow(); //FIXME: fix size of chart...
      }
    }, 100);
  }

  onMouseOver(pRow, pCol) {
    this.dragStatus && this.board.changeStatus(pRow, pCol);
  }

  onSelectionStart(pRow, pCol) {
    this.board.changeStatus(pRow, pCol);
    this.dragStatus = 1;

    //stop when adding when active.
    if (this.gameStatus == 0) this.gameStatus = 1;
  }

  onSelectionEnd() {
    this.dragStatus = 0;

    //restart when adding when active.
    if (this.gameStatus == 1) this.gameStatus = 0;
  }

  onClickPause() {
    this.gameStatus === -1 && this.start();
    this.gameStatus = this.gameStatus === 0 ? 1 : 0;
  }

  onClear() {
    this.chart.series[0].setData([]);
    this.gameStatus = -1;
    this.board.reset();
    this.generation = 0;
    this.stats = [];
    clearInterval(this.interval);
  }

  randomize() {
    this.onClear();
    this.board.randomize();
    this.gameStatus = this.gameStatus === 0 ? 1 : 0;
    this.start();
  }

  onSaveBoard(name = null, period = null) {
    const board: number[][] = this.board.board;
    const storage = JSON.parse(localStorage.getItem('TGOL')) || {};

    const el: LSBoard = {
      board: board,
      id: `${Date.now()}-${name}`,
      name: name,
      created: Date.now(),
      period: period,
      aliveCells: this.board.alive,
    }

    const updated = Object.assign(storage, { [el.id]: el });
    this.boards.push({ name: el.name, id: el.id });
    localStorage.setItem('TGOL', JSON.stringify(updated));
  }

  onLoadBoard(id) {
    const storage = JSON.parse(localStorage.getItem('TGOL')) || {};
    const { board, aliveCells } = storage[id].board;

    this.board.updateBoard(board, aliveCells);
    this.chart.series[0].setData([]);
    this.generation = 0;
    this.gameStatus = 1;
    this.stats = [];
  }

  getAllBoards() {
    return JSON.parse(localStorage.getItem('TGOL')) || {};
  }

}
