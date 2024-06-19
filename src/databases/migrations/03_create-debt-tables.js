module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('debts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      description: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      creditor: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      amount: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      total_paid: {
        type: Sequelize.FLOAT,
        defaultValue: 0,
      },
      paid: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      date: {
        type: Sequelize.DATE,
      },
      paid_date: {
        type: Sequelize.DATE,
      },
      currency_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'currencies',
          key: 'id',
        },
      },
      expense_source_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'expense_sources',
          key: 'id',
        },
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id',
        },
      }
    });

    await queryInterface.addConstraint('debts', {
      fields: ['user_id'],
      type: 'foreign key',
      references: {
        table: 'users',
        field: 'id',
      },
    });

    await queryInterface.createTable('debts_expenses', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      amount: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      expense_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'expenses',
          key: 'id',
        },
      },
      debt_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'debts',
          key: 'id',
        },
      },
      date: {
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('debts_expenses');
    await queryInterface.dropTable('debts');
  },
};
