import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EspeciePage } from './especie.page';

const routes: Routes = [
  {
    path: '',
    component: EspeciePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EspeciePageRoutingModule {}
