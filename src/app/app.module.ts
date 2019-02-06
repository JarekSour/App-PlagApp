import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { CalendarPage } from '../pages/calendar/calendar'
import { PopOverPage } from '../pages/pop-over/pop-over'
import { SignaturePage } from '../pages/signature/signature'

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HttpModule } from '@angular/http';
import { DatePipe } from '@angular/common';
import { LaunchNavigator } from '@ionic-native/launch-navigator';
import { Geolocation } from '@ionic-native/geolocation';
import { Diagnostic } from '@ionic-native/diagnostic';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Camera } from '@ionic-native/camera';

import { SignaturePadModule } from 'angular2-signaturepad';
import { NgCalendarModule } from 'ionic2-calendar';

import { AuthProvider } from '../providers/auth/auth';
import { OrdenProvider } from '../providers/orden/orden';
import { PuntoProvider } from '../providers/punto/punto';
import { TecnicoProvider } from '../providers/tecnico/tecnico';
import { ParametroProvider } from '../providers/parametro/parametro';



@NgModule({
    declarations: [
        MyApp,
        CalendarPage,
        PopOverPage,
        SignaturePage
    ],
    imports: [
        NgCalendarModule,
        BrowserModule,
        IonicModule.forRoot(MyApp),
        HttpModule,
        SignaturePadModule
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        CalendarPage,
        PopOverPage,
        SignaturePage
    ],
    providers: [
        StatusBar,
        SplashScreen,
        { provide: ErrorHandler, useClass: IonicErrorHandler },
        AuthProvider,
        OrdenProvider,
        PuntoProvider,
        TecnicoProvider,
        DatePipe,
        LaunchNavigator,
        Geolocation,
        Diagnostic,
        DatePipe,
        BarcodeScanner,
        Camera,
    ParametroProvider
    ]
})
export class AppModule { }
