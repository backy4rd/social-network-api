const url = require('url');

const staticUrl = url.format({
  protocol: process.env.PROTOCOL || 'http',
  hostname: process.env.DOMAIN || 'localhost',
  port: process.env.DOMAIN ? undefined : process.env.PORT,
  pathname: '/static/',
});

module.exports.processPost = posts => {
  const res = posts;
  // convert relative url to absolute url
  if (!Array.isArray(res)) {
    const { photos } = res.dataValues;
    if (photos) {
      for (let i = 0; i < photos.length; i++) {
        const photo = photos[i];

        photo.dataValues.photo = url.resolve(staticUrl, photo.dataValues.photo);
      }
    }
  } else {
    res.forEach(post => {
      const { photos } = post.dataValues;
      if (photos) {
        for (let i = 0; i < photos.length; i++) {
          const photo = photos[i];

          photo.dataValues.photo = url.resolve(
            staticUrl,
            photo.dataValues.photo,
          );
        }
      }
    });
  }

  return res;
};

module.exports.processUser = user => {
  const res = user;
  // convert relative url to absolute url
  if (user.dataValues.avatar) {
    res.dataValues.avatar = url.resolve(staticUrl, user.dataValues.avatar);
  }
  // remove paasowrd from response
  if (user.dataValues.password) {
    delete res.dataValues.password;
  }

  return user;
};
