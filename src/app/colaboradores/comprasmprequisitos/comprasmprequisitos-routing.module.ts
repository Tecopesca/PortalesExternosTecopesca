import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ComprasmprequisitosPage } from './comprasmprequisitos.page';

const routes: Routes = [
  {
    path: '',
    component: ComprasmprequisitosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ComprasmprequisitosPageRoutingModule {}
