import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ComprasmpPage } from './comprasmp.page';

const routes: Routes = [
  {
    path: '',
    component: ComprasmpPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ComprasmpPageRoutingModule {}
