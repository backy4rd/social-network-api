const { Model } = require('sequelize');

const getUnderscored = str => {
  return str
    .split(/(?=[A-Z])/)
    .join('_')
    .toLowerCase();
};

const toUnderscored = data => {
  if (Array.isArray(data)) {
    return data.map(ele => toUnderscored(ele));
  }

  // if data is Sequelize Instance or object literal
  if (data.constructor === Object || data instanceof Model) {
    const afterUnderscored = {};

    // get plain object if data is Sequelize Instance
    if (data instanceof Model) {
      data = data.get({ plain: true });
    }

    for (key in data) {
      afterUnderscored[getUnderscored(key)] = toUnderscored(data[key]);
    }
    return afterUnderscored;
  }

  return data;
};

module.exports.toUndercored = toUnderscored;
