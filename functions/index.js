const functions = require("firebase-functions");
const admin = require('firebase-admin');

admin.initializeApp();

const express = require('express');
const app = express();

app.get('/speeches', (req, res) => {
    admin
        .firestore()
        .collection('speeches')
        .get()  
        .then(data => {
            let speeches = [];
            data.forEach(doc => {
                speeches.push({
                    speechId: doc.id,
                    body: doc.data().body,
                    userHandle: doc.data().userHandle,
                    createdAt: doc.data().createdAt
                });
            });
                return res.json(speeches);
            })
        .catch(err => console.error(err));
})



app.post('/speech', (req, res) => {
    const newSpeech = {
        body:  req.body.body,
        userHandle: req.body.userHandle,
        createdAt: admin.firestore.Timestamp.fromDate(new Date())
    };
    admin.firestore()
    .collection('speeches')
    .add(newSpeech)
    .then(doc => {
        res.json({message: `document ${doc.id} created successfully.`});
    })
    .catch(err => {
        res.status(500).json({error: 'something went wrong'});
        console.error(err);
    })
});

exports.api = functions.https.onRequest(app);