import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Sesion } from '../interfaces/resultados';

@Component({
  selector: "app-tab4",
  templateUrl: "tab4.page.html",
  styleUrls: ["tab4.page.scss"]
})
export class Tab4Page implements OnInit {
  users: Array<Sesion>;
  email: string;
  name: string;
  municipio: string;
  booleanColor: boolean;
  token: string;

  constructor(public router: Router, private storage: Storage, public alertController: AlertController){}

  ngOnInit(): void {
    this.storage.get('user').then((val) => {
      this.users = val
      this.email = val.email
      this.municipio = val.municipalidad
      this.name = val.nombre
      console.log(this.users)
      if(val._id != null){
        this.booleanColor = true
        this.token = 'valido'
      }
    });
    if(this.users == undefined){
      this.booleanColor = false
      this.token = 'invalido'
    }
    
  }

  goLogout(){
    this.storage.clear()
    this.router.navigateByUrl('/login');
  }

  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: '¿Esta seguro de cerrar sesion?',
      message: '',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
          }
        }, {
          text: 'Cerrar sesion',
          handler: () => {
            this. goLogout()
          }
        }
      ]
    });
    await alert.present();
  }
}