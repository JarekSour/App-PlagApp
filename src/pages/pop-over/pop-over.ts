import { Component } from '@angular/core';
import { NavController, NavParams, Events, ViewController } from 'ionic-angular';

@Component({
    template: `
    <ion-list style='margin: -1px 0 0px;'>
      <button ion-item (click)="closeSession()">Cerrar Sesión</button>
    </ion-list>
  `
})
export class PopOverPage {

    constructor(
        public viewCtrl: ViewController,
        public events: Events,
        public navCtrl: NavController,
        public navParams: NavParams) {
    }

    closeSession() {
        this.viewCtrl.dismiss();
        this.events.publish('logout');
    }
}
