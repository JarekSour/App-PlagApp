import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, Events, ToastController, ModalController } from 'ionic-angular';
import { Diagnostic } from '@ionic-native/diagnostic';
import { Geolocation } from '@ionic-native/geolocation';
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator';


@IonicPage()
@Component({
    selector: 'page-visit',
    templateUrl: 'visit.html',
})
export class VisitPage {

    today: any;
    json = { id: '', cliente_id: '', georeferencia: '', nombre_empresa: '', correo: '', nombre_encargado: '', telefono: '', direccion: '', num: 0 }

    constructor(
        public modalCtrl: ModalController,
        public events: Events,
        public launchNavigator: LaunchNavigator,
        public toastCtrl: ToastController,
        public alertCtrl: AlertController,
        public geolocation: Geolocation,
        public diag: Diagnostic,
        public navCtrl: NavController,
        public navParams: NavParams) {
    }

    ionViewDidLoad() {
        let orden = this.navParams.get('orden');
        this.json.id = orden.orden_id;
        this.json.cliente_id = orden.cliente_id;
        this.json.georeferencia = orden.geolocalizacion;
        this.json.nombre_empresa = orden.nombre_empresa;
        this.json.correo = orden.correo_empresa;
        this.json.telefono = orden.telefono_empresa;
        this.json.direccion = orden.direccion_empresa;
        this.json.nombre_encargado = orden.nombre + ' ' + orden.apellido_paterno;
        this.json.num = orden.num;

        this.today = this.formatDate(new Date());
    }

    startNewVisit(id) {
        let msg = this.json.num == 0 ? "¿Estas seguro que quieres iniciar la visita?" : '¿Estas seguro que quieres iniciar la revisión?';
        let prompt = this.alertCtrl.create({
            title: 'Alerta',
            message: msg,
            buttons: [
                {
                    text: 'No',
                    handler: data => { }
                },
                {
                    text: 'Si, comenzar',
                    handler: data => {
                        this.navCtrl.setRoot('StartVisitPage', { id_cliente: this.json.cliente_id, id_orden: this.json.id, nombre: this.json.nombre_empresa, puntos: this.json.num });
                    }
                }
            ]
        });
        prompt.present();
    }

    mapStreet() {
        this.diag.isLocationEnabled().then((isEnabled) => {
            if (isEnabled)
                this.geolocation.getCurrentPosition().then((resp) => {


                    let options: LaunchNavigatorOptions = {
                        start: [resp.coords.latitude, resp.coords.longitude],
                        appSelection: {
                            dialogHeaderText: 'Selecciona una aplicación',
                            cancelButtonText: 'cancelar',
                            rememberChoice: {
                                prompt: {
                                    headerText: 'Recordar elección ?',
                                    yesButtonText: 'SI',
                                    noButtonText: 'NO'
                                }
                            }
                        }
                    };

                    this.launchNavigator.navigate(this.json.georeferencia, options)
                        .then(
                        success => console.log('Launched navigator'),
                        error => { console.log('Launched navigator') }
                        );

                }).catch((error) => {
                    this.showToast('Ups! ocurrio un error');
                });
            else
                this.showToast('Debes activar el GPS');
        }).catch((e) => {
            this.showToast('Debes activar el GPS');
        });
    }

    cancelarModal(id) {
        let modal = this.modalCtrl.create('ModalCancelarVisitaPage', { orden_id: id });
        modal.onDidDismiss(data => {
            if(data == 'cancel'){
                this.navCtrl.pop();
            }
        })
        modal.present();
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

}
