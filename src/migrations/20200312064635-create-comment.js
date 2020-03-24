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
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'username',
        },
        onDelete: 'CASCADE',
      },
      content: { type: Sequelize.STRING, allowNull: false },
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
