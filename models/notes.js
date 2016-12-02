'use strict';
module.exports = function(sequelize, DataTypes) {
  var Notes = sequelize.define('Notes', {
    title: DataTypes.STRING,
    pg: DataTypes.INTEGER,
    endPg: DataTypes.INTEGER,
    content: DataTypes.TEXT
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        Notes.belongsTo(models.Book, {onDelete: 'cascade'});
        Notes.hasMany(models.Resource);
      }
    }
  });
  return Notes;
};