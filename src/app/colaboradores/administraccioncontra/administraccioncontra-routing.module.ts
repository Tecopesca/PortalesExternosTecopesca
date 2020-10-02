import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdministraccioncontraPage } from './administraccioncontra.page';

const routes: Routes = [
  {
    path: '',
    component: AdministraccioncontraPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdministraccioncontraPageRoutingModule {}
