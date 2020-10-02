import { Component, OnInit } from '@angular/core';
import { NavParams } from '@ionic/angular';

@Component({
  selector: 'app-modal-documento',
  templateUrl: './modal-documento.component.html',
  styleUrls: ['./modal-documento.component.scss'],
})
export class ModalDocumentoComponent implements OnInit {
  archivo;

  constructor(
    private navParams: NavParams
  ) { }

  ngOnInit() {
    this.archivo = this.navParams.get('archivo');
  }

}
