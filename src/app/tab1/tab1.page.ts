import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { UserService } from 'src/app/api/user.service';
import { URL_TOKEN } from 'src/app/config/config'
import { URL_SERVIDOR } from 'src/app/config/config'
import { OtrasJurisdicciones  } from 'src/app/interfaces/resultados'
import { Chart } from 'chart.js';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActionSheetController, AlertController, IonRouterOutlet, ModalController } from '@ionic/angular';
import { ModalPage } from '../pages/modal/modal.page';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnDestroy {
  @ViewChild('BarsChartOtrasJurisdicciones', {static: false}) BarsChartOtrasJurisdicciones;
  BarsOtrasJurisdicciones: any;
  modal: HTMLElement;
  customYearValues = [2020, 2016, 2008, 2004, 2000, 1996];
  customDayShortNames = ['Domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
  customPickerOptions: any;
  logos: any;


  apiIngresoMunicipalOtras:any;
  apiLeyendaMunicipalOtras:any;

  ngOnDestroy(){
    this.getLogo();
    this.createOtrasJurisdicciones();
    this.var_ingreso_otrasJurisdicciones(event);
  }

  constructor(public alertController: AlertController,public userService: UserService,private http: HttpClient , public routerOutlet: IonRouterOutlet,
    private actionSheetCtrl: ActionSheetController, public modalController: ModalController
) {
    this.customPickerOptions = {
      buttons: [{
        text: 'Save',
        handler: () => console.log('Clicked Save!')
      }, {
        text: 'Log',
        handler: () => {
          console.log('Clicked Log. Do not Dismiss.');
          return false;
        }
      }]
    };
  }

  async doRefresh(event) {
    this.getLogo();
    this.createOtrasJurisdicciones();
    this.var_ingreso_otrasJurisdicciones(event);
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Éxitos',
      subHeader: '',
      message: 'Los datos se recargaron con éxito.',
      buttons: ['OK']
    });
    await alert.present();
  
  }

  ionViewWillEnter() {
    this.getLogo();
    this.createOtrasJurisdicciones();
    this.var_ingreso_otrasJurisdicciones(event);
  }

  var_ingreso_otrasJurisdicciones(event) {
    const my_url = URL_SERVIDOR + '/otras-jur/2020/20200101/20200131';
    var token = URL_TOKEN;
    const headers = {
      'content-type': 'application/json',
      'x-token': token
    }
    this.http.get<OtrasJurisdicciones>(my_url , {headers: headers}).subscribe(data => {
      let ingresoMunicipal = data['resultado'].map(data => data.importe);
      let leyendaMunicipal = data['resultado'].map(data => data.leyenda);
      this.apiIngresoMunicipalOtras = ingresoMunicipal;
      this.apiLeyendaMunicipalOtras = leyendaMunicipal;
      this.createOtrasJurisdicciones();
      event.target.complete();
    });
  }


  createOtrasJurisdicciones() {
    const ctx = this.BarsChartOtrasJurisdicciones.nativeElement;
    ctx.height = 400;
    this.BarsOtrasJurisdicciones = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: this.apiLeyendaMunicipalOtras,
      datasets: [
        {
          label: '# Miles de pesos',
          data: this.apiIngresoMunicipalOtras,
          backgroundColor: [
            'rgba(255, 99, 133, 0.3)',
            'rgba(54, 161, 235, 0.3)',
            'rgba(252, 79, 48, 0.3)',
            'rgba(5, 140, 107, 0.3)',
            'rgba(74, 3, 82, 0.3)'
          ],
          hoverBackgroundColor: ['#FF6384', '#36A2EB', '#fd4f30', '#115912', '#62056e']
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false
      }
  }); }



  getLogo() {
    this.userService.getLogos().subscribe(response => {
      this.logos = response;
    });
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: ModalPage,
      cssClass: 'my-custom-class'
    });
    return await modal.present();
  }

}
