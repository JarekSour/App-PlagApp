import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddPuntoPage } from './add-punto';

@NgModule({
  declarations: [
    AddPuntoPage,
  ],
  imports: [
    IonicPageModule.forChild(AddPuntoPage),
  ],
})
export class AddPuntoPageModule {}
