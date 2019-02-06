import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalVenenosPage } from './modal-venenos';

@NgModule({
  declarations: [
    ModalVenenosPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalVenenosPage),
  ],
})
export class ModalVenenosPageModule {}
