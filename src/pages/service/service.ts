import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, LoadingController, ToastController } from 'ionic-angular';
import { OrdenProvider } from '../../providers/orden/orden';

@IonicPage()
@Component({
    selector: 'page-service',
    templateUrl: 'service.html',
})
export class ServicePage {

    today: any;
    ordenes: any;
    loader: any;

    constructor(
        public ordenService: OrdenProvider,
        public loadingCtrl: LoadingController,
        public toastCtrl: ToastController,
        public events: Events,
        public navCtrl: NavController,
        public navParams: NavParams) {

        this.events.subscribe('cancelOrden', (id) => {
            this.ordenes.forEach(element => {
                element.estado = element.orden_id == id ? 0 : element.estado;
            });
        });
        this.events.subscribe('finalizarOrden', (id) => {
            this.ordenes.forEach(element => {
                element.estado = element.orden_id == id ? 1 : element.estado;
            });
        });
    }

    ionViewDidLoad() {
        this.presentLoading();
        this.today = this.formatDate(new Date());

        this.ordenService.getOrdenesToday({ token: localStorage.getItem('token'), user: 'tech' }).then((response) => {
            this.loader.dismiss()
            if (response['status'] == true) {
                this.ordenes = response['data'];
            }
        }).catch((e) => {
            this.presentToast('Verifica tu conexión a internet');
        })
    }

    goVisit(item) {
        if (item.estado == null) {
            this.navCtrl.push('VisitPage', {
                orden: item
            });
        }
    }

    formatDate(date) {
        var monthNames = [
            "Enero", "Febrero", "Marzo",
            "Abril", "Mayo", "Junio", "Julio",
            "Agosto", "Septiembre", "Octubre",
            "Noviembre", "Diciembre"
        ];

        var dayNames = [
            "Domingo", "Lunes", "Martes", "Miércoles",
            "Jueves", "Viernes", "Sábado"
        ];

        return dayNames[date.getDay()] + '  ' + date.getDate() + ', ' + monthNames[date.getMonth()] + ' del ' + date.getFullYear();
    }

    presentToast(msg) {
        let toast = this.toastCtrl.create({
            message: msg,
            duration: 3000
        });
        toast.present();
    }

    presentLoading() {
        this.loader = this.loadingCtrl.create({
            content: "Obteniendo visitas...",
            enableBackdropDismiss: false
        });
        this.loader.present();
    }

    showMap() {
        this.navCtrl.push('MapaListaPage', { puntos: this.ordenes });
    }

}
