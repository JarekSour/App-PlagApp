import { Component } from '@angular/core';
import { IonicPage, PopoverController, NavController, NavParams, Platform, Events, LoadingController, ToastController } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AuthProvider } from '../../providers/auth/auth'
import { TecnicoProvider } from '../../providers/tecnico/tecnico'
import { PopOverPage } from '../pop-over/pop-over';
import { CalendarPage } from '../calendar/calendar';
@IonicPage()
@Component({
    selector: 'page-home',
    templateUrl: 'home.html',
})
export class HomePage {

    json = { avatar: '', rut: '', nombre: '', paterno: '', correo: '', telefono: '', emergencia: '', direccion: '', profesion: '', automovil: '' }
    loader: any;

    constructor(
        public popoverCtrl: PopoverController,
        public auth: AuthProvider,
        public tecnicoService: TecnicoProvider,
        public loadingCtrl: LoadingController,
        public toastCtrl: ToastController,
        public events: Events,
        public platform: Platform,
        public splashScreen: SplashScreen,
        public navCtrl: NavController,
        public navParams: NavParams) {
        this.platform.ready().then(() => {
            setTimeout(() => {
                this.splashScreen.hide();
            }, 100)
        })
    }

    ionViewDidLoad() {
        this.presentLoading();
        this.events.subscribe('logout', () => {
            this.auth.logOut();
            this.navCtrl.setRoot('LoginPage');
        });

        this.tecnicoService.getTecnico({ token: localStorage.getItem('token'), user: 'tech', keygen: localStorage.getItem('keygen') }).then((response) => {
            this.loader.dismiss()
            if (response['status'] == true) {
                this.json.avatar = response['data']['avatar'] == null ? 'assets/img/back.png' : 'https://api.plagapp.cl/tecnico/avatar/get?image=' + response['data']['avatar'];
                this.json.nombre = response['data']['nombre'];
                this.json.paterno = response['data']['apellido_paterno'];
                this.json.rut = response['data']['rut'];
                this.json.correo = response['data']['correo'];
                this.json.telefono = response['data']['telefono'];
                this.json.emergencia = response['data']['telefono_emergencia'];
                this.json.direccion = response['data']['direccion'];
                this.json.profesion = response['data']['profesion'];
                this.json.automovil = response['data']['automovil'];
            } else if (response['data'] == 'expired') {
                this.events.publish('closesession', 'expired');
                this.auth.logOut();
                this.navCtrl.setRoot('LoginPage')
            }else if(response['data'] =='habilitado'){
                this.events.publish('closesession', 'habilitado');
                this.auth.logOut();
                this.navCtrl.setRoot('LoginPage')
            }else if(response['data'] =='estado'){
                    this.events.publish('closesession', 'estado');
                    this.auth.logOut();
                    this.navCtrl.setRoot('LoginPage')
            }else{
                this.events.publish('closesession', '');
                this.auth.logOut();
                this.navCtrl.setRoot('LoginPage')
            }
        }).catch((respose) => {
            this.presentToast('Verifica tu conexión a internet');
            this.loader.dismiss()
        })
    }

    goServices() {
        this.navCtrl.push('ServicePage');
    }

    goCalendar() {
        this.navCtrl.push(CalendarPage);
    }

    presentPopover(myEvent) {
        let popover = this.popoverCtrl.create(PopOverPage);
        popover.present({
            ev: myEvent
        });
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
            content: "Obteniendo datos...",
            enableBackdropDismiss: false
        });
        this.loader.present();
    }

}
