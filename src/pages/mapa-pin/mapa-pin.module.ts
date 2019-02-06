import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MapaPinPage } from './mapa-pin';

@NgModule({
  declarations: [
    MapaPinPage,
  ],
  imports: [
    IonicPageModule.forChild(MapaPinPage),
  ],
})
export class MapaPinPageModule {}
