import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, ViewController, ToastController } from 'ionic-angular';

@IonicPage()
@Component({
    selector: 'page-modal-revision-subcategoria',
    templateUrl: 'modal-revision-subcategoria.html',
})
export class ModalRevisionSubcategoriaPage {

    subcategorias: any;
    check: any;
    input: any;

    constructor(
        public toastCtrl: ToastController,
        public events: Events,
        public viewCtrl: ViewController,
        public navCtrl: NavController,
        public navParams: NavParams) {
    }

    ionViewDidLoad() {
        this.subcategorias = this.navParams.get('subcategorias');
        for (let item of this.subcategorias){
            delete item.check
            delete item.answer
        }
    }

    addActividades() {
        let aux = [];
        for (let item of this.subcategorias)
            if (item.check == true)
                aux.push(item)

        if (aux.length > 0) {
            this.events.publish('selectSubcategoria', aux);
            this.viewCtrl.dismiss();
        } else
            this.presentToast('Debes seleccionar la menos una opción');
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }

    presentToast(msg) {
        let toast = this.toastCtrl.create({
            message: msg,
            duration: 3000
        });
        toast.present();
    }

}
