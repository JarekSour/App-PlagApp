import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, ViewController, ModalController } from 'ionic-angular';

@IonicPage()
@Component({
    selector: 'page-modal-venenos',
    templateUrl: 'modal-venenos.html',
})
export class ModalVenenosPage {

    all = [];
    title = [];

    constructor(
        public events: Events,
        public modalCtrl: ModalController,
        public viewCtrl: ViewController,
        public navCtrl: NavController,
        public navParams: NavParams) {
        this.events.subscribe('selectVeneno', (item) => {
            this.viewCtrl.dismiss();
        });
    }

    ionViewDidLoad() {
        this.all = this.navParams.get('venenos');

        for (let item of this.all){
            if(this.title.indexOf(item['categoria']) == -1)
                this.title.push(item['categoria'])
        }
    }

    showModalDetalleVeneno(item) {
        let modal = this.modalCtrl.create('ModalDetalleVenenoPage', { detalle: item });
        modal.present();
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }

}
