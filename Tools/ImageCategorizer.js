var VisualRecognitionV3 = require('watson-developer-cloud/visual-recognition/v3');
var fs = require('fs');

var visualRecognition = new VisualRecognitionV3({
    version: '2018-03-19',
    iam_apikey: 'fWrOFZQEeabhmw2JbcOAyjsE2yGWvjTk43a2wYhAPNgU'
});

var url = 'https://firebasestorage.googleapis.com/v0/b/dressme-asian47.appspot.com/o/2a77b75c449be1ac195b5c6561519a7e.jpg?alt=media&token=5417c88a-528f-43d3-8754-951d83fb5f1c';

var params = {
    url: url,
};

visualRecognition.classify(params, function (err, response) {
    if (err) {
        console.log(err);
    } else {
        console.log(JSON.stringify(response, null, 2))
    }
});

// var images_file = fs.createReadStream(path.join('Clothes', '40RR_16_JOSEPH_ABBOUD_HERITAGE_TAN_MAIN.zip'));

// var classifier_ids = ["ClotheRec_625420123"];
// var threshold = 0.6;

// var params = {
//     images_file: images_file,
//     classifier_ids: classifier_ids,
//     threshold: threshold
// };

// console.log(params)

// visualRecognition.classify(params, function (err, response) {
//     if (err) {
//         console.log(err);
//     } else {
//         for (var k in response.images) {
//             for (var i in response.images[k].classifiers[0].classes) {
//                 console.log(response.images[k].classifiers[0].classes[i].class)
//             }
//         }
//     }
// });


function getData(zipPath) {
    var images_file = fs.createReadStream(zipPath)
    var classifier_ids = ["ClotheRec_516722650"];
    var threshold = 0.6;

    var params = {
        images_file: images_file,
        classifier_ids: classifier_ids,
        threshold: threshold
    };

    visualRecognition.classify(params, function (err, response) {
        if (err) {
            console.log(err);
        } else {
            for (var k in response.images) {
                for (var i in response.images[k].classifiers[0].classes) {
                    console.log(response.images[k].classifiers[0].classes[i].class)
                }
            }
        }
    });
}

// getData(path.join('Clothes', '40RR_16_JOSEPH_ABBOUD_HERITAGE_TAN_MAIN.zip'))

// module.exports = { getData }