import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MapaListaPage } from './mapa-lista';

@NgModule({
  declarations: [
    MapaListaPage,
  ],
  imports: [
    IonicPageModule.forChild(MapaListaPage),
  ],
})
export class MapaListaPageModule {}
