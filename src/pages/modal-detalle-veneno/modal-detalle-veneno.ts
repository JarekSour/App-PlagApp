import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, ViewController } from 'ionic-angular';

@IonicPage()
@Component({
    selector: 'page-modal-detalle-veneno',
    templateUrl: 'modal-detalle-veneno.html',
})
export class ModalDetalleVenenoPage {

    detalle = { categoria: '', concentracion: '', dosis: '', formulacion: '', nombre: '', isp: '' };

    constructor(
        public events: Events,
        public viewCtrl: ViewController,
        public navCtrl: NavController,
        public navParams: NavParams) {
    }

    ionViewDidLoad() {
        let data = this.navParams.get('detalle');
        this.detalle.categoria = data.categoria;
        this.detalle.concentracion = data.concentracion;
        this.detalle.dosis = data.dosis;
        this.detalle.formulacion = data.formulacion;
        this.detalle.nombre = data.nombre;
        this.detalle.isp = data.isp;
    }

    seleccionar(){
        this.events.publish('selectVeneno', this.detalle);
        this.viewCtrl.dismiss();
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }

}
