module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Likes', {
      liker: {
        type: Sequelize.STRING,
        primaryKey: true,
        references: {
          model: 'Users',
          key: 'username',
        },
        onDelete: 'CASCADE',
      },
      postId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {
          model: 'Posts',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      createdAt: {
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false,
      },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Likes');
  },
};
