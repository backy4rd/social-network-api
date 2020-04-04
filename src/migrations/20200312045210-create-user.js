module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface
      .createTable('Users', {
        username: {
          type: Sequelize.STRING(32),
          allowNull: false,
          primaryKey: true,
        },
        password: {
          type: Sequelize.STRING(80),
          allowNull: false,
        },
        fullName: {
          type: Sequelize.STRING(64) + ' CHARSET utf8 COLLATE utf8_unicode_ci',
          allowNull: false,
        },
        email: {
          type: Sequelize.STRING(64),
          allowNull: false,
        },
        female: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
        },
        avatar: {
          type: Sequelize.STRING(128),
          defaultValue: 'avatars/default.jpg',
          allowNull: false,
        },
        verified: {
          type: Sequelize.BOOLEAN,
          defaultValue: false,
          allowNull: false,
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
      })
      .then(() => queryInterface.addIndex('Users', ['username']));
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Users');
  },
};
