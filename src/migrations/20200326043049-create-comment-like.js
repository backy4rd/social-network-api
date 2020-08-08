module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('comment_likes', {
      liker: {
        type: Sequelize.STRING(32),
        primaryKey: true,
        references: {
          model: 'users',
          key: 'username',
        },
        onDelete: 'CASCADE',
      },
      comment_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
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
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('comment_likes');
  },
};
