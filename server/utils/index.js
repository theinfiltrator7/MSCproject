const mongoose = require('mongoose');

function structureData(data, structure) {
  let itemData = {};
  for(const item of structure) {
    if(item.key in data){
      if(typeof data[item.key] === item.dataType){
        itemData[item.key] = data[item.key];
      } else if (item.dataType === "objectId") {
        itemData[item.key] = new mongoose.Types.ObjectId(data[item.key])
      }
    }
  }
  return itemData;
}

module.exports = {
  structureData
}