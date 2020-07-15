import { Component } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import {AuthenticationService } from '../shared/authentication-service';
import { Router } from "@angular/router";
import { HttpClient } from '@angular/common/http'

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  image: any
  imageArray: any;
  link: any; 
  date
  user: any; 

  constructor(public http: HttpClient, private router: Router, private afs: AngularFirestore, private afStorage: AngularFireStorage, private auth: AuthenticationService) {
    this.user = JSON.parse(this.auth.getUserData())
    this.image = afs.collection('/images').valueChanges()
    console.log(this.auth.isLoggedIn)
    this.imageArray = []

    this.image.forEach(element => {
      if(this.imageArray.length <= 1){
        this.imageArray = [element]
      }else{
        this.imageArray.push(element)
      }
    });
   this.getReminder();
  }



 getReminder(){
    console.log("Get Reminder")
    this.http.get("https://us-central1-remindio.cloudfunctions.net/getReminder" + "/1").subscribe(
      (val) => {
        for (var message in val) {
          console.log(val);
          this.date = val["timestamp"]
          this.afStorage.ref(val["src"]).getDownloadURL().subscribe(link => {
            this.link = link;
            })
        }
        
      },
      response => {
        console.log("GET call in error", response);
      },
      () => {
        console.log("The GET observable is now completed.");
      });
  }

  goToLogin(){
    this.router.navigate(['']);
  }
}
