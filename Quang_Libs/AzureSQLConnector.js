var colors = require('colors'); //For Fun

var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;

var Clothe = require('./recommendation').Clothe;

// Create connection to database
var config = {
    server: 'dressmeteam.database.windows.net',
    authentication: {
        type: 'default',
        options: {
            userName: 'dressmeteam', // update me
            password: '#teamAsian47' // update me
        }
    },    options: {
        database: 'DressMeDatabase',
        encrypt: true
    }
}

var connection = new Connection(config);

// Attempt to connect and execute queries if connection goes through
connection.on('connect', function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log('Connected');
        queryDatabase()
    }
});

function queryDatabase() {
    console.log('Reading rows from the Table...');

    Insert()
}

function Insert() {
    console.log("Inserting '" + "QUANG" + "' into Table...");
    var request = new Request(
        "INSERT INTO dress_me_schema.customer (lastname, firstname, nickname, gender, country, phone, email) OUTPUT INSERTED.user_id VALUES (@lastname, @firstname, @nickname, @gender, @country, @phone, @email);",
        function (err, rowCount, rows) {
            if (err) {
                console.log(err);
            }
            else {
                console.log(rowCount + ' row(s) inserted');
                // callback(null, 'Nikita', 'United States');
            }
        }
    );
    request.addParameter('lastname', TYPES.NVarChar, "Testing");
    request.addParameter('firstname', TYPES.NVarChar, "Sam");
    request.addParameter('nickname', TYPES.NVarChar, "TS");
    request.addParameter('gender', TYPES.NVarChar, "M");
    request.addParameter('country', TYPES.NVarChar, "USA?");
    request.addParameter('phone', TYPES.NVarChar, "***********");
    request.addParameter('email', TYPES.NVarChar, "****@drexel.edu");


    // Execute SQL statement
    connection.execSql(request);
}

function registerNewUser(lastname, firstname, nickname, gender, country, phone, email) {
    console.log("=========================".rainbow)
    console.log(`Inserting ${firstname} into database...`.yellow)
    var request = new Request(
        "INSERT INTO dress_me_schema.customer (lastname, firstname, prefername, gender, country, phone, email) OUTPUT INSERTED.user_id VALUES (@lastname, @firstname, @prefername, @gender, @country, @phone, @email);",
        function (err, rowCount, rows) {
            if (err) {
                console.log(`${err}`.red)
            }
            else {
                console.log(`${rowCount} row(s) inserted`.green);
                console.log("=========================".rainbow)
            }
        }
    );
    request.addParameter('lastname', TYPES.NVarChar, lastname);
    request.addParameter('firstname', TYPES.NVarChar, firstname);
    request.addParameter('prefername', TYPES.NVarChar, nickname);
    request.addParameter('gender', TYPES.NVarChar, gender);
    request.addParameter('country', TYPES.NVarChar, country);
    request.addParameter('phone', TYPES.NVarChar, phone);
    request.addParameter('email', TYPES.NVarChar, email);

    // Execute SQL statement
    connection.execSql(request);
}

function pushClothesToDatabase(allClothes) {
    return new Promise(function (resolve) {
        console.log("=========================".rainbow)
        console.log(`Inserting ${allClothes.length} clothes into database...`.yellow)
    })
}

function Read() {
    console.log('Reading everything from the User Table...');
    // Read all rows from table
    request = new Request(
        'SELECT * FROM dress_me_schema.customer;',
        function (err, rowCount, rows) {
            if (err) {
                console.log(err);
            } else {
                console.log(rowCount + ' row(s) returned');
            }
        });

    // Print the rows read
    var result = "";
    request.on('row', function (columns) {
        columns.forEach(function (column) {
            if (column.value === null) {
                console.log('NULL');
            } else {
                result += column.value + " ";
            }
        });
        console.log(result);
        result = "";
    });

    // Execute SQL statement
    connection.execSql(request);
}

//Tutorial: https://www.microsoft.com/en-us/sql-server/developer-get-started/node/mac/step/2.html
module.exports = { connection }