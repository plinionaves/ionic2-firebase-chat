import { OnInit } from "@angular/core";

import { App, AlertController, MenuController, NavController } from 'ionic-angular';

import { AuthService } from './../providers/auth.service';
import { SigninPage } from './../pages/signin/signin';

export abstract class BaseComponent implements OnInit {

    protected navCtrl: NavController;

    constructor(
        public alertCtrl: AlertController,
        public authService: AuthService,
        public app: App,
        public menuCtrl: MenuController
    ) {}

    ngOnInit(): void {
        this.navCtrl = this.app.getActiveNavs()[0];
    }

    onLogout(): void {
        this.alertCtrl.create({
            message: 'Do you want to quit?',
            buttons: [
                {
                    text: 'Yes',
                    handler: () => {
                        this.authService.logout()
                            .then(() => {
                                this.navCtrl.setRoot(SigninPage);
                                this.menuCtrl.enable(false, 'user-menu');
                            });
                    }
                },
                {
                    text: 'No'
                }
            ]
        }).present();
    }

}