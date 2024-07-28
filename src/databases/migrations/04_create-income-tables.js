module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('income_sources', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
    });

    await queryInterface.createTable('incomes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      account_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'accounts',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      currency_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'currencies',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      amount: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      description: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      income_source_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'income_sources',
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

    await queryInterface.addConstraint('incomes', {
      fields: ['user_id'],
      type: 'foreign key',
      references: {
        table: 'users',
        field: 'id',
      },
    });

    await queryInterface.addConstraint('incomes', {
      fields: ['currency_id'],
      type: 'foreign key',
      references: {
        table: 'currencies',
        field: 'id',
      },
    });

    await queryInterface.addConstraint('incomes', {
      fields: ['account_id'],
      type: 'foreign key',
      references: {
        table: 'accounts',
        field: 'id',
      },
    });

    await queryInterface.addConstraint('income_sources', {
      fields: ['user_id'],
      type: 'foreign key',
      references: {
        table: 'users',
        field: 'id',
      },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('incomes');
    await queryInterface.dropTable('income_sources');
  },
};
