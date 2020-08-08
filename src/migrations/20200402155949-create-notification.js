module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('notifications', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      owner: {
        type: Sequelize.STRING(32),
        allowNull: false,
        references: {
          model: 'users',
          key: 'username',
        },
        onDelete: 'CASCADE',
      },
      from: {
        type: Sequelize.STRING(32),
        allowNull: false,
        references: {
          model: 'users',
          key: 'username',
        },
        onDelete: 'CASCADE',
      },
      post_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'posts',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      comment_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'comments',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      action: {
        type: Sequelize.STRING(10),
        allowNull: false,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Notifications');
  },
};

