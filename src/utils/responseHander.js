const url = require('url');

const staticUrl = url.format({
  protocol: process.env.PROTOCOL || 'http',
  hostname: process.env.DOMAIN || 'localhost',
  port: process.env.DOMAIN ? undefined : process.env.PORT,
  pathname: '/static/',
});

module.exports.processPost = posts => {
  if (!Array.isArray(posts)) {
    const { photos } = posts.dataValues;
    if (photos) {
      photos.forEach(photo => {
        photo.dataValues.photo = staticUrl + photo.dataValues.photo;
      });
    }
  } else {
    posts.forEach(post => {
      const { photos } = post.dataValues;
      if (photos) {
        photos.forEach(photo => {
          photo.dataValues.photo = staticUrl + photo.dataValues.photo;
        });
      }
    });
  }
  return posts;
};

module.exports.processUser = user => {
  if (user.dataValues.avatar) {
    user.dataValues.avatar = staticUrl + user.dataValues.avatar;
  }
  if (user.dataValues.password) {
    delete user.dataValues.password;
  }

  return user;
};
