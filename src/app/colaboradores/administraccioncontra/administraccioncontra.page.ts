import { Component, OnInit } from '@angular/core';
import { ColumnMode } from '@swimlane/ngx-datatable';

@Component({
  selector: 'app-administraccioncontra',
  templateUrl: './administraccioncontra.page.html',
  styleUrls: ['./administraccioncontra.page.scss'],
})
export class AdministraccioncontraPage implements OnInit {

  constructor() { }

  ColumnMode = ColumnMode;
  rows = [];

  ngOnInit() {
  }

}
