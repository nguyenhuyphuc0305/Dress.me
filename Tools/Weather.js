//Get weather from openweathermap api
var request = require('request');

String.prototype.format = function () {
    a = this;
    for (k in arguments) {
        a = a.replace("{" + k + "}", arguments[k])
    }
    return a
}

//Get temperature based on zipcode
function getWeatherForZip(zipcode, system) {
    return new Promise(resolve => {
        request('http://api.openweathermap.org/data/2.5/weather?zip={0},us&units={1}&appid=80ef16fc9f3adf6a5da8690573d81412'.format(zipcode, system), { json: true }, (err, response, body) => {
            if (err != undefined) {
                console.log("Error: " + err)
                return
            }
            resolve(response.body.main.temp)
        })
    })
}

module.exports = { getWeatherForZip }

// async function mainProgram() {
//     var result = await getWeatherForZip('19104', 'imperial')
//     console.log(result)
// }

// mainProgram()