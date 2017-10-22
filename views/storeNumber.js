var walmart = require('walmart')(`4x3zqnvkgygsddjj6cdku8y3`);

//Search for the closest Walmart based on Zipcode (location)
exports.getSN = (zip) =>{
        return walmart.stores.byZip(zip).then(function(store) {
                var sNumber = store[0].no;
                //Store Number is below
                console.log("Store Number is:" + sNumber);
                return sNumber;
                });
    }