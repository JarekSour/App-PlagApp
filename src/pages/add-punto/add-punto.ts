import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, ToastController, ModalController, LoadingController } from 'ionic-angular';
import { OrdenProvider } from '../../providers/orden/orden';
import { PuntoProvider } from '../../providers/punto/punto';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ParametroProvider } from '../../providers/parametro/parametro';

@IonicPage()
@Component({
    selector: 'page-add-punto',
    templateUrl: 'add-punto.html',
})
export class AddPuntoPage {

    trampa: any;
    cebos: any;
    sector: any;
    venenos: any;
    json = {
        token: localStorage.getItem('token'), user: 'tech',
        id_cliente: '', id_orden: '', qr: '',
        tipo: '', trampa: '', cebo: '', veneno: '', sector: '', mapa: '', foto: '', comentario: '', tiempo: '',
        marca: '', isp: '', concentracion: '', dosis: '', superficie: ''
    };
    startTime: any;
    endTime: any;
    options: BarcodeScannerOptions = {
        resultDisplayDuration: 0
    }
    ifMapa: boolean;
    ifFoto: boolean;
    loader: any;
    exist: boolean;

    constructor(
        public parametrosService: ParametroProvider,
        public loadingCtrl: LoadingController,
        public camera: Camera,
        public barcodeScanner: BarcodeScanner,
        public toastCtrl: ToastController,
        public modalCtrl: ModalController,
        public puntoService: PuntoProvider,
        public ordenService: OrdenProvider,
        public events: Events,
        public navCtrl: NavController,
        public navParams: NavParams) {
        this.events.subscribe('selectVeneno', (item) => {
            this.json.trampa = '';
            this.json.cebo = '';
            this.json.veneno = item.nombre + ' | ' + item.formulacion;
            this.json.isp = item.isp;
            this.json.concentracion = item.concentracion;
            this.json.dosis = item.dosis;
            this.json.superficie = '';
        });
        this.events.subscribe('selectCebo', (item) => {
            this.json.cebo = item.marca + ' / ' + item.formulacion;
            this.json.veneno = '';
            this.json.isp = item.isp;
            this.json.concentracion = item.concentracion;
            this.json.dosis = item.dosis;
            this.json.superficie = item.superficie;
        });
        this.events.subscribe('selectMapa', (geo) => {
            this.json.mapa = geo;
            this.ifMapa = true;
        });
    }

    ionViewDidLoad() {
        this.startTime = new Date();
        this.json.id_cliente = JSON.parse(localStorage.getItem('orden')).id_cliente;
        this.json.id_orden = JSON.parse(localStorage.getItem('orden')).id_orden;

        this.parametrosService.getTrampas({ token: localStorage.getItem('token'), user: 'tech' }).then((response) => {
            this.trampa = response['data'];
        })
        this.parametrosService.getCebos({ token: localStorage.getItem('token'), user: 'tech' }).then((response) => {
            this.cebos = response['data'];
        })
        this.parametrosService.getInstalacion({ token: localStorage.getItem('token'), user: 'tech' }).then((response) => {
            this.sector = response['data'];
        })
        this.parametrosService.getVenenos({ token: localStorage.getItem('token'), user: 'tech' }).then((response) => {
            this.venenos = response['data'];
        })
    }

    showQR() {
        this.barcodeScanner.scan(this.options).then((barcodeData) => {
            if (barcodeData['format'] == 'QR_CODE') {
                this.json.qr = barcodeData['text'];
            } else
                this.presentToast('Código no válido');
        }, (err) => {
            this.presentToast('Ups! ocurrio un error');
        });
    }

    addPointMap() {
        this.navCtrl.push('MapaPinPage');
    }

    addPhotoTramp() {
        const options: CameraOptions = {
            quality: 75,
            destinationType: this.camera.DestinationType.DATA_URL,
            encodingType: this.camera.EncodingType.JPEG,
            mediaType: this.camera.MediaType.PICTURE,
            correctOrientation: true
        }

        this.camera.getPicture(options).then((imageData) => {
            this.ifFoto = true;
            this.json.foto = 'data:image/jpeg;base64,' + imageData;
        }, (err) => { });
    }

    addPoint() {
        if (this.json.qr == '') {
            this.presentToast('Debes agregar un codigo qr');
        } else if (this.json.mapa == '') {
            this.presentToast('Debes agregar un punto al mapa');
        } else if (this.json.foto == '') {
            this.presentToast('Debes agregar una fotografía de la trampa');
        } else {
            if (this.json.tipo == 'Trampa') {
                this.json.veneno = '';
            } else {
                this.json.trampa = '';
                this.json.cebo = '';
            }
            this.presentLoading('Agregando punto...');
            this.endTime = new Date();
            let diferencia = this.endTime - this.startTime;
            this.json.tiempo = this.secondsToTime(diferencia);
            this.puntoService.newPunto(this.json).then((response) => {
                if (response['status'] == true) {
                    let productoTrampa = this.json.tipo == 'Trampa' ? this.json.trampa : 'Desinsectado / Sanitizado';
                    this.events.publish('newPoint', response['nombre'], this.json.sector, productoTrampa);
                    this.presentToast('El punto fue añadido exitosamente');
                    this.loader.dismiss()
                    this.navCtrl.pop();
                }
            }).catch((err) => {
                this.loader.dismiss();
                this.presentToast('Ups! ocurrió un error');
            })
        }
    }

    onChangeTrampa() {
        this.json.cebo = '';
        this.exist = false;
        let aux = this.cebos;
        for (let item of aux) {
            if (item['categoria'] == this.json.trampa) {
                this.exist = true;
            }
        }

        this.json.veneno = '';
        this.json.isp = '';
        this.json.concentracion = '';
        this.json.dosis = '';
        this.json.superficie = '';
    }

    showModalVeneno() {
        let modal = this.modalCtrl.create('ModalVenenosPage', { venenos: this.venenos });
        modal.present();
    }

    showModalCebo() {
        let modal = this.modalCtrl.create('ModalCebosPage', { cebos: this.cebos, trampa: this.json.trampa });
        modal.present();
    }

    presentToast(msg) {
        let toast = this.toastCtrl.create({
            message: msg,
            duration: 3000
        });
        toast.present();
    }

    secondsToTime(s) {
        var ms = s % 1000;
        s = (s - ms) / 1000;
        var secs = s % 60;
        s = (s - secs) / 60;
        var mins = s % 60;
        var hrs = (s - mins) / 60;
        return this.addZ(hrs) + ':' + this.addZ(mins) + ':' + this.addZ(secs);
    }

    addZ(n) {
        return (n < 10 ? '0' : '') + n;
    }

    presentLoading(msg) {
        this.loader = this.loadingCtrl.create({
            content: msg
        });
        this.loader.present();
    }

}
