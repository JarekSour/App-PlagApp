import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, AlertController, Platform, LoadingController } from 'ionic-angular';
import { PuntoProvider } from '../../providers/punto/punto';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AuthProvider } from '../../providers/auth/auth';

@IonicPage()
@Component({
    selector: 'page-start-visit',
    templateUrl: 'start-visit.html',
})
export class StartVisitPage {

    json = { nombre_empresa: '', startTime: new Date(), id_cliente: '', id_orden: '', puntos: 0 }
    nombre_empresa: any;
    today: any;
    startTime: any;
    puntos = [];
    loader: any;

    constructor(
        public auth: AuthProvider,
        public loadingCtrl: LoadingController,
        public platform: Platform,
        public splashScreen: SplashScreen,
        public alertCtrl: AlertController,
        public puntoService: PuntoProvider,
        public events: Events,
        public navCtrl: NavController,
        public navParams: NavParams) {
        this.platform.ready().then(() => {
            setTimeout(() => {
                this.splashScreen.hide();
            }, 100)
        })
        this.events.subscribe('newPoint', (nombre, instalacion, trampa) => {
            this.puntos.push({ nombre: nombre, sector: instalacion, trampa: trampa, nuevo: true });
        });
        this.events.subscribe('classCheck', (oldd, neww) => {
            for (let item of this.puntos) {
                if (item.id_cliente == oldd.id_cliente && item.nombre == oldd.nombre) {
                    item['sector'] = neww['sector'];
                    item['revisado'] = true;
                }
            }
        });
    }

    ionViewDidLoad() {
        //si no hay una orden guardada
        if (localStorage.getItem('orden') === null) {
            this.json.nombre_empresa = this.navParams.get('nombre');
            this.json.id_cliente = this.navParams.get('id_cliente');
            this.json.id_orden = this.navParams.get('id_orden');
            localStorage.setItem('orden', JSON.stringify(this.json));

            this.json.puntos = this.navParams.get('puntos');
            //si el cliente tiene puntos
            if (this.json.puntos > 0) {
                localStorage.setItem('isRevision', '');
                this.presentLoading('Cargando puntos...');
                this.puntoService.getPuntosRevision({ token: localStorage.getItem('token'), user: 'tech', id_cliente: this.json.id_cliente, id_orden: this.json.id_orden }).then((response) => {
                    if (response['status']) {
                        this.puntos = response['puntos'];
                        for (let item of response['revisiones']) {
                            for (let i of this.puntos) {
                                if (item.id_punto == i.id) {
                                    i.trampa = item.trampa ? item.trampa : 'Desinsectado / Sanitizado';
                                    i.sector = item.sector
                                    i.revisado = true;
                                }
                            }
                        }
                        this.loader.dismiss();
                    }
                })
            }
        } else {
            //si hay orden guardada
            this.json.nombre_empresa = JSON.parse(localStorage.getItem('orden')).nombre_empresa;
            this.json.startTime = JSON.parse(localStorage.getItem('orden')).startTime;
            this.json.id_cliente = JSON.parse(localStorage.getItem('orden')).id_cliente;
            this.json.id_orden = JSON.parse(localStorage.getItem('orden')).id_orden;

            if (localStorage.getItem('isRevision') === null) { //si no es revision
                this.presentLoading('Cargando puntos...');
                this.puntoService.getPuntos({ token: localStorage.getItem('token'), user: 'tech', id_cliente: this.json.id_cliente, id_orden: this.json.id_orden }).then((response) => {
                    if (response['status']) {
                        this.puntos = response['data'];
                        this.loader.dismiss();
                    } else if (response['data'] == 'expired') {
                        this.auth.logOut();
                        this.navCtrl.setRoot('LoginPage')
                    }
                })
            } else { //Si es revision
                this.presentLoading('Cargando puntos...');
                this.puntoService.getPuntosRevision({ token: localStorage.getItem('token'), user: 'tech', id_cliente: this.json.id_cliente, id_orden: this.json.id_orden }).then((response) => {
                    if (response['status']) {
                        this.puntos = response['puntos'];

                        for (let item of response['revisiones']) {
                            for (let i of this.puntos) {
                                if (item.id_punto == i.id) {
                                    console.log(i)
                                    i.trampa = item.trampa ? item.trampa : 'Desinsectado / Sanitizado';
                                    i.sector = item.sector
                                    i.revisado = true;
                                }
                            }
                        }
                        this.loader.dismiss();
                    } else if (response['data'] == 'expired') {
                        this.auth.logOut();
                        this.navCtrl.setRoot('LoginPage')
                    }
                })
            }
        }

        this.today = this.formatDate(new Date());
    }

    addPunto() {
        this.navCtrl.push('AddPuntoPage');
    }

    showPunto(item) {
        if (localStorage.getItem('isRevision') !== null)
            if (!item['revisado'] && !item['nuevo'])
                this.navCtrl.push('StartRevisionPage', { item: item });
    }

    terminarVisita() {
        let confirm = this.alertCtrl.create({
            title: 'Alerta !',
            message: '¿Estas seguro que deseas terminar el ingreso de puntos?',
            buttons: [
                {
                    text: 'No, volver',
                    handler: () => { }
                },
                {
                    text: 'Si, terminar',
                    handler: () => {
                        this.navCtrl.push('ResumePage', {
                            nombre_empresa: this.json.nombre_empresa,
                            inicio: this.json.startTime,
                            puntos: this.puntos
                        });
                    }
                }
            ]
        });
        confirm.present();
    }

    getStartTime(date) {
        return ("0" + date.getHours()).slice(-2) + ':' + ("0" + date.getMinutes()).slice(-2);
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

    presentLoading(msg) {
        this.loader = this.loadingCtrl.create({
            content: msg,
            duration: 3000
        });
        this.loader.present();
    }

}
