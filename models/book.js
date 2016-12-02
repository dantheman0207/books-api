'use strict';
module.exports = function(sequelize, DataTypes) {
  var Book = sequelize.define('Book', {
    name: DataTypes.STRING,
    isbn: DataTypes.STRING,
    lastPg: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        Book.belongsTo(models.User, {onDelete: 'cascade'});
        Book.hasMany(models.Notes);
      }
    }
  });
  return Book;
};