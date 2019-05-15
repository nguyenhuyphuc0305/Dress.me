const VisualRecognitionV3 = require('ibm-watson/visual-recognition/v3')
const fs = require('fs')
const path = require('path')

var visualRecognition = new VisualRecognitionV3({
    version: '2018-03-19',
    iam_apikey: 'e68Blj_fBF4NB1UZaYZeJI_Ybw27d7Tz1ft55O5BxD7h',
});

var params = {
    images_file: fs.createReadStream(path.join('temp', '41200_2975_f.zip')),
    classifier_ids: 'Clothes_1281949138',
    threshold: 0.6
};

visualRecognition.classify(params)
    .then(result => {
        resultList = JSON.stringify(result, null, 2)
        console.log(resultList.images)
    })
    .catch(err => {
        console.log(err);
    });