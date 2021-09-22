const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const knex = require('knex')({
  client: 'mysql2',
  connection: {
    host : process.env.MYSQL_HOST,
    port : process.env.MYSQL_PORT,
    user : process.env.MYSQL_USER,
    password : process.env.MYSQL_PASSWD,
    database : process.env.MYSQL_DB
  }
});

const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());

const getAllFiles = function(dirPath, arrayOfFiles) {
  let files = fs.readdirSync(dirPath)

  arrayOfFiles = arrayOfFiles || []

  files.forEach(function(file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles)
    } else {
      arrayOfFiles.push(path.join(__dirname, dirPath, "/", file))
    }
  })

  return arrayOfFiles
}

const api = path.join(__dirname, "api")

// Load apis
try {
  getAllFiles(api).forEach(function (file) {
    let f = file.replace(api, "")
    f = f.replace(__dirname, "")
    let js = f.replaceAll("\\\\", "")
    f = f.replaceAll("\\", "/")
    f = f.replace("//", "/")
    f = f.replace(/[^/]*$/.exec(f)[0], "")
    app.use(f, require(`${api}\\${js}`))
  });
} catch(e) {
  console.log(e)
}

const middleware = path.join(__dirname, "middlewares")

// Load middlewares
fs.readdir(middleware, function (err, files) {
  files.forEach(function (file) {
    app.use(require(`${middleware}/${file}`))
  });
});

module.exports = {
  app,
  knex
};
