module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface
      .createTable('users', {
        username: {
          type: Sequelize.STRING(32),
          allowNull: false,
          primaryKey: true,
        },
        password: {
          type: Sequelize.STRING(80),
          allowNull: false,
        },
        first_name: {
          type: Sequelize.STRING(64) + ' CHARSET utf8 COLLATE utf8_unicode_ci',
          allowNull: false,
        },
        last_name: {
          type: Sequelize.STRING(64) + ' CHARSET utf8 COLLATE utf8_unicode_ci',
          allowNull: false,
        },
        email: {
          type: Sequelize.STRING(64),
          allowNull: false,
        },
        female: {
          type: Sequelize.BOOLEAN,
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
        created_at: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        updated_at: {
          allowNull: false,
          type: Sequelize.DATE,
        },
      })
      .then(() => queryInterface.addIndex('users', ['username']));
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('users');
  },
};
