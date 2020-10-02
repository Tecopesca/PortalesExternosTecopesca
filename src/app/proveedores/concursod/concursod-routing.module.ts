import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConcursodPage } from './concursod.page';

const routes: Routes = [
  {
    path: '',
    component: ConcursodPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConcursodPageRoutingModule {}
