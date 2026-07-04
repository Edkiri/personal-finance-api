'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.renameColumn('expense_sources', 'name', 'concept');
    await queryInterface.renameColumn(
      'expense_sources',
      'description',
      'alias',
    );
  },

  async down(queryInterface) {
    await queryInterface.renameColumn('expense_sources', 'concept', 'name');
    await queryInterface.renameColumn(
      'expense_sources',
      'alias',
      'description',
    );
  },
};
