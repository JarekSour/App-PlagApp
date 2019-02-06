import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Events, ToastController, LoadingController } from 'ionic-angular';
import { PuntoProvider } from '../../providers/punto/punto';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { OrdenProvider } from '../../providers/orden/orden';
import { ParametroProvider } from '../../providers/parametro/parametro';

@IonicPage()
@Component({
    selector: 'page-start-revision',
    templateUrl: 'start-revision.html',
})
export class StartRevisionPage {

    loader: any;
    json = {
        token: localStorage.getItem('token'), user: 'tech',
        id: '', id_cliente: '', id_orden: '', nombre: '', qr: '', trampa: '', cebo: '', veneno: '', sector: '', mapa: '', foto: '', comentario: '', tiempo: '',
        actividad: '', isp: '', concentracion: '', dosis: '', superficie: ''
    };
    punto: any;

    isTrampa: boolean;
    sector: any;
    jsonSubCategoria: any;
    jsonSubSelected = [];
    chlNuevaTrampa: any;
    options: BarcodeScannerOptions = {
        resultDisplayDuration: 0
    }
    ifFoto: boolean;
    ifTrampaEncontrada: boolean;
    instalacion: any;
    nuevoSector: any;

    startTime: any;
    endTime: any;

    constructor(
        public parametrosService: ParametroProvider,
        public loadingCtrl: LoadingController,
        public ordenService: OrdenProvider,
        public camera: Camera,
        public toastCtrl: ToastController,
        public barcodeScanner: BarcodeScanner,
        public events: Events,
        public modalCtrl: ModalController,
        public puntoService: PuntoProvider,
        public navCtrl: NavController,
        public navParams: NavParams) {
        this.events.subscribe('selectSubcategoria', (json) => {
            this.jsonSubSelected.length = 0;
            this.jsonSubSelected = [];
            this.jsonSubSelected = json;
            let trampaEncontrada = true;
            let aux = [];
            for (let item of json) {
                aux.push({ subcategoria: item.subcategoria, pregunta: item.pregunta, answer: item.answer })
                if (item.subcategoria == 'Perdida' || item.subcategoria == 'Destruida' || item.subcategoria == 'Hurto') {
                    trampaEncontrada = false;
                }
            }

            this.ifTrampaEncontrada = trampaEncontrada == false ? true : false;
            this.json.actividad = JSON.stringify(aux);
        });
        this.events.subscribe('selectMapaRevision', (geo) => {
            this.json.mapa = geo;
        });
    }

    ionViewDidLoad() {
        this.punto = this.navParams.get('item');
        console.log(this.punto)
        this.startTime = new Date();
        this.json.id = this.punto['id_punto'];
        this.json.nombre = this.punto['nombre'];
        this.json.qr = this.punto['codigo'];
        this.json.id_cliente = JSON.parse(localStorage.getItem('orden')).id_cliente;
        this.json.id_orden = JSON.parse(localStorage.getItem('orden')).id_orden;
        this.json.mapa = this.punto["mapa"];
        this.json.cebo = this.punto['cebo'];
        this.json.veneno = this.punto['veneno'];
        this.json.isp = this.punto['isp'];
        this.json.concentracion = this.punto['concentracion'];
        this.json.dosis = this.punto['dosis'];
        this.json.superficie = this.punto['superficie'];
        if (this.punto["trampa"] != null) {
            this.isTrampa = true;
            this.json.trampa = this.punto["trampa"];
            this.sector = this.punto["sector"];
            this.parametrosService.getSubCategoria({ token: localStorage.getItem('token'), user: 'tech', categoria: this.punto["trampa"] }).then((response) => {
                if (response['status']) {
                    this.jsonSubCategoria = response['subcategoria'];
                }
            })
        } else {
            this.isTrampa = false;
            this.json.veneno = this.punto["veneno"];
            this.sector = this.punto["sector"];
        }

        this.parametrosService.getInstalacion({ token: localStorage.getItem('token'), user: 'tech' }).then((response) => {
            this.instalacion = response['data'];
            this.json.sector = this.sector;
        })
    }

    showActividad() {
        let modal = this.modalCtrl.create('ModalRevisionSubcategoriaPage', { subcategorias: this.jsonSubCategoria });
        modal.present();
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

    changePointMap() {
        this.navCtrl.push('MapaPinPage', { param: 'revision', geo: this.json.mapa });
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

    addRevision() {
        if (this.isTrampa) {
            if (this.json.actividad == '') {
                this.presentToast('Debes escoger la actividad de la trampa');
                return false;
            } else {
                let act = JSON.parse(this.json.actividad)
                for (let item of act) {
                    if (item.pregunta != null) {
                        if (item.answer == null) {
                            this.presentToast('Debes responder la(s) pregunta(s) de la actividad de trampa');
                            return false;
                        }
                    }
                }
            }
        }

        if (this.json.foto == '') {
            this.presentToast('Debes adjuntar la fotografía de la trampa instalada');
        } else {
        if (this.json.comentario == '') {
            this.presentToast('Debes escribir algún comentario');
        } else {
            this.endTime = new Date();
            let diferencia = this.endTime - this.startTime;
            this.json.tiempo = this.secondsToTime(diferencia);
            this.presentLoading('Agregando revisión del punto...');
            this.ordenService.addRevision(this.json).then((response) => {
                if (response['status']) {
                    this.events.publish('classCheck', this.punto, this.json);
                    this.loader.dismiss();
                    this.navCtrl.pop();
                }
            })
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

}
