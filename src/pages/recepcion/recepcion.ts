import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, AlertController, ToastController, LoadingController } from 'ionic-angular';
import { OrdenProvider } from '../../providers/orden/orden';
import { SignaturePage } from '../signature/signature';
import { DatePipe } from '@angular/common';

@IonicPage()
@Component({
    selector: 'page-recepcion',
    templateUrl: 'recepcion.html',
})
export class RecepcionPage {

    loader: any;
    today: any;
    nombre_empresa: any;
    ifSignatureRecepcion: boolean;
    ifSignatureTecnico: boolean;
    signatureRecepcion: any;
    signatureTecnico: any;
    json = {
        token: localStorage.getItem('token'), user: 'tech',
        id_orden: JSON.parse(localStorage.getItem('orden')).id_orden,
        id_cliente: JSON.parse(localStorage.getItem('orden')).id_cliente,
        comienzo: '', termino: '', duracion: '',
        nombre: '', rut: '', firmaR: '', firmaT: '', comentario: ''
    };

    constructor(
        public loadingCtrl: LoadingController,
        public ordenService: OrdenProvider,
        public toastCtrl: ToastController,
        public alertCtrl: AlertController,
        public datePipe: DatePipe,
        public events: Events,
        public navCtrl: NavController,
        public navParams: NavParams) {
        this.events.subscribe('updateSignatureRecepcion', (signature) => {
            this.ifSignatureRecepcion = true;
            this.signatureRecepcion = signature;
            this.json.firmaR = signature;
        });
        this.events.subscribe('updateSignatureTecnico', (signature) => {
            this.ifSignatureTecnico = true;
            this.signatureTecnico = signature;
            this.json.firmaT = signature;
        });
    }

    ionViewDidLoad() {
        this.today = this.formatDate(new Date());
        this.nombre_empresa = JSON.parse(localStorage.getItem('orden')).nombre_empresa;

        this.json.comienzo = this.datePipe.transform(this.navParams.get('comienzo'), 'HH:mm');
        this.json.termino = this.datePipe.transform(this.navParams.get('termino'), 'HH:mm');
        this.json.duracion = this.navParams.get('duracion');
    }

    showSignature(e) {
        this.navCtrl.push(SignaturePage, { param: e });
    }

    finalizar() {
        if (this.json.comentario == '') {
            this.presentToast('Debes ingresar un comentario');
        } else if (this.json.firmaT == '') {
            this.presentToast('Debes ingresar tu firma en "Firma técnico"');
        } else {
            if (this.json.nombre == '' && this.json.rut == '' && this.json.firmaR == '') {
                let confirm = this.alertCtrl.create({
                    title: 'Alerta !',
                    message: '¿Estas seguro que quieres finalizar sin llenar los datos?',
                    buttons: [
                        {
                            text: 'No, volver',
                            handler: () => { }
                        },
                        {
                            text: 'Si, finalizar',
                            handler: () => {
                                this.presentLoading('Completando orden...');
                                this.ordenService.finishOrder(this.json).then((response) => {
                                    if (response['status']) {
                                        localStorage.removeItem('isRevision');
                                        localStorage.removeItem('orden');
                                        this.presentToast('La orden fue completada exitosamente');
                                        this.loader.dismiss();
                                        this.navCtrl.setRoot('HomePage');
                                    }
                                })
                            }
                        }
                    ]
                });
                confirm.present();
            } else {
                if (this.json.nombre == '') {
                    this.presentToast('Debes ingresar un nombre');
                } else if (this.json.rut == '') {
                    this.presentToast('Debes ingresar un rut');
                } else if (this.json.firmaR == '') {
                    this.presentToast('Se debe ingresar una firma de recepción');
                } else if (this.json.firmaT == '') {
                    this.presentToast('Se debe ingresar tu firma');
                } else {
                    let confirm = this.alertCtrl.create({
                        title: 'Alerta !',
                        message: '¿Estas seguro que deseas finalizar la orden?',
                        buttons: [
                            {
                                text: 'No, volver',
                                handler: () => { }
                            },
                            {
                                text: 'Si, finalizar',
                                handler: () => {
                                    this.presentLoading('Completando orden...');
                                    this.ordenService.finishOrder(this.json).then((response) => {
                                        if (response['status']) {
                                            localStorage.removeItem('isRevision');
                                            localStorage.removeItem('orden');
                                            this.presentToast('La orden fue completada exitosamente');
                                            this.loader.dismiss();
                                            this.navCtrl.setRoot('HomePage');
                                        }
                                    })
                                }
                            }
                        ]
                    });
                    confirm.present();
                }
            }
        }
    }

    presentToast(msg) {
        let toast = this.toastCtrl.create({
            message: msg,
            duration: 3000
        });
        toast.present();
    }

    presentLoading(msg) {
        this.loader = this.loadingCtrl.create({
            content: msg,
            duration: 3000
        });
        this.loader.present();
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
