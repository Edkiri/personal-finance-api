'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('expense_sources', {
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
        allowNull: true,
      },
    });

    await queryInterface.createTable('expenses', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      account_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'accounts',
          key: 'id',
        },
      },
      amount: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      date: {
        type: Sequelize.DATE,
      },
      description: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      expense_source_id: {
        type: Sequelize.INTEGER,
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

    await queryInterface.addConstraint('expenses', {
      fields: ['account_id'],
      type: 'foreign key',
      references: {
        table: 'accounts',
        field: 'id',
      },
    });

    await queryInterface.addConstraint('expenses', {
      fields: ['user_id'],
      type: 'foreign key',
      references: {
        table: 'users',
        field: 'id',
      },
    });

    await queryInterface.addConstraint('expenses', {
      fields: ['expense_source_id'],
      type: 'foreign key',
      references: {
        table: 'expense_sources',
        field: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('expenses');
    await queryInterface.dropTable('expense_sources');
  },
};
