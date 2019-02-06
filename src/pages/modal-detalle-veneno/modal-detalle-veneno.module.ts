import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalDetalleVenenoPage } from './modal-detalle-veneno';

@NgModule({
  declarations: [
    ModalDetalleVenenoPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalDetalleVenenoPage),
  ],
})
export class ModalDetalleVenenoPageModule {}
