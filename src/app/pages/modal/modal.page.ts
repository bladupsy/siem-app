import { Component, OnInit } from '@angular/core';
import { ActionSheetController, IonRouterOutlet } from '@ionic/angular';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.page.html',
  styleUrls: ['./modal.page.scss'],
})
export class ModalPage implements OnInit {


  constructor(
    public routerOutlet: IonRouterOutlet,
    private actionSheetCtrl: ActionSheetController
  ) {}
  ngOnInit() {
  }
  async canDismiss() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Are you sure you want to discard your changes?',
      buttons: [
        {
          text: 'Discard Changes',
          role: 'destructive'
        },
        {
          text: 'Keep Editing',
          role: 'cancel'
        }
      ]
    });
    
    await actionSheet.present();

    const { role } = await actionSheet.onDidDismiss();
    
    if (role === 'destructive') {
      return true;
    }

    return false;
  }

}
