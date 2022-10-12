// const { Model } = require("sequelize");
// module.exports =

"use strict";
import { Model } from "sequelize";
export default (sequelize, DataTypes) => {
  class UpsellProducts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      //    define association here
    }
  }
  UpsellProducts.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        autoIncrement: false,
      },
      upsellProducts: {
        type: DataTypes.TEXT,
        get: function () {
          return JSON.parse(this.getDataValue("upsellProducts"));
        },
        set: function (val) {
          return this.setDataValue("upsellProducts", JSON.stringify(val));
        },
      },
      upsellProductsInfo: {
        type: DataTypes.TEXT,
        get: function () {
          return JSON.parse(this.getDataValue("upsellProductsInfo"));
        },
        set: function (val) {
          return this.setDataValue("upsellProductsInfo", JSON.stringify(val));
        },
      },
      storeId: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
          model: "store",
          key: "id",
        },
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      modelName: "UpsellProducts",
      tableName: "UpsellProducts",
    }
  );
  return UpsellProducts;
};
