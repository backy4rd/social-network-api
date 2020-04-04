module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Comments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      postId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Posts',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      commenter: {
        type: Sequelize.STRING(32),
        allowNull: false,
        references: {
          model: 'Users',
          key: 'username',
        },
        onDelete: 'CASCADE',
      },
      content: {
        type: Sequelize.STRING(1024) + ' CHARSET utf8 COLLATE utf8_unicode_ci',
        allowNull: false,
      },
      like: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      replyOf: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Comments',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Comments');
  },
};
