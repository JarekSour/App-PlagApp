import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Events } from 'ionic-angular';
import { SignaturePad } from 'angular2-signaturepad/signature-pad';

@Component({
    selector: 'page-signature',
    templateUrl: 'signature.html',
})
export class SignaturePage {

    @ViewChild(SignaturePad) signaturePad: SignaturePad;

    private signaturePadOptions: Object = {
        'minWidth': 1,
        'backgroundColor': '#f8f8f8',
        'penColor': '#000000',
    };
    signatureImage: any;
    listo: boolean;
    param: any;

    constructor(
        public events: Events,
        public navCtrl: NavController,
        public navParams: NavParams) {
    }

    ionViewDidLoad() {
        this.param = this.navParams.get('param');
        console.log(this.param)
    }

    confirmar() {
        if (this.param == 'rece')
            this.events.publish('updateSignatureRecepcion', this.signatureImage);
        else if (this.param == 'tech')
            this.events.publish('updateSignatureTecnico', this.signatureImage);
        this.navCtrl.pop();
    }

    drawComplete() {
        this.listo = true;
        this.signatureImage = this.signaturePad.toDataURL();
    }

    drawClear() {
        this.signatureImage = null;
        this.listo = false;
        this.signaturePad.clear();
    }

}
