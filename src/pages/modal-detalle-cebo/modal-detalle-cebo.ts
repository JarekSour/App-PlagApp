import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, ViewController } from 'ionic-angular';

@IonicPage()
@Component({
    selector: 'page-modal-detalle-cebo',
    templateUrl: 'modal-detalle-cebo.html',
})
export class ModalDetalleCeboPage {

    detalle = { marca: '', formulacion: '', isp: '', concentracion: '', dosis: '', superficie: '' };

    constructor(
        public events: Events,
        public viewCtrl: ViewController,
        public navCtrl: NavController,
        public navParams: NavParams) {
    }

    ionViewDidLoad() {
        let data = this.navParams.get('detalle');
        this.detalle.marca = data.marca;
        this.detalle.formulacion = data.formulacion;
        this.detalle.isp = data.isp;
        this.detalle.concentracion = data.concentracion;
        this.detalle.dosis = data.dosis;
        this.detalle.superficie = data.superficie;
    }

    seleccionar() {
        this.events.publish('selectCebo', this.detalle);
        this.viewCtrl.dismiss();
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }

}
