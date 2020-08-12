import { Component } from '@angular/core';
import { Board } from './models/board.model';

import * as Highcharts from 'highcharts/highcharts';
import Exporting from 'highcharts/modules/exporting';
Exporting(Highcharts);

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  numCols: number;
  numRows: number;
  dragStatus: number;
  generation: number;
  gameStatus: number; // -1 iddle; 0 active; 1 Paused
  interval: number;

  stats: number[];
  chart: any;

  board: Board;

  constructor() {
    this.numCols = 40;
    this.numRows = 40;
    this.generation = 0;
    this.gameStatus = -1;
    this.dragStatus = 0;
    this.interval = null;

    this.chart = null;
    this.stats = [];

    this.board = new Board(this.numCols, this.numRows);
  }

  ngOnInit() {
    this.chart = Highcharts.chart(document.getElementById('chart'), {
      tooltip: { enabled: false },
      title: false,
      subtitle: false,
      exporting: { enabled: false },
      chart: { type: 'line' },
      legend: { enabled: false },
      xAxis: { visible:false },
      yAxis: { type:'logarithmic', visible:false},
      credits: { enabled: false },
      series: [{ data: [], color:'coral' }],
      plotOptions: { series: { marker: { enabled: false } } }
    });
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
    if(this.gameStatus == 0) this.gameStatus = 1;
  }

  onSelectionEnd() {
    this.dragStatus = 0;

    //restart when adding when active.
    if(this.gameStatus == 1) this.gameStatus = 0;
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
    this.stats= [];
    clearInterval(this.interval);
  }

  randomize() {
    this.onClear();
    this.board.randomize();
    this.gameStatus = this.gameStatus === 0 ? 1 : 0;
    this.start();
  }
}
