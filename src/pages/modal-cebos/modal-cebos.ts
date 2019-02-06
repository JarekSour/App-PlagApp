import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ModalController, Events } from 'ionic-angular';

@IonicPage()
@Component({
    selector: 'page-modal-cebos',
    templateUrl: 'modal-cebos.html',
})
export class ModalCebosPage {

    cebos = [];

    constructor(
        public events: Events,
        public modalCtrl: ModalController,
        public viewCtrl: ViewController,
        public navCtrl: NavController,
        public navParams: NavParams) {
        this.events.subscribe('selectCebo', (item) => {
            this.viewCtrl.dismiss();
        });
    }

    ionViewDidLoad() {
        let cebos = this.navParams.get('cebos');
        let trampa = this.navParams.get('trampa');
        for (let item of cebos) {
            if (item['categoria'] == trampa)
                this.cebos.push(item)
        }
    }

    showModalDetalleCebo(item) {
        let modal = this.modalCtrl.create('ModalDetalleCeboPage', { detalle: item });
        modal.present();
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }

}
