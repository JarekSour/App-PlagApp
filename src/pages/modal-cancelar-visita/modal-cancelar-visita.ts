import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Events, ToastController, ViewController } from 'ionic-angular';
import { OrdenProvider } from '../../providers/orden/orden';

@IonicPage()
@Component({
    selector: 'page-modal-cancelar-visita',
    templateUrl: 'modal-cancelar-visita.html',
})
export class ModalCancelarVisitaPage {

    loader: any;
    id: any;
    comentario: any;

    constructor(
        public viewCtrl: ViewController,
        public toastCtrl: ToastController,
        public ordenService: OrdenProvider,
        public events: Events,
        public loadingCtrl: LoadingController,
        public navCtrl: NavController,
        public navParams: NavParams) {
    }

    ionViewDidLoad() {
        this.id = this.navParams.get('orden_id');
    }

    cancelar() {
        this.loader = this.loadingCtrl.create({
            content: "Cancelando visita...",
            enableBackdropDismiss: false
        });
        this.loader.present();

        this.ordenService.cancelarVisita({ token: localStorage.getItem('token'), user: 'tech', orden_id: this.id, comentario: this.comentario }).then((response) => {
            if (response['status']) {
                this.events.publish('cancelOrden', this.id);
                this.showToast('La visita fue cancelada exitosamente');
                this.viewCtrl.dismiss('cancel');
                this.loader.dismiss();
            }
        }).catch((e) => {
            this.loader.dismiss();
            this.showToast('Ups! ocurrio un error');
        });
    }

    showToast(msg) {
        let toast = this.toastCtrl.create({
            message: msg,
            duration: 3000,
            position: 'bottom',
            dismissOnPageChange: false
        });
        toast.present();
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }

}
