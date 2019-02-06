import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import * as MarkerClusterer from 'node-js-marker-clusterer';

declare var google;

@IonicPage()
@Component({
    selector: 'page-mapa-lista',
    templateUrl: 'mapa-lista.html',
})
export class MapaListaPage {

    @ViewChild('map') mapElement: ElementRef;
    map: any;
    position = { lat: -33.426068, lon: -70.616095 };

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams) {
    }

    ionViewDidLoad() {
        this.map = new google.maps.Map(this.mapElement.nativeElement, {
            zoom: 7,
            center: { lat: this.position.lat, lng: this.position.lon },
            animation: google.maps.Animation.DROP,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            streetViewControl: false,
            mapTypeControl: false,
            zoomControl: false,
            scaleControl: false,
            rotateControl: false,
            fullscreenControl: false
        });

        this.addMarkers();
    }

    addMarkers() {
        let puntos = this.navParams.get('puntos');

        let markers = puntos.map((location) => {
            let geo = location.geolocalizacion.split(',');
            var position = new google.maps.LatLng(parseFloat(geo[0]), parseFloat(geo[1]));
            let marca = new google.maps.Marker({
                position: position,
                label: "",
                icon: 'assets/img/other.png',
                id: location.Agent
            });
            return marca;
        });

        new MarkerClusterer(this.map, markers, { imagePath: 'assets/img/m' }, );
    }
}
