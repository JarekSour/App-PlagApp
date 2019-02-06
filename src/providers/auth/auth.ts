import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class AuthProvider {

    url = 'https://api.plagapp.cl';

    constructor(public http: Http) { }

    islogged() {
        return new Promise((resolve) => {
            if (localStorage.getItem("token") === null)
                resolve(false);
            else
                resolve(true);
        });
    }

    login(json) {
        return new Promise((resolve, reject) => {
            let headers = new Headers();
            headers.append('Content-Type', 'application/json');

            this.http.post(this.url + '/tecnico/login', JSON.stringify(json), { headers: headers })
                .subscribe(res => {
                    resolve(res.json());
                }, (err) => {
                    reject(err);
                });
        });
    }

    logOut() {
        window.localStorage.clear();
    }
}
