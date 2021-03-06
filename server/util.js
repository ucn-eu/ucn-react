module.exports ={

  binkeys: function(bin, fromts, maxts){
    var keys = [];
    while (fromts < maxts+bin){
      keys.push(Math.floor(fromts/bin)*bin);
      fromts = fromts + bin;
    }
    return keys;
  },

  binned: function(bin, values){
    return values.reduce(function(acc, obj){
        var key = Math.floor(obj.ts/bin)*bin;
        acc[key] =  acc[key] ? acc[key]+1 : 1;
        return acc;
    },{});
  }
}
