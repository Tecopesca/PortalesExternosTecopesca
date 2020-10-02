import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ArmadormpPage } from './armadormp.page';

const routes: Routes = [
  {
    path: '',
    component: ArmadormpPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ArmadormpPageRoutingModule {}
