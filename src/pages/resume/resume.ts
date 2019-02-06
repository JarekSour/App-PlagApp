import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DatePipe } from '@angular/common';

@IonicPage()
@Component({
    selector: 'page-resume',
    templateUrl: 'resume.html',
})
export class ResumePage {

    today: any;
    nombre_empresa: any;
    start: any;
    end: any;
    tiempoTotal: any;
    puntos = [];

    constructor(
        public datePipe: DatePipe,
        public navCtrl: NavController,
        public navParams: NavParams) {
    }

    ionViewDidLoad() {
        this.today = this.formatDate(new Date());
        this.nombre_empresa = this.navParams.get('nombre_empresa');
        this.start = this.navParams.get('inicio');
        this.end = new Date();
        this.tiempoTotal = this.calcularTiempo(this.end, this.start);//((this.end - new Date(this.start)) / 1000 / 60).toFixed(0);
        this.puntos = this.navParams.get('puntos');
    }

    continuar() {
        this.navCtrl.push('RecepcionPage', {
            comienzo: this.start,
            termino: this.end,
            duracion: this.tiempoTotal
        });
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

    getEndTime(date) {
        return ("0" + date.getHours()).slice(-2) + ':' + ("0" + date.getMinutes()).slice(-2);
    }

    calcularTiempo(fin, init) {

        var termino = this.datePipe.transform(fin, 'HH:mm');
        var inicio = this.datePipe.transform(init, 'HH:mm');

        var inicioMinutos = parseInt(inicio.substr(3, 2));
        var inicioHoras = parseInt(inicio.substr(0, 2));

        var finMinutos = parseInt(termino.substr(3, 2));
        var finHoras = parseInt(termino.substr(0, 2));

        var transcurridoMinutos = finMinutos - inicioMinutos;
        var transcurridoHoras = finHoras - inicioHoras;

        if (transcurridoMinutos < 0) {
            transcurridoHoras--;
            transcurridoMinutos = 60 + transcurridoMinutos;
        }

        var horas = transcurridoHoras * 60;
        var minutos = transcurridoMinutos;

        return horas + minutos;
    }

}
