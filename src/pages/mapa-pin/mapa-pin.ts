import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, ToastController } from 'ionic-angular';
import { Diagnostic } from '@ionic-native/diagnostic';
import { Geolocation } from '@ionic-native/geolocation';

declare var google;

@IonicPage()
@Component({
    selector: 'page-mapa-pin',
    templateUrl: 'mapa-pin.html',
})
export class MapaPinPage {

    @ViewChild('map') mapElement: ElementRef;
    map: any;
    locationCtrl = {
        coordinates: ''
    };
    position = { lat: 0, lon: 0 };
    desde: any;

    constructor(
        public geolocation: Geolocation,
        public toastCtrl: ToastController,
        public diag: Diagnostic,
        public events: Events,
        public navCtrl: NavController,
        public navParams: NavParams) {
    }

    ionViewDidLoad() {
        this.desde = this.navParams.get('param');

        if (this.desde == 'revision') {
            this.locationCtrl.coordinates = this.navParams.get('geo');
            this.position.lat = parseFloat(this.locationCtrl.coordinates.split(',')[0]);
            this.position.lon = parseFloat(this.locationCtrl.coordinates.split(',')[1]);
            this.initMap();
        } else {
            this.diag.isLocationEnabled().then((isEnable) => {
                if (isEnable) {
                    this.geolocation.getCurrentPosition().then((resp) => {
                        this.locationCtrl.coordinates = resp.coords.latitude + ', ' + resp.coords.longitude;
                        this.position.lat = resp.coords.latitude;
                        this.position.lon = resp.coords.longitude;
                        this.initMap();
                    }).catch((error) => {
                        this.presentToast(JSON.stringify(error));
                    });
                } else {
                    this.presentToast('Debes activar tu GPS antes');
                    this.navCtrl.pop()
                }
            });
        }
    }

    initMap() {

        this.map = new google.maps.Map(this.mapElement.nativeElement, {
            zoom: 20,
            center: { lat: this.position.lat, lng: this.position.lon },
            animation: google.maps.Animation.DROP,
            mapTypeId: google.maps.MapTypeId.SATELLITE,
            streetViewControl: false,
            mapTypeControl: false,
            zoomControl: false,
            scaleControl: false,
            rotateControl: false,
            fullscreenControl: false
        });

        google.maps.event.addListener(this.map, "dragend", () => {
            this.locationCtrl.coordinates = this.map.getCenter().toUrlValue();
            console.log(this.locationCtrl.coordinates)
        });
    }

    toCenter() {
        this.map.setCenter(new google.maps.LatLng(this.position.lat, this.position.lon));
    }

    confirmar() {
        if (this.desde == 'revision') {
            this.events.publish('selectMapaRevision', this.locationCtrl.coordinates);
            this.navCtrl.pop();
        } else {
            this.events.publish('selectMapa', this.locationCtrl.coordinates);
            this.navCtrl.pop();
        }
    }

    presentToast(msg) {
        let toast = this.toastCtrl.create({
            message: msg,
            duration: 3000
        });
        toast.present();
    }

}
