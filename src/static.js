const express = require('express');
const fs = require('fs');
const path = require('path');

const route = express.Router();

if (!fs.existsSync(path.join(process.cwd(), 'static'))) {
  fs.mkdirSync(path.join(process.cwd(), 'static'));
}

if (!fs.existsSync(path.join(process.cwd(), 'static/avatars'))) {
  fs.mkdirSync(path.join(process.cwd(), 'static/avatars'));
}

if (!fs.existsSync(path.join(process.cwd(), 'static/posts'))) {
  fs.mkdirSync(path.join(process.cwd(), 'static/posts'));
}

route.use(express.static(path.join(process.cwd(), 'static')));

module.exports = route;
