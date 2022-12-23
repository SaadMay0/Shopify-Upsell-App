"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

      await queryInterface.createTable("UpsellProducts", {
        id: {
          type: Sequelize.UUID,
          primaryKey: true,
          allowNull: false,
          autoIncrement: false,
          defaultValue: Sequelize.UUIDV4,
        },

        totalOrders: {
          allowNull: false,
          type: Sequelize.INTEGER,
        },
        totalPevenue: {
          allowNull: false,
          type: Sequelize.FLOAT,
        },
        acceptOffer: {
          allowNull: false,
          type: Sequelize.INTEGER,
        },
        declineOffer: {
          allowNull: false,
          type: Sequelize.INTEGER,
        },
        storeCurrency: {
          allowNull: false,
          type: Sequelize.STRING,
          defaultValue: "$",
        },
        upsellProductsInfo: {
          allowNull: false,
          type: Sequelize.TEXT,
        },
        upsellProducts: {
          allowNull: false,
          type: Sequelize.TEXT,
        },
        storeId: {
          type: Sequelize.STRING,
          allowNull: false,
          onDelete: "CASCADE",
          references: {
            model: "store",
            key: "id",
            as: "storeId",
          },
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
  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('Preferences');
     * await queryInterface.dropTable('ShipmentOrder');
     * await queryInterface.dropTable('CostCenter');
     */

    // await queryInterface.dropAllTables();
    await queryInterface.dropTable("UpsellProducts");

  },
};
