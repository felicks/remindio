import { Component } from '@angular/core';
import {AuthenticationService } from '../shared/authentication-service'

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  user:any; 

  constructor(private auth: AuthenticationService) {
    this.user = JSON.parse(this.auth.getUserData())
    console.log(this.auth.isLoggedIn)
  }


}
