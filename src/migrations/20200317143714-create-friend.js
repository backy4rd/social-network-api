module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('friends', {
      user_a: {
        type: Sequelize.STRING(32),
        primaryKey: true,
        references: {
          model: 'users',
          key: 'username',
        },
        onDelete: 'CASCADE',
      },
      user_b: {
        type: Sequelize.STRING(32),
        primaryKey: true,
        references: {
          model: 'users',
          key: 'username',
        },
        onDelete: 'CASCADE',
      },
      status: {
        type: Sequelize.STRING(10),
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
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('friends');
  },
};
