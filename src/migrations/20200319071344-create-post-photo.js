module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('post_photos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      post_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'posts',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      photo: {
        type: Sequelize.STRING(128),
        unique: true,
      },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('post_photos');
  },
};
