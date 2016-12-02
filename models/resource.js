'use strict';
module.exports = function(sequelize, DataTypes) {
  var Resource = sequelize.define('Resource', {
    link: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        Resource.belongsTo(models.Notes, {onDelete: 'cascade'});
      }
    }
  });
  return Resource;
};