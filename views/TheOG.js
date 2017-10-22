var walmart = require('walmart')(`4x3zqnvkgygsddjj6cdku8y3`);

exports.getPrice= (word)=>{
     return walmart.stores.search(749, word).then(function(item) {
          var priceAvg = 0;
          var count = 0;
          var sum = 0;
          
          for (var i = 0; i < item.results.length; i++){
                  var price = item.results[i].price.priceInCents;
                  if(typeof price == 'number'){
                       sum += price
                       count += 1;
                  }
          }
          priceAvg = ((sum / count)/100.0).toFixed(2);
          
          console.log(priceAvg);
          return priceAvg;
  });
  
}
exports.geturl= (word)=>{
     return walmart.stores.search(749, word).then(function(item) {
        var ID = item.results[0].productId.WWWItemId;
        console.log(ID);
        walmart.getItem(ID).then(function(objectPic) {
        var sPic = objectPic.thumbnailImage;
        //https: image link below
        console.log(sPic);
        return sPic;
    })
  });
}

