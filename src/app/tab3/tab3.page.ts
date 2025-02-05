import { Component, ViewChild, OnDestroy } from '@angular/core';
import { UserService } from 'src/app/api/user.service';
import { URL_TOKEN } from "src/app/config/config";
import { URL_SERVIDOR } from "src/app/config/config";
import { LoadingController } from '@ionic/angular'
import * as moment from 'moment';
import { Chart } from "chart.js";
import { HttpClient } from "@angular/common/http";
import {
  DataResultado,
  ImportePorDia,
  Resultado,
  JurisdiccionMunicipal,
  IngresoMensualInterface,

} from "src/app/interfaces/resultados";
import { AlertController } from '@ionic/angular';

@Component({
  selector: "app-tab3",
  templateUrl: "tab3.page.html",
  styleUrls: ["tab3.page.scss"]
})
export class Tab3Page implements OnDestroy{



  ngOnDestroy(){
    this.createBarChartSemanal()
    this.createBarChartSemestral()
    this.createBarChartEgresoSemanal()
    this.createBarChartSeleccionMensual()
    this.createBarChartEgresoMensual()
    
    this.getLogo();
    this.var_ingresodelMes(Date).then( () => {} );
    this.var_semanal(event);
    this.var_EgrsosdelMesCapital(Date)
    this.var_EgresoSemanal();
  }


  @ViewChild("BarChartSemanal", { static: false }) BarChartSemanal;
  @ViewChild('BarChartSemestral', {static: false}) BarChartSemestral;
  @ViewChild('BarChartAnual', {static: false}) BarChartAnual;

    //Nuevos 
  @ViewChild("BarChartSeleccionMensual", { static: false }) BarChartSeleccionMensual;
  @ViewChild("BarChartEgresoMensual", { static: false }) BarChartEgresoMensual;
  @ViewChild('BarChartEgresoSemanal', {static: false}) BarChartEgresoSemanal;





  //Bars Nuevos
  BarsMensual: any;
  BarsSeleccionMensual: any;
  BarsEgresoMensual:any;
  BarSemanal: any;
  BarEgresoSemanal:any;
  apiEgresoMensual:any;




  BarsDiario:any;
  BarsDiarioCat:any;
  BarsAnual:any;
  BarsSemestral:any;
  colorArray: any;

  
  apiDiario:any;
  apiAnual:any;
  apiSemestral:any;
  apiDiarioCategoria:any;

  logos: any;

  isLoadingMensual = true;
  isLoadingDiario = true;

  apiSeleccionMensualImporte: any;
  apiSeleccionMensualLeyenda: any;

  apiIngresoMunicipal: any;
  apiLeyendaMunicipal: any;
  apiLeyendaSemanal: any;
  apiDiaSemanal: number[];
  apiSemanal: any;
  apiLeyendaEgresoSemanal:any;
  apiEgresoSemanal:any;

  customYearValues = [2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015];
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

  constructor(private http:HttpClient, public userService: UserService,private loadingCtrl: LoadingController, public alertController: AlertController) {}

  async doRefresh(event) {
    console.log('Begin async operation');
    this.getLogo();
    this.var_ingresodelMes(Date).then( () => {} );
    this.var_semanal(event);
    this.var_EgrsosdelMesCapital(Date)
    this.var_EgresoSemanal();

    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 2000); 
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
    this.createBarChartSemanal()
    this.createBarChartSemestral()
    this.createBarChartEgresoSemanal()
    this.createBarChartSeleccionMensual()
    this.createBarChartEgresoMensual()
  }
  

  ionViewWillEnter(){
    this.getLogo();
    this.var_ingresodelMes(Date).then( () => {} );
    this.var_semanal(event);
    this.var_EgrsosdelMesCapital(Date)
    this.var_EgresoSemanal();
  }

  getLogo() {
    // Get saved list of students
    this.userService.getLogos().subscribe(response => {
      this.logos = response;
      console.log(response);
    });
  }
  
  
//---------------------------------------------------------------------


async var_ingresodelMes(date) {
  var mi_fecha = moment(date).format("M"); 
  const my_url = URL_SERVIDOR + "/gastos-corrientes-mensual/2020/" + mi_fecha;
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
    console.log(apiDelImporteElegido);
  });
  
  
}

