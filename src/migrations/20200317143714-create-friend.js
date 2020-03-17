module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Friends', {
      userA: {
        type: Sequelize.STRING,
        primaryKey: true,
        references: {
          model: 'Users',
          key: 'username',
        },
        onDelete: 'CASCADE',
      },
      userB: {
        type: Sequelize.STRING,
        primaryKey: true,
        references: {
          model: 'Users',
          key: 'username',
        },
        onDelete: 'CASCADE',
      },
      status: {
        type: Sequelize.STRING,
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
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Friends');
  },
};
