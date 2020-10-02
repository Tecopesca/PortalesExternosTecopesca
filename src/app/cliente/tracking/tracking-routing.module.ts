import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TrackingPage } from './tracking.page';
import { ClienteService } from 'src/app/servicios/cliente.service';

const routes: Routes = [
  {
    path: '',
    component: TrackingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [
    ClienteService,
    ],
})
export class TrackingPageRoutingModule {}
