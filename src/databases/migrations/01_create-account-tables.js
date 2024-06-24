module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('currencies', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
        unique: true,
      },
      symbol: {
        type: Sequelize.STRING,
        unique: true,
      },
    });

    await queryInterface.createTable('accounts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
        unique: true,
      },
      description: {
        type: Sequelize.STRING,
      },
      amount: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
      bank: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      is_default: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      currency_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'currencies',
          key: 'id',
        },
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id',
        },
      },
    });

    await queryInterface.createTable('user_currencies', {
      currency_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'currencies',
          key: 'id',
        },
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id',
        },
      },
    });

    await queryInterface.addConstraint('user_currencies', {
      fields: ['user_id'],
      type: 'foreign key',
      references: {
        table: 'users',
        field: 'id',
      },
    });

    await queryInterface.addConstraint('user_currencies', {
      fields: ['currency_id'],
      type: 'foreign key',
      references: {
        table: 'currencies',
        field: 'id',
      },
    });

    await queryInterface.addConstraint('accounts', {
      fields: ['user_id'],
      type: 'foreign key',
      references: {
        table: 'users',
        field: 'id',
      },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('accounts');
    await queryInterface.dropTable('currencies');
  },
};
