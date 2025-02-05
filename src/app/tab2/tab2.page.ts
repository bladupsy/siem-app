import { Component, ViewChild, OnDestroy } from "@angular/core";
import { UserService } from "src/app/api/user.service";
import { URL_TOKEN } from "src/app/config/config";
import { URL_SERVIDOR } from "src/app/config/config";
import {
  DataResultado,
  ImportePorDia,
  Resultado,
  JurisdiccionMunicipal,
  IngresoMensualInterface,

} from "src/app/interfaces/resultados";
import { AlertController } from '@ionic/angular';

import { LoadingController } from '@ionic/angular'
import * as moment from 'moment';
import { Chart } from "chart.js";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "app-tab2",
  templateUrl: "tab2.page.html",
  styleUrls: ["tab2.page.scss"],
})
export class Tab2Page implements OnDestroy {


  ngOnDestroy(){
    this.getLogo();
    this.var_semanal(event);
    this.var_ingreso_mensual();
    this.var_ingreso_capital();
    this.var_ingreso_jurisdiccionMunicipal();
    this.var_ingresodelMes(Date).then( () => {} );
    this.var_ingreso_pordia(Date);

    this.createBarChartSemanal();
    this.createBarChartMensual();
    this.createJurisdiccionMunicipal();
    this.createBarChartSeleccionMensual();
    this.createBarChartSeleccionDiario();
  }


  @ViewChild("BarChartSemanal", { static: false }) BarChartSemanal;
  @ViewChild("BarChartMunicipales", { static: false }) BarChartMunicipales;
  @ViewChild("BarChartMensual", { static: false }) BarChartMensual;
  @ViewChild("BarChartAnual", { static: false }) BarChartAnual;
  @ViewChild("BarChartSeleccionMensual", { static: false }) BarChartSeleccionMensual;
  @ViewChild("BarChartSeleccionDiaria", { static: false }) BarChartSeleccionDiaria;