var_semanal(event) {
  const my_url = URL_SERVIDOR + "/gastos-corrientes-semanal/2020/25";
  var token = URL_TOKEN;
  const headers = {
    "content-type": "application/json",
    "x-token": token,
  };
  this.http
    .get<DataResultado>(my_url, { headers: headers })
    .subscribe((data) => {
      this.apiSemanal = data['resultado'].map(data => data.importe);
      this.apiLeyendaSemanal = "Total";
      this.createBarChartSemanal();
      event.target.complete();
      this.isLoadingMensual = false;

    });
}


async var_EgrsosdelMesCapital(date) {
  var mi_fecha = moment(date).format("M");  
  const my_url = URL_SERVIDOR + "/gastos-capital-mensual/2020/" + mi_fecha;
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
    this.createBarChartEgresoMensual();
    this.isLoadingMensual = false;
  });
  
  
}



var_EgresoSemanal() {
  const my_url = URL_SERVIDOR + "/gastos-capital-semanal/2020/5";
  var token = URL_TOKEN;
  const headers = {
    "content-type": "application/json",
    "x-token": token,
  };
  this.http
    .get<DataResultado>(my_url, { headers: headers })
    .subscribe((data) => {
      this.apiEgresoSemanal = data['resultado'].map(data => data.importe);
      this.apiLeyendaEgresoSemanal = "Total";
      this.isLoadingMensual = false;
      this.createBarChartEgresoSemanal()
    });
}
//---------------------------------------------------------------------



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
          backgroundColor: [
            'rgba(255, 99, 133, 0.3)',
            'rgba(54, 161, 235, 0.3)',
            'rgba(252, 79, 48, 0.3)',
            'rgba(5, 140, 107, 0.3)',
            'rgba(74, 3, 82, 0.3)',
            'rgba(38, 36, 36, 0.3)'
          ],
          borderColor: ['#ff6385', '#36a1eb', '#fc4f30', '#058c6b', '#4a0352', '#262424'],
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

 createBarChartEgresoSemanal() {
  const ctx = this.BarChartEgresoSemanal.nativeElement;
  ctx.height = 400;
  this.BarEgresoSemanal = new Chart(ctx, {
    type: "bar",
    data: {
      labels: this.customDayShortNames,
      datasets: [
        {
          label: this.apiLeyendaEgresoSemanal,
          data: this.apiEgresoSemanal,
          backgroundColor: [
            'rgba(255, 99, 133, 0.3)',
            'rgba(54, 161, 235, 0.3)',
            'rgba(252, 79, 48, 0.3)',
            'rgba(5, 140, 107, 0.3)',
            'rgba(74, 3, 82, 0.3)',
            'rgba(38, 36, 36, 0.3)'
          ],
          borderColor: ['#ff6385', '#36a1eb', '#fc4f30', '#058c6b', '#4a0352','#262424'],
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
          backgroundColor: [
            'rgba(255, 99, 133, 0.3)',
            'rgba(54, 161, 235, 0.3)',
            'rgba(252, 79, 48, 0.3)',
            'rgba(5, 140, 107, 0.3)',
            'rgba(74, 3, 82, 0.3)',
            'rgba(38, 36, 36, 0.3)'
          ],
          hoverBackgroundColor: ['#ff6385', '#36a1eb', '#fc4f30', '#058c6b', '#4a0352', '#262424'],
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
    },
  });
}

createBarChartEgresoMensual() {
  const ctx = this.BarChartEgresoMensual.nativeElement;
  ctx.height = 400;
  this.BarsEgresoMensual = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: this.apiSeleccionMensualLeyenda,
      datasets: [
        {
          label: "# Miles de pesos",
          data: this.apiSeleccionMensualImporte,
          backgroundColor: [
            'rgba(255, 99, 133, 0.3)',
            'rgba(54, 161, 235, 0.3)',
            'rgba(252, 79, 48, 0.3)',
            'rgba(5, 140, 107, 0.3)',
            'rgba(74, 3, 82, 0.3)',
            'rgba(38, 36, 36, 0.3)'
          ],
          hoverBackgroundColor: ['#ff6385', '#36a1eb', '#fc4f30', '#058c6b', '#4a0352', '#262424'],
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
    },
  });
}

  

  createBarChartSemestral() {
    let ctx = this.BarChartSemestral.nativeElement
    ctx.height = 400;
    this.BarsSemestral = new Chart(ctx,{
    type: "line",
    data: {
      labels: this.apiSemestral && this.apiSemestral.labels ,
      datasets: [
        {
          data: this.apiEgresoMensual,
          label: "Egreso Municipal Mensual",
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
      ]
    }
  });


  
}
      




    

    
}