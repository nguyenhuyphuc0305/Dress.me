var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;

// Create connection to database
var config = {
    server: 'dressmeteam.database.windows.net',
    authentication: {
        type: 'default',
        options: {
            userName: 'dressmeteam', // update me
            password: '#teamAsian47' // update me
        }
    },
    options: {
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

    var newUser = {
        lastname: 'Luong',
        firstname: 'Quang',
        prefername: 'Q',
        gender: 'M',
        country: 'VN',
        phone: '2673662795',
        email: 'qdl24@drexel.edu'
    }

    Read()
}

function Insert() {
    console.log("Inserting '" + "QUANG" + "' into Table...");
    var request = new Request(
        "INSERT INTO dress_me_schema.customer (lastname, firstname, prefername, gender, country, phone, email) OUTPUT INSERTED.user_id VALUES (@lastname, @firstname, @prefername, @gender, @country, @phone, @email);",
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
    request.addParameter('lastname', TYPES.NVarChar, "Luong");
    request.addParameter('firstname', TYPES.NVarChar, "Quang");
    request.addParameter('prefername', TYPES.NVarChar, "Q");
    request.addParameter('gender', TYPES.NVarChar, "M");
    request.addParameter('country', TYPES.NVarChar, "VN");
    request.addParameter('phone', TYPES.NVarChar, "2673662795");
    request.addParameter('email', TYPES.NVarChar, "qdl24@drexel.edu");


    // Execute SQL statement
    connection.execSql(request);
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