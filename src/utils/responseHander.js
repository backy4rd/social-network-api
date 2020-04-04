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

  res.dataValues.avatar = url.resolve(staticUrl, user.dataValues.avatar);
  delete res.dataValues.password;

  return res;
};

module.exports.processFriend = friends => {
  const res = friends;

  res.forEach(friend => {
    const { target } = friend;
    target.dataValues.avatar = url.resolve(staticUrl, target.dataValues.avatar);
    delete target.dataValues.password;
  });

  return res;
};

module.exports.processNotification = notifications => {
  const res = notifications;

  res.forEach(notification => {
    const { User: user } = notification;
    user.dataValues.avatar = url.resolve(staticUrl, user.dataValues.avatar);
  });

  return res;
};

module.exports.processComment = comments => {
  const res = comments;

  res.forEach(comment => {
    const { User: user } = comment;
    user.dataValues.avatar = url.resolve(staticUrl, user.dataValues.avatar);
  });

  return res;
};
