  var instructo = function(array) {
    this.array = array || [];
    this.results = {};
    this.keys = [];
    this.depth = 0;    
    this.filtered = [];
    return this;
  };

  instructo.prototype.createObject = function(keys){
    var result = {};
    this.keys = keys;
    this.depth = this.keys.map((x, idx)=>{ if(x.type === 'array'){return idx}}).filter((c)=>{return c!==undefined})[0];
    this.results = result;
    var ins = this.results;

    function doThis(arr){
      return new Promise((rr,rj)=>{
      rr(
        arr.forEach((item) => {
        result = ins;
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
    )
    })
    }
    
    if(this.array.length > 100){
      var div = Math.round(this.array.length / 20);
      var segments = new Array(div);
 	    var inc = Math.round(this.array.length/div);
      for(var i=0;i<div;i++){
        segments[i] = doThis(this.array.slice((i*inc),(inc+inc*i) > this.array.length ? this.array.length : inc+inc*i));
      } 
      Promise.all(segments);
    } else {
      doThis(this.array)
    }

    
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
  instructo.prototype.getUniqueNames = function(arr, keys){
    var key;
    var results = {}; 

    if(typeof(keys) === 'object' && keys.length > 1){
      arr.forEach((item) => {
        keys.forEach((key)=>{
          try{
            results[key].indexOf(item[key])
          }catch(e){
            results[key] = []; 
          }
          if(results[key].indexOf(item[key]) >= 0){ }
          else {
             results[key].push(item[key]);
          }
        
        })       
      })
      return results;
    } else {
      key = keys;
      return arr.map(function(obj){
        return obj[key];
      }).filter(this.onlyUnique);
    }

    
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
    var len = arr.length;
    var t;
    for(var i = 0; i < len; i++){
        for(x in arr[i]){
          t = x;
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
      var stack = new Array(Object.keys(top).length);
      var idx = 0;
      while(count < this.depth){
        for(var x in top){
          stack[idx] = top[x];
          idx +=1;
        }
        top = this.flattenO(stack);
        stack = new Array(Object.keys(top).length);
        idx = 0;        
        count++;
      }
     return top;         
    }

    ///////////////////////////////
    // Gets unique counts of occurences 
    // of name within returned obj
    /////////////////////////////////
    instructo.prototype.getOccurences = function(name, filter, condition, exact) {
      this.filterAndChrono(filter, condition, exact, name);      
      var results = this.depth >= 1 ? this.filtered.dive() : this.filtered.results;
      return this.getCounts(results, this.filtered.array.map((x)=>{ return x[name]; }).filter(this.onlyUnique));
    }

    instructo.prototype.validateFilter = function(filterC){
      return filterC.filter((x)=>{if(x.value !== '' && x.value !== undefined){return true}; return false;})
    }

    instructo.prototype.exclude = function(arr, value) {
      return arr.filter((c)=>{return c !== value});
    }

    instructo.prototype.group = function(con) {
      return this.array.map((x)=>{
        return this.array.filter((c)=>{
          return (c[con.value] === x[con.value] && c[con.key] === x[con.key]);
        })
      })
    }

    instructo.prototype.filterAndChrono = function(filter, condition, exact, name) {
      var t = [];
      var count = 0;
      var array = this.array;
      var tally;
      var results = [];
      var filterValues = this.validateFilter(filter);
      if(filter !== undefined){
        if(filterValues.length !== 0) {          
          t = array.filter((x)=> {
                count=0;          
                results = filterValues.map((c)=>{
                  if(c.value !== ''){
                      count+=1;
                      if(x[c.key] === c.value){
                        return true;
                      } else {
                        return false;
                      }
                    }
                    return false;                  
                  });
                tally = this.getCounts({ r: results}, results.map((x)=>{return x}));

                if(exact){
                  return tally.false === 0;
                } else {
                  return  tally.true === count;     
                }              
            });
        }
          
       if(condition && condition.has !== ''){
          var y = new instructo().setArray(t).createObject(this.keys);
          var groupedItems = y.group(condition);
          var top = new Array(groupedItems.length);
          var idx = 0;
          var groupedSingle = [];
          var newest = undefined;
          for(var item in groupedItems){
            groupedItems[item].forEach((x)=>{
              newest = newest === undefined 
                    ? x[condition.chrono] 
                    : (x[condition.chrono] >= newest) ?
                    x[condition.chrono] : newest;
            });
            groupedSingle = groupedItems[item].filter((c)=>{
              return (c[condition.chrono] === newest && c[condition.value] === condition.has);
            })[0];
            if(groupedSingle !== undefined){
              top[idx] = groupedSingle;
              idx += 1;
            }            
          }
          this.filtered = new instructo(top).createObject(this.keys);
        } else {
          this.filtered = t.length === 0 ? this : new instructo(t).createObject(this.keys);
        }       
      } else {
        this.filtered = this;
      }
    }
    
    