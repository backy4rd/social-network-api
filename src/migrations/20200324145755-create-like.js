module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('likes', {
      liker: {
        type: Sequelize.STRING(32),
        primaryKey: true,
        references: {
          model: 'users',
          key: 'username',
        },
        onDelete: 'CASCADE',
      },
      post_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {
          model: 'posts',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('likes');
  },
};
