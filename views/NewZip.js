var walmart = require('walmart')(`4x3zqnvkgygsddjj6cdku8y3`);

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

