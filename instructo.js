  var instructo = function(array) {
    this.array = array || [];
    this.results = {};
    this.keys = [];
    this.depth = 0;    
    return this;
  };

  instructo.prototype.createObject = function(keys){
    var result = {};
    this.keys = keys;
    this.depth = this.keys.map((x, idx)=>{ if(x.type === 'array'){return idx}}).filter((c)=>{return c!==undefined})[0];
    this.results = result;
    this.array.forEach((item) => {
      result = this.results;
      keys.forEach((field) => {
        if(field.type === 'object'){
          if(!result.hasOwnProperty(item[field.key])){
            result[item[field.key]] = {};
          }
        }          
        else if(field.type === 'array'){
          if(!result.hasOwnProperty(item[field.key])){
            result[item[field.key]] = [];
          }
        }
        else if(field.type === 'item'){
          if(result.indexOf(item[field.key]) < 0 ){
            result.push(item[field.key])
          }
        }
        result = result[item[field.key]];
      })
    })
    return this;
  }

  /////////////////////////////////
  // Unique helper function
  /////////////////////////////////
  instructo.prototype.onlyUnique = function(value, index, self) { 
    if(value != '' && value != undefined){
      return self.indexOf(value) === index;
    }
  }

  /////////////////////////////////
  // Gets unique names from array 
  // of objects
  /////////////////////////////////
  instructo.prototype.getUniqueNames = function(arr, key){
    return arr.map(function(obj){
      return obj[key];
    }).filter(this.onlyUnique);
  }

  ////////////////////////////////
  // Sets new internal array
  ////////////////////////////////
  instructo.prototype.setArray = function(arr) {
    this.array = arr;
    this.results = {};
    this.depth = 0;
    return this;
  };

  ////////////////////////////////
  // Flattens n-dim array
  ////////////////////////////////
  instructo.prototype.flatten = function(arr) {
    return arr.reduce((flat, toFlatten) => {
      return flat.concat(Array.isArray(toFlatten) ? this.flatten(toFlatten) : toFlatten);
    }, []);
  }
  
  ////////////////////////////////
  // Flattens n-dim array
  ////////////////////////////////
  instructo.prototype.flattenO = function(arr) {
    var obj = {};
    for(var i = 0; i < arr.length; i++){
        for(x in arr[i]){
          var t = x;
          while(obj.hasOwnProperty(t)){
            t += '_';
          }
            obj[t] = arr[i][x];   
        }
    }
    return obj;
  }

  /////////////////////////////////
  //  Given object in format of 
  //  x : {
  //    y: []
  //  }
  //  and array of values to check
  //  ['val1', 'val2']
  //  Returns counts of each value 
  //  found.
  /////////////////////////////////
  instructo.prototype.getCounts = function (obj, arr) {
    var results = {}
    arr.map(function(item){
      results[item] = 0;
    })

    arr.map(function(term){
      Object.keys(obj).forEach(function(key){
        try{
          if(obj[key].indexOf(term) >= 0){
            results[term] += 1;
          }
        } catch(e){
        if(obj[key].hasOwnProperty(term)){
            results[term] += 1;
          } 
        }
      
      })
    })
    return results;
  } 

    ///////////////////////////////
    // Helper for tranversing
    // nested object takes in nested object
    ///////////////////////////////
    instructo.prototype.dive = function(obj = this.results) {
      var top = obj;
      var count = 0;
      var stack = [];

      while(count < this.depth){
        for(var x in top){
          stack.push(top[x])
        }
        top = this.flattenO(stack);
        stack = [];
        count++;
      }
     return top;         
    }

    ///////////////////////////////
    // Gets unique counts of occurences 
    // of name within returned obj
    /////////////////////////////////
    instructo.prototype.getOccurences = function(name) {
      var results = this.depth >= 1 ? this.dive() : this.results;
      return this.getCounts(results, this.array.map((x)=>{ return x[name]; }).filter(this.onlyUnique));
    }

module.exports = instructo;