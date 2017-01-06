# instructo
Restructure JavaScript objects for analysis - look withIN the STRUCTure of the Object 

##Example

Given a list of flat objects in which only the keys are known answer the following questions.
Keys = name, age, group 

 Who is in each group?
   leads to question how many groups are there?
   you can get the object return array of unique groups 
   then for each filter and map into a new object.
       
 Who is the same age?
   Same thing we need to know something about the age 
   in order to filter and map

What if we could restructure the object into something useful
where the solution lies in the structure. 

```javascript
  var arrayOfObjects = [
    {
      name: 'Johnny',
      age: 21,
      group: 2
    },
    {
      name: 'Jimmy',
      age: 34,
      group: 1
    },
    {
      name: 'Sally',
      age: 27,
      group: 2
    },
    {
      name: 'Mary',
      age: 44,
      group: 2
    },
    {
      name: 'Billy',
      age: 21,
      group: 1
    }
  ];

  // List all groups with name and age
  var structureA = [
    {
      key: 'group',
      type: 'object'
    },
    {
      key: 'name',
      type: 'object'
    },
    {
      key: 'age',
      type: 'object'
    }
  ];

  // List all ages with name 
  var structureB = [
    {
      key: 'age',
      type: 'object'
    },
    {
      key: 'name',
      type: 'object'
    }
  ];

  var RsA = new instructo(arrayOfObjects)
              .createObject(structureA)
              .results;
  var RsB = new instructo(arrayOfObjects)
              .createObject(structureB)
              .results;
      
// RsA Who is in each group?
  for(var a in RsA){
    console.log("Group:", a, "Has:", Object.keys(RsA[a]));
  }
// Group: 21 Has: Johnny Billy 
// Group: 27 Has: Sally 
// Group: 34 Has: Jimmy 
// Group: 44 Has: Mary

{
  1: {
    Billy : {
      21: {}
    },
    Jimmy: {
      34: {}
    }
  },
  2: {
    Johnny: {
      21: {}
    },
    Mary: {
      44: {}
    },
    Sally: {
      27: {}
    }
  }
}

// RsC Who is the same age?
  var message = '';
  for(var a in RsB){
    if(Object.keys(RsB[a]).length > 1){
    Object.keys(RsB[a]).forEach((c)=>{message += c + ' ';});
    console.log(message, "have the same age of: ", a);
    }
  }
// Johnny Billy  have the same age of:  21

{
  21: {
    Billy: {},
    Johnny: {}
  },
  27: {
    Sally: {}
  },
  34: {
    Jimmy: {}
  },
  44: {
    Mary: {}
  }
}

```
