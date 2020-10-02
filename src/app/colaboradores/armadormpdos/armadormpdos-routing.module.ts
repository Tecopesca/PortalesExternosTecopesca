import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ArmadormpdosPage } from './armadormpdos.page';

const routes: Routes = [
  {
    path: '',
    component: ArmadormpdosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ArmadormpdosPageRoutingModule {}
