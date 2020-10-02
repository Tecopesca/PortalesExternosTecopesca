import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-casilla-detalle',
  templateUrl: './casilla-detalle.component.html',
  styleUrls: ['./casilla-detalle.component.scss'],
})
export class CasillaDetalleComponent implements OnInit {

  @Input() dato: string;

  @Input() dato2: string;

  constructor() {}

  ngOnInit() {
   console.log(this.dato);
   console.log(this.dato2);

  }

}
