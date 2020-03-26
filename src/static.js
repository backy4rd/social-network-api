const express = require('express');
const downloader = require('image-downloader');
const fs = require('fs');
const path = require('path');

const route = express.Router();

const pwd = process.cwd();

if (!fs.existsSync(path.join(pwd, 'static'))) {
  fs.mkdirSync(path.join(pwd, 'static'));
}

if (!fs.existsSync(path.join(pwd, 'static/avatars'))) {
  fs.mkdirSync(path.join(pwd, 'static/avatars'));
}

if (!fs.existsSync(path.join(pwd, 'static/posts'))) {
  fs.mkdirSync(path.join(pwd, 'static/posts'));
}

if (!fs.existsSync(path.join(pwd, 'static/avatars/default.jpg'))) {
  downloader.image({
    url: 'https://i.imgur.com/0G0O0O0.jpg',
    dest: path.join(pwd, 'static/avatars/default.jpg'),
  });
}

route.use(express.static(path.join(process.cwd(), 'static')));

module.exports = route;