  BarsDiario: any;
  BarSemanal: any;
  BarsMensual: any;
  BarsAnual: any;
  BarsMunicipales: any;
  BarsSeleccionMensual: any;
  BarsSeleccionDiaria: any;
  colorArray: any;
  apiDiario: any;
  apiDiarioCategoria: any;
  apiSemanal: any;
  apiDiaExacto: any;
  apiSemestral: any;
  apiAnual: any;
  apiDelMes: any;
  apiImporteElegidadiaria: any;
  apiLeyendaElegidaDiaria: any;
  logos: any;
  customYearValues = [2020, 2019, 2018, 2017, 2016, 2015];
  customMonthValues = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];
  customDayShortNames = [
    "lunes",
    "martes",
    "miercoles",
    "jueves",
    "viernes",
  ];

  CustomBackgroundColor = [
    'rgba(255, 99, 133, 0.3)',
  'rgba(54, 161, 253, 0.3)',
  'rgba(126, 8, 125, 0.3)',
  'rgba(252, 79, 48, 0.3)',
  'rgba(5, 140, 103, 0.3)',
  'rgba(114, 182, 70, 0.8)',
  'rgba(105, 79, 187, 0.8)',
  'rgba(26, 41, 233, 0.8)',
  'rgba(0, 34, 109, 0.8)',
  'rgba(255, 34, 109, 0.8)',
  'rgba(255, 148, 109, 0.8)',
  'rgba(255, 113, 7, 0.8)',
  'rgba(78, 113, 7, 0.8)',
  'rgba(78, 113, 198, 0.8)',
  'rgba(214, 61, 119, 0.5)',
  'rgba(113, 226, 20, 0.5)',
  'rgba(48, 47, 125, 0.5)',
  'rgba(0, 137, 255, 0.5)',
  'rgba(0, 0, 60, 0.5)',
  'rgba(196, 255, 160, 0.5)',
  'rgba(255, 108, 200, 0.5)',
  'rgba(126, 8, 125, 0.5)'
  ]
  CustomHoverBackgroundColor = ['#ff6385', '#36a1eb', '#fc4f30', '#058c6b', '#4a0352','#262424']


  customPickerOptions: any;
  DataResultado: Resultado;
  apiLeyendaSemanal: any;
  apiDiaSemanal: number[];
  apiIngresoMunicipal: any;
  apiLeyendaMunicipal: any;
  apiIngresoMensual: any;
  apiSeleccionMensualImporte: any;
  apiSeleccionMensualLeyenda: any;
  isLoadingMensual = true;
  isLoadingDiario = true;

  constructor(private http: HttpClient, public userService: UserService, private loadingCtrl: LoadingController, public alertController: AlertController) {
    this.apiSemanal = [];
    this.apiDiaExacto = [];

    this.customPickerOptions = {
      buttons: [
        {
          text: "Save",
          handler: (time:any) => {
        }

        },
        {
          text: "Log",
          handler: () => {
            return false;
          },
        },
      ],
    };
  }

  async doRefresh(event) {
    console.log('Begin async operation');
    this.getLogo();
    this.var_semanal(event);
    this.var_ingreso_mensual();
    this.var_ingreso_capital();
    this.var_ingreso_jurisdiccionMunicipal();
    this.var_ingresodelMes(Date).then( () => {} );
    this.var_ingreso_pordia(Date);
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Éxitos',
      subHeader: '',
      message: 'Los datos se recargaron con éxito.',
      buttons: ['OK']
    });
    await alert.present();
  
  }
  
  ionViewDidEnter() {
    this.createBarChartSemanal();
    this.createBarChartMensual();
    this.createJurisdiccionMunicipal();
    this.createBarChartSeleccionMensual();
    this.createBarChartSeleccionDiario();
  }

  ionViewWillEnter() {
    this.getLogo();
    this.var_semanal(event);
    this.var_ingreso_mensual();
    this.var_ingreso_capital();
    this.var_ingreso_jurisdiccionMunicipal();
    this.var_ingresodelMes(Date).then( () => {} );
    this.var_ingreso_pordia(Date);
  }


  getLogo() {
    this.userService.getLogos().subscribe((response) => {
      this.logos = response;
    });
  }


  
  
  async var_semanal(event) {
    const my_url = URL_SERVIDOR + "/recaudacion-semanal/2020/25";
    var token = URL_TOKEN;
    const headers = {
      "content-type": "application/json",
      "x-token": token,
    };
    await this.http
      .get<DataResultado>(my_url, { headers: headers })
      .subscribe((data) => {
        this.apiSemanal = [];
        const arrayInit = data.resultado;
        var diaActual: number;
        for (let i = 0; i < arrayInit.length; i++) {
          const dia = arrayInit[i].dia;
          if (diaActual !== dia) {
            const numberPush: number = arrayInit[i].importe;
            diaActual = arrayInit[i].dia;
            this.apiSemanal.push(numberPush);
          } else {
            const numberAdd = arrayInit[i].importe;
            const arrayToAdd = this.apiSemanal.length - 1;
            this.apiSemanal[arrayToAdd] += numberAdd;
          }
        }
        this.apiLeyendaSemanal = "Total";
        event.target.complete();
      });
  }

 async var_ingreso_mensual() {
    const my_url = URL_SERVIDOR + "/recaudacion-mensual/2020";
    var token = URL_TOKEN;
    const headers = {
      "content-type": "application/json",
      "x-token": token,
    };
    await this.http
      .get<IngresoMensualInterface>(my_url, { headers: headers })
      .subscribe((data) => {
        let ingresoMensual = data["resultado"].map((data) => data.importe);
        this.apiIngresoMensual = ingresoMensual;
        this.createBarChartMensual();
      });
  }

  async var_ingreso_capital() {
    const my_url = URL_SERVIDOR + "/ingreso-capital/2020/200101/200131";
    var token = URL_TOKEN;
    const headers = {
      "content-type": "application/json",
      "x-token": token,
    };
   await this.http.get(my_url, { headers: headers }).subscribe((data) => {
      this.apiDiario = data;
      this.createBarChartSemanal();
    });
  }

  async var_ingresodelMes(date) {
    var mi_fecha = moment(date).format("M");  
    const my_url = URL_SERVIDOR + "/recaudacion-mensual/2020/" + mi_fecha;
    var token = URL_TOKEN;
    const headers = {
      "content-type": "application/json",
      "x-token": token,
    };
     this.http.get<IngresoMensualInterface>(my_url, { headers: headers }).subscribe((data) => {
      let apiDelImporteElegido = data.resultado.map(data => data.importe)
      let apiDelLeyendaElegida = data.resultado.map(data => data.leyenda)
      this.apiSeleccionMensualImporte = apiDelImporteElegido;
      this.apiSeleccionMensualLeyenda = apiDelLeyendaElegida;
      this.createBarChartSeleccionMensual();
      this.isLoadingMensual = false;
    });
    
    
  }


