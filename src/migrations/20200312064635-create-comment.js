module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('comments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      post_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'posts',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      commenter: {
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
        allowNull: false,
      },
      like: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      reply_of: {
        type: Sequelize.INTEGER,
        references: {
          model: 'comments',
          key: 'id',
        },
        onDelete: 'CASCADE',
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
    return queryInterface.dropTable('comments');
  },
};
