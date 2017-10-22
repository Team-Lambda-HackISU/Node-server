const express = require('express');
const bodyParser = require('body-parser')
const router = express.Router();
const multer = require('multer');
const Storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, "./uploads");
    },
    filename: function (req, file, callback) {
        callback(null, file.originalname);
    }
});
const upload = multer({ storage: Storage })
var xml2js = require('xml2js');
const fetch = require('node-fetch');
const util = require('util');
require('util.promisify').shim();
const parseXML = util.promisify(require("xml2js").parseString)

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

// Imports the Google Cloud client library
const Vision = require('@google-cloud/vision');
// Instantiates a client
const vision = Vision();
var fileName = "./uploads/bold-grocery-list.jpg";

const request = {
  source: {
    filename: fileName
  }
};

let getXML = (param, item) => {
    return fetch(`http://www.supermarketapi.com/api.asmx/${param}?APIKEY=1d41310452&ItemName=${item}`)
        .then(response => response.text())
        .then(parseXML)
        .then(response => console.log(response))
}

// Serves index.html file
router.use(express.static('public'));
router.get('/testform', (req, res)=>{
    res.render('Tester');
})

// Recieves post data from the form
router.post ('/upload', upload.single('file'), (req,res)=>{
    let items;
    let valids = [];
    vision.textDetection(request)
  .then((results) => {
        const detections = results[0].textAnnotations;
        let string = detections[0].description;
        console.log('Text:');
        // items.push(detections[0].description);
        // detections.forEach((text) => items.push(text.description));
        items = string.split('\n');
        console.log(items);
        var regex = /([A-Z])\w+/g
        var notChar = /([^A-Z])\w+/g
        for(var i=1; i < items.length; i++){
            var tracker = 0;
            for(var j=0; j < items[i].length; j++){
                
                if ('ABCDEFGHIJKLMNOPQRSTUVWXYZ'.indexOf(items[i].toUpperCase().charAt(j))>=0){
                    tracker += 1;
                }
            }
            if(items[i].length == tracker && items[i] != ""){
                valids.push(items[i]);
            }
        };
        console.log(valids);
        res.render('Tester', {"words" : valids});
        // getXML('SearchByProductName', valids[0]);
      })
      .catch((err) => {
        console.error('ERROR:', err);
      });
});

router.post('/android/upload', upload.single('file'), (req,res)=>{
    let items;
    let valids = [];
    vision.textDetection(request)
  .then((results) => {
        const detections = results[0].textAnnotations;
        let string = detections[0].description;
        console.log('Text:');
        items = string.split('\n');
        console.log(items);
        for(var i=1; i < items.length; i++){
            var tracker = 0;
            for(var j=0; j < items[i].length; j++){
                
                if ('ABCDEFGHIJKLMNOPQRSTUVWXYZ'.indexOf(items[i].toUpperCase().charAt(j))>=0){
                    tracker += 1;
                }
            }
            if(items[i].length == tracker && items[i] != ""){
                valids.push(items[i]);
            }
        };
        console.log(valids);
        return res.json({'result': valids});
      })
      .catch((err) => {
        console.error('ERROR:', err);
      });
});

router.post('/groceries', urlencodedParser, (req, res)=>{
    var poop = req.body;
    console.log(poop);
    res.send(poop);
})

module.exports = router;