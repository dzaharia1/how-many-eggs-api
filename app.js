const express = require('express');
const path = require('path');
const app = express();
const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue, Filter } = require('firebase-admin/firestore');
const serviceAccount = require('./how-many-eggs-7d3604f1ac7c.json');
const { runInNewContext } = require('vm');

initializeApp({
    credential: cert(serviceAccount)
})

const db = getFirestore()

const localport = '3333';
const localhost = 'http://localhost';

app.host = app.set('host', process.env.HOST || localhost);
app.port = app.set('port', process.env.PORT || localport);

app.get('/', async (req, res) => {
    const all = await db.collection('howManyEggs').get()
    let ret = []
    all.forEach((doc) => {
        ret.push(doc.data());
    })
    res.json(ret)
});

app.post('/addrecord', async (req, res) => {
    const docRef = db.collection('howManyEggs').doc()
    result = await docRef.set({
        name: req.query.name,
        is_single: req.query.is_single,
        num_eggs: req.query.num_eggs,
        packing: req.query.packing,
        rationale: req.query.rationale,
        seeking: req.query.seeking,
        email: req.query.email
    });

    res.json(result);
})

app.get('/record/:id', async (req, res) => {
    const record = await db.collection('howManyEggs')
        .where('name', '==', req.params.id)
        .get();
    let returnArray = []

    record.forEach(doc => returnArray.push(doc))

    console.log(returnArray)
    res.json(returnArray);
})

app.get('/singlefolks', async (req, res) => {
    const record = await db.collection('howManyEggs')
        .where('is_single', '==', "true")
        .get();
    let returnArray = []

    record.forEach(doc => returnArray.push(doc))

    console.log(returnArray)
    res.json(returnArray);
})

let server = app.listen(app.get('port'), () => {
  app.address = app.get('host') + ':' + server.address().port;
  console.log('Listening at ' + app.address);
});
