import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import { OrdenProvider } from '../../providers/orden/orden';
// import * as moment from 'moment';

@IonicPage()
@Component({
    selector: 'page-calendar',
    templateUrl: 'calendar.html',
})
export class CalendarPage {

    eventSource = [];
    viewTitle: string;
    selectedDay = new Date();
    loader: any;

    calendar = {
        mode: 'month',
        currentDate: new Date(),
        locale: 'es-ES',
        startingDayWeek: 1,
        startingDayMonth: 1
    };

    constructor(
        public ordenService: OrdenProvider,
        public loadingCtrl: LoadingController,
        public toastCtrl: ToastController,
        public navCtrl: NavController,
        public navParams: NavParams) {
    }

    ionViewDidLoad() {
        this.presentLoading();
        this.ordenService.getOrdenesCalendar({ token: localStorage.getItem('token'), user: 'tech' }).then((response) => {
            if (response['status']) {
                let events = [];
                for (let item of response['data']) {
                    var date = item['fecha'].split('-');
                    events.push({
                        title: item['nombre_empresa'],
                        startTime: new Date(parseInt(date[0]), parseInt(date[1]) - 1, parseInt(date[2])),
                        endTime: new Date(parseInt(date[0]), parseInt(date[1]) - 1, parseInt(date[2])),
                        allDay: true
                    });
                }

                this.loader.dismiss()
                this.eventSource = events;
            }
        }).catch((e) => {
            this.loader.dismiss()
            this.presentToast('Verifica tu conexión a internet');
        })
    }

    onViewTitleChanged(title) {
        this.viewTitle = title;
    }

    onEventSelected(event) {
        // let start = moment(event.startTime).format('LLLL');
        // let end = moment(event.endTime).format('LLLL');

        // let alert = this.alertCtrl.create({
        //     title: '' + event.title,
        //     subTitle: 'From: ' + start + '<br>To: ' + end,
        //     buttons: ['OK']
        // })
        // alert.present();
    }

    onTimeSelected(ev) {
        this.selectedDay = ev.selectedTime;
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
            content: "Obteniendo visitas...",
            enableBackdropDismiss: false
        });
        this.loader.present();
    }

}
