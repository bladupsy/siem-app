import { Component, OnInit } from '@angular/core';
import { UserService } from "../../api/user.service";
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { Login } from 'src/app/interfaces/resultados';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {

  email: string;
  password: string;
  municipalidad: string;
  slideOpts = {
    effect: 'fade',
    allowSlidePrev: true,
    allowSlideNext: true,
    direction: 'horizontal',
    autoplay: true,
    speed: 1000
  };

  slides: { img: string, titulo: string, desc: string }[] = [
    {
      img: '/assets/slides/isologo.svg',
      titulo: ' S I E M ',
      desc: 'Información Ejecutiva Municipal'
    },
    {
      img: '/assets/slides/isologo.svg',
      titulo: 'Coparticipación',
      desc: 'Ingresos municipales por Coparticipación'
    },
    {
      img: '/assets/slides/isologo.svg',
      titulo: 'Recaudación',
      desc: 'Recaudación diaria, semanal, mensual, registro histórico'
    },
    {
      img: '/assets/slides/isologo.svg',
      titulo: 'Gastos',
      desc: 'Gastos diarios por categoría, gastos semanales e historico de gastos'
    },
    {
      img: '/assets/slides/ideando_isologo.png',
      titulo: 'Ideando Consultoria',
      desc: '¡ Juntos Concretamos IDEAS !'
    }
  ];

  constructor(public userService: UserService, public router: Router, private http: HttpClient, private storage: Storage) {
  }

  login() {
    let usuario = { email: this.email, password: this.password, role: 'INTENDENTE_ROLE' };
      this.http.post<Login>('https://siem-back.herokuapp.com/login', usuario).subscribe(data => {
      this.storage.set('token', data.token)
      this.storage.get(data.token)
      let Municipal = data.usuario.municipalidad;
      this.municipalidad = Municipal;
      this.router.navigateByUrl('/tabs');
      this.storage.set('user', data.usuario)
    });
  }

}
