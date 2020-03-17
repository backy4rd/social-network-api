// multiple require will not change session
const session = {};
const expireQueue = {};

module.exports = (field, { expire } = {}) => {
  if (!session[field]) {
    session[field] = {};
  }
  return (req, res, next) => {
    req.session = {
      get: key => {
        return session[field][key];
      },
      append: (key, value) => {
        session[field][key] = value;
        if (!expire) return;

        if (expireQueue[key]) {
          clearTimeout(expireQueue[key]);
        }

        expireQueue[key] = setTimeout(() => {
          delete session[field][key];
          delete expireQueue[key];
        }, expire);
      },
      remove: key => {
        delete session[field][key];
        delete expireQueue[key];
      },
    };

    next();
  };
};
