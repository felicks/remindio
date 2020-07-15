'use strict';
const functions = require('firebase-functions');
const cors = require('cors')({origin: true});
const admin = require("firebase-admin");
admin.initializeApp();

exports.getReminder = functions.https.onRequest((req, res) => {

      if (req.method === 'POST') {  
     /*   console.log(req.body.uid)
        admin.auth().setCustomUserClaims(req.body.uid, {admin: true}).then(() => {
          // The new custom claims will propagate to the user's ID token the
          // next time a new one is issued.
          console.log("Admin Perm granted to: " + req.body.tokenID)
        });*/

        admin.auth().verifyIdToken(req.body.tokenID).then((claims) => {
          if (claims.admin === true) {
            // Allow access to requested admin resource.
            console.log("Permission granted!")
              //1. send to all devices
        if(req.body.preferences[0] === 'all'){
          console.log("send to all devices")
          const payload = {
            notification: {
              title: req.body.title,
              body: req.body.text
            },
            topic:"macis",
            data:{
              title: req.body.title,
              body: req.body.text,
            }
          }
          admin.messaging().send(payload)
            .then((response) => {
              console.log('Successfully sent message:', response);
            })
            .catch((error) => {
              console.log('Error sending message:', error);
            });
        }else{ 
          admin.firestore()
          .collection('profiles')
          .get()
          .then(querySnapshot => {
            querySnapshot.docs.forEach(doc => {
              //2. find specific users
              for(var i = 0; i < req.body.preferences.length; i++){
                if(doc.data()['preferences'][req.body.preferences[i]] != true){
                  var send = false; 
                }else{
                  var send = true;
                }
              }
              //3. send to specific users 
              if(send){
                console.log("Send to User: " + doc.data().name)
                const payload = {
                  notification: {
                    title: req.body.title,
                    body: req.body.text,
                  },
                  data:{
                    title: req.body.title,
                    body: req.body.text,
                  },
                  token: doc.data().token
                }
                admin.messaging().send(payload)
                  .then((response) => {
                    console.log('Successfully sent message:', response);
                  })
                  .catch((error) => {
                    console.log('Error sending message:', error);
                  });
              }
            })
          })
        }

        //4. add notification to DB
        admin.firestore().collection('messages')
        .add({
          'title': req.body.title,
          'text': req.body.text,
          'preferences': req.body.preferences,
          'timestamp': Date.now()
        })
        .then(res => {
          return res
        }, err => {
          this.error = err;
          reject(err)
        });
    

          }else{
            console.log("No Permission! " + req.body.tokenID)
          }
        });

      }
      //return sent messages
      if (req.method === 'GET') {
        var userId = req.url.split("/");
        userId = userId[userId.length - 1];
        var stringID = JSON.stringify(userId)

        return cors(req, res, () => {
        console.log(userId)
          admin.firestore()
          .collection('images').where("uid", "==", userId)
          .get().then(querySnapshot=> {
            let arrayR = querySnapshot.docs.map(doc => {
              return doc.data();
           }); 
           var randomID = Math.floor(Math.random() * Math.floor(arrayR.length));
           console.log(randomID)
           var src = arrayR[randomID]
           res.send(src)
          })
          .catch(err => {
            console.log('Error getting document', err);
          });
        });
      } 
    
      return cors(req, res, () => {
        res.send("Success!")
      });
  
});
