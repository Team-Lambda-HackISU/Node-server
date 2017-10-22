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
const fetch = require('node-fetch');
var jsonParser = bodyParser.json()

const walmart=require('../views/TheOG');
const walmartSN=require('../views/storeNumber');

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

// Imports the Google Cloud client library
const Vision = require('@google-cloud/vision');
// Instantiates a client
const vision = Vision();
var fileName = "./uploads/bold-grocery-list.jpg";



// Serves index.html file
router.use(express.static('public'));
router.get('/testform', (req, res)=>{
    res.render('Tester');
})

// Recieves post data from the form
router.post ('/upload', upload.single('file'), (req,res)=>{
    let items;
    let valids = [];
    let filePath = '/home/ubuntu/workspace/uploads/' + req.file.originalname;
    console.log("file: " + filePath)
    const request = {
          source: {
            filename: filePath
          }
        };
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

// Gets an object of correct words
router.post('/groceries', urlencodedParser, (req, res)=>{
    var poop = req.body.items;
    var priceList = {};
    
    async function collect (arr, list) {
        // await walmart.getPrice(arr[0]);
        for (var i=0; i<arr.length; i++){
            let price = await walmart.getPrice(arr[i]);
            list[arr[i]]=price;
        }
        console.log(list);
        return list;
    }
    
    collect(poop, priceList);
    
    
})

router.post('/gotMilk', bodyParser.json(), (req,res)=>{
    var items = req.body.list;
    var priceList = {};
    var urlList = {};
    async function collect (arr, list, urls) {
        for (var i=0; i<arr.length; i++){
            let price = await walmart.getPrice(arr[i]);
            let url = await walmart.geturl(arr[i]);

            list[arr[i]] = price;
            list[arr[i] + "url"] = url;
        }
        // const storeNumber = await walmartSN.getSN(zip);
        // list['nearest store'] = storeNumber;
        console.log(list);
        
        res.json(list);
       // res.json({"list" : list, "urls" : urls});
    }
    
    collect(items, priceList)
    .catch((err) => res.json({"error" : "Please Try Again Later"}));
})

module.exports = router;