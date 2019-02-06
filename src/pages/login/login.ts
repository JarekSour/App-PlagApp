import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, LoadingController, ToastController, AlertController, Events } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AuthProvider } from '../../providers/auth/auth';
@IonicPage()
@Component({
    selector: 'page-login',
    templateUrl: 'login.html',
})
export class LoginPage {

    loginData = { rut: '', pass: '', keygen: '' };
    loader: any;

    constructor(
        public events: Events,
        public alertCtrl: AlertController,
        public authService: AuthProvider,
        public loadingCtrl: LoadingController,
        public toastCtrl: ToastController,
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
        this.events.subscribe('closesession', (data) => {
            if (data == 'expired') {
                this.showAlert('Error', 'Hubo un problema, contactate con administración (superado el máximo)');
            }else if(data =='habilitado'){
                this.showAlert('Error', 'Su cuenta ha sido deshabilitada, contactate con administración');
            }else if(data =='estado'){
                this.showAlert('Error', 'Se ha iniciado sesión en otro dispositivo');
            }else{
                this.showAlert('Error', 'Hubo un error inesperado, lo sentimos');
            }
        });
    }

    login() {
        this.presentLoading();
        this.authService.login(this.loginData).then((response) => {
            this.loader.dismiss()
            if (response['status'] == true) {
                localStorage.setItem('keygen', this.loginData.keygen);
                localStorage.setItem('token', response['token']);
                this.navCtrl.setRoot('HomePage');
            } else {
                if (response['error'] == 'licence_null' || response['error'] == 'licence_expired') {
                    this.showAlert('Error', 'Hubo un problema, contactate con administración');
                } else if (response['error'] == 'estado') {
                    this.showAlert('Error', 'Hubo un problema, su cuenta esta en uso');
                } else if (response['error'] == 'invalid_keygen') {
                    this.showAlert('Error', 'Licencia no válida');
                } else if (response['error'] == 'licence_max') {
                    this.showAlert('Error', 'Hubo un problema, contactate con administración (superado el máximo)');
                } else if (response['error'] == 'habilitado') {
                    this.showAlert('Error', 'Su cuenta ha sido deshabilitada, contactate con administración ');
                } else {
                    this.presentToast('Rut o contraseña incorrecta');
                }
            }
        }).catch((e) => {
            this.loader.dismiss()
            this.presentToast('Verifica tu conexión a internet');
        })
    }

    onKey() {
        if (this.loginData.keygen.length > 4) {
            this.loginData.keygen = this.loginData.keygen.replace(/-/g, '');
            var aux = this.loginData.keygen.slice(0, 4);
            this.loginData.keygen = aux + '-' + this.loginData.keygen.slice(4, 8);
        }
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
            content: "Iniciando sesión...",
            enableBackdropDismiss: false
        });
        this.loader.present();
    }

    showAlert(titulo, msg) {
        let alert = this.alertCtrl.create({
            title: titulo,
            subTitle: msg,
            buttons: ['Aceptar']
        });
        alert.present();
    }
}
