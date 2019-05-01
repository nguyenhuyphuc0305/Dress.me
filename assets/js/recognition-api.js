var VisualRecognitionV3 = require('watson-developer-cloud/visual-recognition/v3');
var fs = require('fs');
var path = require('path')

var visualRecognition = new VisualRecognitionV3({
    version: '2018-03-19',
    iam_apikey: 'j06JLOtq3mr_TTMmaiS17TxAfCQ--g2LIUPdLe2a8r4d',
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

getData(path.join('Clothes', '40RR_16_JOSEPH_ABBOUD_HERITAGE_TAN_MAIN.zip'))

// module.exports = { getData }