async var_ingreso_pordia(myday) {
  var weeknumber = moment(myday).week();
  const my_url = URL_SERVIDOR + "/recaudacion-semanal/2020/" + weeknumber;
  var token = URL_TOKEN;
  const headers = {
    "content-type": "application/json",
    "x-token": token,
  };
 await this.http.get<ImportePorDia>(my_url, { headers: headers }).subscribe((data) => {
    let ArrayDelDia = data.resultado;
    var DiaSeleccionado =  ArrayDelDia.reduce(function(h, obj) {
      h[obj.dia] = (h[obj.dia] || []).concat(obj);
      return h; 
    }, {})
    const date = moment(myday);
    this.apiDiaExacto = date.weekday() + 1;
    let LeyendaElegida = DiaSeleccionado[this.apiDiaExacto].map(DiaSeleccionado => DiaSeleccionado.leyenda);
    let ImporteElegida = DiaSeleccionado[this.apiDiaExacto].map(DiaSeleccionado => DiaSeleccionado.importe)
    this.apiLeyendaElegidaDiaria = LeyendaElegida;
    this.apiImporteElegidadiaria = ImporteElegida;
    this.createBarChartSeleccionDiario();
    this.isLoadingDiario = false;

  });
}


createBarChartSeleccionDiario() {
  const ctx = this.BarChartSeleccionDiaria.nativeElement;
  ctx.height = 400;
  this.BarsSeleccionDiaria = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: this.apiLeyendaElegidaDiaria,
      datasets: [
        {
          label: "# Miles de pesos",
          data: this.apiImporteElegidadiaria,
          backgroundColor: this.CustomBackgroundColor,
          hoverBackgroundColor: this.CustomHoverBackgroundColor,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
    },
  });
}


 async var_ingreso_jurisdiccionMunicipal() {
    const my_url = URL_SERVIDOR + "/jur-municipal/2020/20200101/20200110";
    var token = URL_TOKEN;
    const headers = {
      "content-type": "application/json",
      "x-token": token,
    };
   await this.http
      .get<JurisdiccionMunicipal>(my_url, { headers: headers })
      .subscribe((data) => {
        let ingresoJurisdiccionMunicipal = data["resultado"].map(
          (data) => data.importe
        );
        let leyendaJurisdiccionMunicipal = data["resultado"].map(
          (data) => data.leyenda
        );
        this.apiIngresoMunicipal = ingresoJurisdiccionMunicipal;
        this.apiLeyendaMunicipal = leyendaJurisdiccionMunicipal;
        this.createJurisdiccionMunicipal();
      });
  }

  createBarChartSeleccionMensual() {
    const ctx = this.BarChartSeleccionMensual.nativeElement;
    ctx.height = 400;
    this.BarsSeleccionMensual = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: this.apiSeleccionMensualLeyenda,
        datasets: [
          {
            label: "# Miles de pesos",
            data: this.apiSeleccionMensualImporte,
            backgroundColor: this.CustomBackgroundColor,
            hoverBackgroundColor: this.CustomHoverBackgroundColor,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    });
  }

  createBarChartSemanal() {
    const ctx = this.BarChartSemanal.nativeElement;
    ctx.height = 400;
    this.BarSemanal = new Chart(ctx, {
      type: "bar",
      data: {
        labels: this.customDayShortNames,
        datasets: [
          {
            label: this.apiLeyendaSemanal,
            data: this.apiSemanal,
            backgroundColor: this.CustomBackgroundColor,
            hoverBackgroundColor: this.CustomHoverBackgroundColor,
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
              },
            },
          ],
        },
      },
    });
  }

  createJurisdiccionMunicipal() {
    const ctx = this.BarChartMunicipales.nativeElement;
    ctx.height = 120;
    this.BarsMunicipales = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: this.apiLeyendaMunicipal,
        datasets: [
          {
            // label: "# Miles de pesos",
            data: this.apiIngresoMunicipal,
            backgroundColor: this.CustomBackgroundColor,
            hoverBackgroundColor: this.CustomHoverBackgroundColor,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    });
  }

  createBarChartMensual() {
    const ctx = this.BarChartMensual.nativeElement;
    ctx.height = 400;
    this.BarsMensual = new Chart(ctx, {
      type: "line",
      data: {
        labels: this.customMonthValues,
        datasets: [
          {
            data: this.apiIngresoMensual,
            label: "Ingreso Municipal Mensual",
            fill: false,
            lineTension: 0.1,
            backgroundColor: "rgba(54, 161, 235,0.4)",
            borderColor: "rgba(54, 161, 235,1)",
            borderCapStyle: "butt",
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: "miter",
            pointBorderColor: "rgba(54, 161, 235,1)",
            pointBackgroundColor: "#fff",
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "rgba(54, 161, 235,1)",
            pointHoverBorderColor: "rgba(74, 3, 82,1)",
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            spanGaps: false,
          },
        ],
      },
    });
  }
}
