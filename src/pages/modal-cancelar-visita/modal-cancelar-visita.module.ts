import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalCancelarVisitaPage } from './modal-cancelar-visita';

@NgModule({
  declarations: [
    ModalCancelarVisitaPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalCancelarVisitaPage),
  ],
})
export class ModalCancelarVisitaPageModule {}
