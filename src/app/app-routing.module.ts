import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import {LoginGuard} from './guard/login.guard';
import {AuthGuard} from './guard/auth.guard';
import {SeguGuard} from './guard/segu.guard';
import {SeguriGuard} from './guard/seguri.guard';
import {AuthproveedorGuard} from './guard/authproveedor.guard';
import {AuthcolaboradorGuard} from './guard/authcolaborador.guard';

const routes: Routes = [
 // { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: '',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule) ,canActivate:[AuthGuard]
  },
  
  {
    path: 'login',
    loadChildren: () => import('./cliente/logincliente/logincliente.module').then( m => m.LoginclientePageModule) 
  },
  
  {
    path: 'inicio/clientes',
    loadChildren: () => import('./cliente/home/home.module').then( m => m.HomePageModule),canActivate:[SeguGuard]
  },
  {
    path: 'clientes/tracking',
    loadChildren: () => import('./cliente/tracking/tracking.module').then( m => m.TrackingPageModule),canActivate:[SeguGuard]
  },
  {
    path: 'clientes/detalle',
    loadChildren: () => import('./cliente/detalle/detalle.module').then( m => m.DetallePageModule),canActivate:[SeguGuard]
  },
  {
    path: 'clientes/gestion',
    loadChildren: () => import('./cliente/gestion/gestion.module').then( m => m.GestionPageModule),canActivate:[SeguGuard]
  },
  
  {
    path: 'inicio/proveedores',
    loadChildren: () => import('./proveedores/inicio/inicio.module').then( m => m.InicioPageModule),canActivate:[AuthproveedorGuard]
  },
  {
    path: 'proveedores/concurso/:parametro',
    loadChildren: () => import('./proveedores/concursod/concursod.module').then( m => m.ConcursodPageModule),canActivate:[AuthproveedorGuard]
  },
  {
    path: 'proveedores/factura',
    loadChildren: () => import('./proveedores/factura/factura.module').then( m => m.FacturaPageModule),canActivate:[AuthproveedorGuard]
  },
  {
    path: 'proveedores/datos',
    loadChildren: () => import('./proveedores/datos/datos.module').then( m => m.DatosPageModule),canActivate:[AuthproveedorGuard]
  },
  {
    path: 'login/proveedores',
    loadChildren: () => import('./proveedores/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'proveedores/factura/detalle',
    loadChildren: () => import('./proveedores/factura-detalle/factura-detalle.module').then( m => m.FacturaDetallePageModule),canActivate:[AuthproveedorGuard]
  },
  {
    path: 'login/colaboradores',
    loadChildren: () => import('./colaboradores/login/login.module').then( m => m.LoginPageModule)
  },
  
  {
    path: 'inicio/colaboradores',
    loadChildren: () => import('./colaboradores/inicio/inicio.module').then( m => m.InicioPageModule),canActivate:[AuthcolaboradorGuard]
  },
  {
    path: 'colaboradores/compras_materia_prima',
    loadChildren: () => import('./colaboradores/comprasmp/comprasmp.module').then( m => m.ComprasmpPageModule),canActivate:[AuthcolaboradorGuard]
  },
  {
    path: 'colaboradores/armador_materia_prima',
    loadChildren: () => import('./colaboradores/armadormp/armadormp.module').then( m => m.ArmadormpPageModule),canActivate:[AuthcolaboradorGuard]
  },
  {
    path: 'colaboradores/administraccion_documento',
    loadChildren: () => import('./colaboradores/administracciondoc/administracciondoc.module').then( m => m.AdministracciondocPageModule),canActivate:[AuthcolaboradorGuard]
  },
  {
    path: 'colaboradores/administraccion_contratos',
    loadChildren: () => import('./colaboradores/administraccioncontra/administraccioncontra.module').then( m => m.AdministraccioncontraPageModule),canActivate:[AuthcolaboradorGuard]
  },
  
  {
    path: 'colaboradores/compras_materia_prima/ingreso',
    loadChildren: () => import('./colaboradores/comprasmpingreso/comprasmpingreso.module').then( m => m.ComprasmpingresoPageModule),canActivate:[AuthcolaboradorGuard]
  },
  {
    path: 'colaboradores/compras_materia_prima/requisitos',
    loadChildren: () => import('./colaboradores/comprasmprequisitos/comprasmprequisitos.module').then( m => m.ComprasmprequisitosPageModule),canActivate:[AuthcolaboradorGuard]
  },
  
  {
    path: 'colaboradores/compras_materia_prima/precios',
    loadChildren: () => import('./colaboradores/precios/precios.module').then( m => m.PreciosPageModule),canActivate:[AuthcolaboradorGuard]
  },
  {
    path: 'colaboradores/armador-materia-prima-ii',
    loadChildren: () => import('./colaboradores/armadormpdos/armadormpdos.module').then( m => m.ArmadormpdosPageModule),canActivate:[AuthcolaboradorGuard]
  },


 
];

@NgModule({
  imports: [
     RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
