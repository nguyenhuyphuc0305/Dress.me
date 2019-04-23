var VisualRecognitionV3 = require('watson-developer-cloud/visual-recognition/v3');
var fs = require('fs');
var path = require('path')

var visualRecognition = new VisualRecognitionV3({
    version: '2018-03-19',
    iam_apikey: 'KKYgRuaUyc15uP2h4DO1S-DHzfFGhJFX0sVz9wBrjcQl',
    url: 'https://gateway.watsonplatform.net/visual-recognition/api'
});


function getData(zipPath) {
    var images_file = fs.createReadStream(zipPath)
    var classifier_ids = ["Clothes_1971082994"];
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
    return 0;
}


module.exports = { getData }