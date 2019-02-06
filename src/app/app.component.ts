import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AuthProvider } from '../providers/auth/auth';

@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    @ViewChild(Nav) nav: Nav;

    rootPage: any;

    constructor(
        public authService: AuthProvider,
        public platform: Platform,
        public statusBar: StatusBar,
        public splashScreen: SplashScreen) {
        this.initializeApp();
    }

    initializeApp() {
        this.platform.ready().then(() => {
            this.authService.islogged().then((isloggedIn) => {
                if (isloggedIn) {
                    if (localStorage.getItem("orden") === null)
                        this.rootPage = 'HomePage';
                    else
                        this.rootPage = 'StartVisitPage';
                } else {
                    this.rootPage = 'LoginPage';
                }
            });
        });
    }
}
