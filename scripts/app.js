var Newman = require("newman");
var JSON5 = require("json5");
var fs = require('fs');

//function method1(event, context, cb) {
function method1(event, context, cb) {
  console.log("endpoint = " + event.endpoint);
  // read the collectionjson file
  var collectionJson = JSON5.parse(fs.readFileSync("postman/collection.json", 'utf8'));

  var postmanEnv = fs.readFileSync("postman/environment.json", "utf-8");
  console.log(postmanEnv);

  var env = JSON5.parse(postmanEnv);
  console.log(env);

  var updatedPostmanEnv = "";

  for(var i=0; i<env.values.length; i++) {
    if (env.values[i].key == "host") {
      updatedPostmanEnv = postmanEnv.replace(env.values[i].value, event.endpoint);
      break;
    } else {
      console.log("no match");
    }
  }


  console.log("updated: " + updatedPostmanEnv);

  // define Newman options
  newmanOptions = {
      envJson: JSON5.parse(updatedPostmanEnv), // environment file (in parsed json format)
      iterationCount: 1,                    // define the number of times the runner should run
      stopOnError: true,
      asLibrary: true,
      exitCode: true
  }

  // Optional Callback function which will be executed once Newman is done executing all its tasks.
  Newman.execute(collectionJson, newmanOptions, (s) => {
    console.log("exit status: " + s);

    var jsonObj = {};
    if (s === 0) {
      jsonObj.statusCode = 0;
      //cb(null, jsonObj);
    } else {
      jsonObj.statusCode = 1;
      //cb(s, jsonObj);
    }

    console.log("result: " + JSON5.stringify(jsonObj));
  });

  //newman 3.x
  /*Newman.run({
    //options: newmanOptions,
    collection: collectionJson,
    environment: updatedPostmanEnv,
    reporters: 'cli'
  }, function(err) {
    if (err) { throw err; }
    console.log('collection run complete');
  });*/
}

var event = {};
event.endpoint = "http://foo.bar.biz";

method1(event, null, null);
