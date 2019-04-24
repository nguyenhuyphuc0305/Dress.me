const fs = require('fs')
const uuidv4 = require('uuid/v4');
var Request = require('tedious').Request;
// var connection = require('../Quang_Libs/AzureSQLConnector').connection

class Customer {
    constructor(lastname = "", firstname = "", nickname = "", gender = "", country = "", phone = "", email = "") {
        //The idea is create a new uid only if it is a new user
        fs.readFile('.uid', (err, data) => {
            if (err) {
                console.log(`${err}`.red)
                this.uid = uuidv4()
                console.log("Creating a new uid...".yellow)

                //Write uid locally so we can load data on every launch
                fs.writeFile('.uid', this.uid, (err) => {
                    if (err) { console.log(`${err}`.red) }
                })
            }
            else {
                console.log(data.toString());
                if (data.toString() && data.toString() != "undefined") {
                    this.uid = data.toString()
                    console.log("Uid has already been created. Loading info...".yellow)
                }
                else {
                    this.uid = uuidv4()
                    console.log("Creating a new uid...".yellow)

                    //Write uid locally so we can load data on every launch
                    fs.writeFile('.uid', this.uid, (err) => {
                        if (err) { console.log(`${err}`.red) }
                    })
                }

            }
        })
        this.lastname = lastname
        this.firstname = firstname
        this.nickname = nickname
        this.gender = gender
        this.country = country
        this.phone = phone
        this.email = email
    }

    greet() {
        return `${this.uid} says hello.`.green;
    }

    loadInfoFromDatabase() {
        console.log("=========================".rainbow)

        fs.readFile('.uid', (err, data) => {
            if (err) { console.log(`${err}`.red) }
            else {
                console.log(data.toString());
                console.log(`Loading info of user with uid: ${data.toString()}...`.rainbow)
            }
        })
    }
}

var newUser = new Customer()
