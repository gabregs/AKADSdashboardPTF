const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const sequelize = require('sequelize');
const thenrequest = require('then-request');
const path = require('path');
const async = require('async');
const jwt = require('jsonwebtoken');
const config = require('./config');

const zoomtokenep = "https://zoom.us/oauth/token";
  const myappredirect = "https://myapp.io/zoomcallback";
  
  var auth = "Basic " + new Buffer.from('Uc4DAN7FQGOhjV0LsD1oeg' + ':' + 'Y4PVGjQnCzBm4510l11VyU7B2Xr19uGL', 'base64');
//   var url = zoomtokenep + '?grant_type=authorization_code&code=' + req.query.code + '&redirect_uri=' + myappredirect;
    console.log(auth);
  var https = require("https");

  const Toptions = {
    "method": "POST",
    "hostname": "zoom.us",
    "port": null,
    "path": "/oauth/authorize?response_type=code&client_id=Uc4DAN7FQGOhjV0LsD1oeg&redirect_uri=" + myappredirect,
    "headers": {
      "content-type": "application/json",
      "Authorization": "Basic "
    }
  };

  var request = https.request(Toptions, function (res) {
    var chunks2 = [];

    res.on("data", function (chunk) {
      chunks2.push(chunk);
    });

    res.on("end", function () {
      var body = Buffer.concat(chunks2);
      console.log(body.toString());

    });

    req.end();
});

