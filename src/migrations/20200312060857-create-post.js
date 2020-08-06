module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('posts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      created_by: {
        type: Sequelize.STRING(32),
        allowNull: false,
        references: {
          model: 'users',
          key: 'username',
        },
        onDelete: 'CASCADE',
      },
      content: {
        type: Sequelize.STRING(1024) + ' CHARSET utf8 COLLATE utf8_unicode_ci',
      },
      status: {
        type: Sequelize.STRING(10),
        defaultValue: 'public',
        allowNull: false,
      },
      like: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Posts');
  },
};
