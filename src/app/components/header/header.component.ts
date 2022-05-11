import { Component} from '@angular/core';
import { UserService } from 'src/app/api/user.service';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  logos: any;
  constructor(public userService: UserService, public router: Router, private storage: Storage) { this.logos = [];}
  
  ionViewWillEnter() { this.getLogo(); }

  getLogo() {
    this.userService.getLogos().subscribe(response => {
      this.logos = response;
      console.log(response);
    });
  }

  goLogout(){
    this.storage.clear()
    this.router.navigateByUrl('/login');
  }

}
