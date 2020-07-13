const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
require('./Road');

app.use(bodyParser.json());

const Road = mongoose.model("road");

const mongoUri = "mongodb+srv://admin:4WrLk4ZLe3Y2OuHN@cluster0.sv1un.mongodb.net/<dbname>?retryWrites=true&w=majority"

mongoose.connect(mongoUri,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useFindAndModify: true
});

app.get('/', (req, res) => {
    Road.find({})
    .then(data => {
        console.log(data);
        res.send(data);
    })
    .catch(err => {
        console.log(err);
    })
})


/* Routes handling */
app.post("/send-data", (req, res)=>{
    const road = new Road({
        roadNumber: req.body.roadNumber,
        roadName: req.body.roadName,
        fromChainage: req.body.fromChainage,
        toChainage: req.body.toChainage,
        roadLength: req.body.roadLength,
        from: req.body.from,
        to: req.body.to,
        pci: req.body.pci,
        location: req.body.location,
        numImage: req.body.numImage,
        imageUrls: req.body.imageUrls,
        timeCreated: req.body.timeCreated,
        timeModified: req.body.timeModified,
    })

    road.save()
    .then((data) => {
        console.log(data);
        res.send(data);
    })
    .catch(
        err => console.log(err)
    );
})

app.post("/delete", (req, res) => {
    Road.findByIdAndRemove(req.body._id)
    .then(data => {
        res.send(data);
    })
    .catch(
        err => {console.log(err);}
    );

})

app.post("/update", (req, res)=>{
    Road.findByIdAndUpdate(req.body._id, {
        roadNumber: req.body.roadNumber,
        roadName: req.body.roadName,
        fromChainage: req.body.fromChainage,
        toChainage: req.body.toChainage,
        roadLength: req.body.roadLength,
        from: req.body.from,
        to: req.body.to,
        pci: req.body.pci,
        location: req.body.location,
        numImage: req.body.numImage,
        imageUrls: req.body.imageUrls,
        timeCreated: req.body.timeCreated,
        timeModified: req.body.timeModified,
    })
    .then(data => {
        res.send(data)
    })
    .catch(
        err => {console.log(err);}
    )
})

app.listen(3000, () => {
    console.log('Server is up and running!');
})