import { Component } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import {AuthenticationService } from '../shared/authentication-service';
import { Router } from "@angular/router";

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

  constructor(private router: Router, private afs: AngularFirestore, private afStorage: AngularFireStorage, private auth: AuthenticationService) {
    this.user = JSON.parse(this.auth.getUserData())
    this.image = afs.collection('/images').valueChanges()

    this.imageArray = []

    this.image.forEach(element => {
      if(this.imageArray.length <= 1){
        this.imageArray = [element]
      }else{
        this.imageArray.push(element)
      }
    });

    setTimeout(() => {
      this.loadImage()
    }, 500);
  }

  loadImage(){
    console.log(this.imageArray[0].length)
    var randomID = Math.floor(Math.random() * Math.floor(this.imageArray[0].length));
    console.log(randomID)
    var src = this.imageArray[0][randomID].src
    this.date = this.imageArray[0][randomID].timestamp
    console.log(this.date)
    this.afStorage.ref(src).getDownloadURL().subscribe(link => {
      this.link = link;
      })
  }
  goToLogin(){
    this.router.navigate(['']);
  }
}
