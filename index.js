var admin = require("firebase-admin");

var serviceAccount = require("./PrivateKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const express = require("express");
const app = express();

app.listen(8080, () => {
  console.log("LISTENING");
});

app.get("/win/:pseudo_time", (req, res) => {
  const pseudo = req.params.pseudo_time.split("_")[0];
  const time = req.params.pseudo_time.split("_")[1];
  console.log(pseudo + " has WON in: " + time+"min");

  //Search user doc in firebase:
  var docRef = db.collection("users").doc(pseudo);
  docRef
    .get()
    .then((doc) => {
      if (doc.exists) {
        console.log("Document data:", doc.data());
        //MODIFY DATA:
        //ADD 1 to wins in firebase:
        docRef.update({
          wins: admin.firestore.FieldValue.increment(1),

          durations: admin.firestore.FieldValue.arrayUnion({
            time: time,
            date: new Date().toDateString(),
          }),
        });
        console.log("Data updated!");
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
        db.collection("users")
          .doc(pseudo)
          .set({
            username: pseudo,
            loses: 0,
            wins: 1,
            durations: [{ time: time, date: new Date().toDateString() }],
          });
        console.log("Data added!");
      }
    })
    .catch((error) => {
      console.log("Error getting document:", error);
      db.collection("users")
        .doc(pseudo)
        .set({
          username: pseudo,
          loses: 0,
          wins: 1,
          durations: [{ time: time, date: new Date() }],
        });
       console.log("Data added!");
    });

  res.status(200).json("OK");
});

app.get("/lost/:pseudo", (req, res) => {
  const pseudo = req.params.pseudo;
  console.log(req.params.pseudo + " has LOST!");

  //Search user doc in firebase:
  var docRef = db.collection("users").doc(pseudo);
  docRef
    .get()
    .then((doc) => {
      if (doc.exists) {
        console.log("Document data:", doc.data());
        //MODIFY DATA:
        //ADD 1 to wins in firebase:
        docRef.update({
          loses: admin.firestore.FieldValue.increment(1),
        });
        console.log("Data updated!");
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
        db.collection("users")
          .doc(pseudo)
          .set({
            username: pseudo,
            loses: 1,
            wins: 0,
            durations: [],
          });
        console.log("Data added!");
      }
    })
    .catch((error) => {
      console.log("Error getting document:", error);
      db.collection("users")
        .doc(pseudo)
        .set({
          username: pseudo,
          loses: 1,
          wins: 0,
          durations: [],
        });
      console.log("Data added!");
    });

  res.status(200).json("OK");
});
