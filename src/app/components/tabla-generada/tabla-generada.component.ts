import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tabla-generada',
  templateUrl: './tabla-generada.component.html',
  styleUrls: ['./tabla-generada.component.scss'],
})
export class TablaGeneradaComponent implements OnInit {

  constructor() { }

  ngOnInit() {}

  rows = [
    { name: 'Austin', gender: 'Male', company: 'Swimlane' },
    { name: 'Dany', gender: 'Male', company: 'KFC' },
    { name: 'Molly', gender: 'Female', company: 'Burger King' },
  ];
  columns = [
    { prop: 'name' },
    { name: 'Gender' },
    { name: 'Company' }
  ];

}
