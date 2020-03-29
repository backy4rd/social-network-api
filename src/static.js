const express = require('express');
const downloader = require('image-downloader');
const fs = require('fs');
const path = require('path');

const route = express.Router();

const pwd = process.cwd();
const staticFolder = path.join(pwd, 'static');
const postFolder = path.join(pwd, 'static/posts');
const avatarFolder = path.join(pwd, 'static/avatars');
const defaultAvatar = path.join(pwd, 'static/avatars/default.jpg');

if (!fs.existsSync(staticFolder)) {
  fs.mkdirSync(staticFolder);
}

if (!fs.existsSync(avatarFolder)) {
  fs.mkdirSync(avatarFolder);
}

if (!fs.existsSync(postFolder)) {
  fs.mkdirSync(postFolder);
}

if (!fs.existsSync(defaultAvatar)) {
  downloader.image({
    url: 'https://i.imgur.com/0G0O0O0.jpg',
    dest: defaultAvatar,
  });
}

route.use(express.static(path.join(process.cwd(), 'static')));

module.exports = route;
