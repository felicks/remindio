import { Component } from '@angular/core';
import { Plugins, CameraResultType, CameraSource } from '@capacitor/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import {AuthenticationService } from '../shared/authentication-service';
import { Router } from "@angular/router";

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  photo: SafeResourceUrl;
  source: any;
  ref: any; 
  task: any; 
  file: any; 
  uploaded: boolean = false; 
  user:any; 

  constructor(private router: Router, private afs: AngularFirestore, private sanitizer: DomSanitizer,private afStorage: AngularFireStorage,private auth: AuthenticationService) {
    
  }
  ngOnInit(){
    this.user = JSON.parse(this.auth.getUserData())
  }
  async takePicture() {
    const image = await Plugins.Camera.getPhoto({
      quality: 100,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: CameraSource.Camera
    });

    this.photo = 'data:image/jpg;base64,'+  image.base64String
    console.log(image.base64String)
    let uploadInfo: any = await this.uploadToFirebase(image.base64String);
  }

  makeFileIntoBlob(_imagePath) {
    // INSTALL PLUGIN - cordova plugin add cordova-plugin-file
    return new Promise((resolve, reject) => {
      let fileName = "";
      this.file
        .resolveLocalFilesystemUrl(_imagePath)
        .then(fileEntry => {
          let { name, nativeURL } = fileEntry;

          // get the path..
          let path = nativeURL.substring(0, nativeURL.lastIndexOf("/"));

          fileName = name;

          // we are provided the name, so now read the file into a buffer
          return this.file.readAsArrayBuffer(path, name);
        })
        .then(buffer => {
          // get the buffer and make a blob to be saved
          let imgBlob = new Blob([buffer], {
            type: "image/jpeg"
          });
          
          // pass back blob and the name of the file for saving
          // into fire base
          resolve({
            fileName,
            imgBlob
          });
        })
        .catch(e => reject(e));
    });
  }

  uploadToFirebase(img) {
    this.uploaded = true; 
    var date = Date.now()
    var filename = date +'.jpg'

    this.afs.collection('/images').doc(filename).set(
      { 
        src: 'images/' + filename,
        timestamp: date,
        uid: this.user.uuid
      });

    return new Promise((resolve, reject) => {
      let fileRef = this.afStorage.ref("images/" + filename);
      fileRef.putString(img, 'base64').then(function(snapshot) {
        console.log('Uploaded a data_url string!');
      });
    });
  }

  goToLogin(){
    this.router.navigate(['']);
  }
}
