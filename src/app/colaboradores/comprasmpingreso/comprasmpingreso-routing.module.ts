import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ComprasmpingresoPage } from './comprasmpingreso.page';

const routes: Routes = [
  {
    path: '',
    component: ComprasmpingresoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ComprasmpingresoPageRoutingModule {}
