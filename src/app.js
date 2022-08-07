const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());

const getAllFiles = function(dirPath, directoriesArray) {
  const directories = fs.readdirSync(dirPath);

  directoriesArray = directoriesArray || {};

  let dir = dirPath.replace(path.join(__dirname, "api") + "/", "");
  dir = dir !== path.join(__dirname, "api") ? dir : "index";

  directories.forEach(function(directory) {
    if (directoriesArray[dir] === undefined)
      directoriesArray[dir] = {
        files: [],
        middlewares: [],
      };

    if (!fs.statSync(dirPath + "/" + directory).isDirectory()) {
      if(directory === "__middlewares.js") {
        directoriesArray[dir].middlewares = require(dirPath + "/" + directory);
      }

      if(directory.startsWith("__")) return;

      directoriesArray[dir].files.push(dirPath + "/" + directory);
      return;
    }

    directoriesArray = getAllFiles(dirPath + "/" + directory, directoriesArray);
  });

  return directoriesArray;
}

const api = path.join(__dirname, "api");

// Load apis
try {
  const apis = getAllFiles(api);
  Object.keys(apis).forEach(function(apiPath) {
    const apiObj = apis[apiPath];
    apiObj.files.forEach(function (file) {
      let f = file.replace(api, "");
      f = f.replace(__dirname, "");
      let js = f.replaceAll("\\\\", "");
      f = f.replaceAll("\\", "/");
      f = f.replace("//", "/");
      f = f.replace(/[^/]*$/.exec(f)[0], "");
      const router = require(`${api}/${js}`);

      if(Object.keys(apiObj.middlewares).length > 0)
        router.middlewares = [...apiObj.middlewares];

      // Check for middlewares in the router and add them
      if(router.middlewares) {
        router.middlewares.forEach(middleware => {
          app.use(f, require(`${path.join(__dirname, "middlewares")}/__${middleware}`));
        });
      }

      app.use(f, router);
    });
  });
} catch(e) {
  console.log(e);
}

const middleware = path.join(__dirname, "middlewares")

// Load middlewares
fs.readdir(middleware, function (err, files) {
  files.forEach(function (file) {
    if(file.startsWith("__")) return;

    app.use(require(`${middleware}/${file}`))
  });
});

module.exports = {
  app,
};
