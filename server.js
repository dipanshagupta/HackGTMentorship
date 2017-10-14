var express = require("express");
var bodyParser = require("body-parser");
var mongodb = require("mongodb");
var https = require("https")
var ObjectID = mongodb.ObjectID;

var STUDENTS_COLLECTION = "persons";

var app = express();
app.use(bodyParser.json());

// Create link to Angular build directory
var distDir = __dirname + "/dist/";
app.use(express.static(distDir));
console.log("Dest Directory", distDir);


// Create a database variable outside of the database connection callback to reuse the connection pool in your app.
var db;

// Connect to the database before starting the application server.
mongodb.MongoClient.connect(process.env.MONGODB_URI, function (err, database) {
  if (err) {
    console.log(err);
    process.exit(1);
  }

  // Save database object from the callback for reuse.
  db = database;
  console.log("Database connection ready");

  // Initialize the app.
  var server = app.listen(process.env.PORT || 8080, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
  });
});



// CONTACTS API ROUTES BELOW

// Generic error handler used by all endpoints.
function handleError(res, reason, message, code) {
  console.log("ERROR: " + reason);
  res.status(code || 500).json({"error": message});
}

/*  "/api/contacts"
 *    GET: finds all contacts
 *    POST: creates a new contact
 */

/*  "/api/contacts/:id"
 *    GET: find contact by id
 *    PUT: update contact by id
 *    DELETE: deletes contact by id
 */

app.get("/api/persons/:id", function(req, res) {
  db.collection(STUDENTS_COLLECTION).findOne({ _id: new ObjectID(req.params.id) }, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to get contact");
    } else {
      res.status(200).json(doc);
    }
  });

});

app.put("/api/persons/:id", function(req, res) {
  var updateDoc = req.body;
  delete updateDoc._id;

    db.collection(STUDENTS_COLLECTION).updateOne({_id: new ObjectID(req.params.id)}, updateDoc, function(err, doc) {
      if (err) {
        handleError(res, err.message, "Failed to update contact");
      } else {
        updateDoc._id = req.params.id;
        res.status(200).json(updateDoc);
      }
    });
});

app.delete("/api/persons/:id", function(req, res) {
  db.collection(STUDENTS_COLLECTION).deleteOne({_id: new ObjectID(req.params.id)}, function(err, result) {
    if (err) {
      handleError(res, err.message, "Failed to delete contact");
    } else {
      res.status(200).json(req.params.id);
    }
  });
});

app.get("/api/persons", function(req, res) {
  db.collection(STUDENTS_COLLECTION).find({}).toArray(function(err, docs) {
    if (err) {
      handleError(res, err.message, "Failed to get persons.");
    } else {
      res.status(200).json(docs);
      //handleError(res, err.message, "Failed to get persons.");
    }
  });
});

app.post("/api/persons", function(req, res) {
  var newPerson = req.body;

  if (!req.body.name) {
    handleError(res, "Invalid user input", "Must provide a name.", 400);
  }

  db.collection(STUDENTS_COLLECTION).insertOne(newPerson, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to create new person.");
    } else {
      res.status(201).json(doc.ops[0]);
    }
  }); 
});

app.post("/api/registration", function(req, res) {
  // Registration fields:
  //  # email 
  //  # access_token
  //  # first_name
  //  # last_name
  //  # interests 
  //  # role 
  //  # university 
  //  # twitter [optional]
  //  # linkedin [optional]
  
  // Input validation
  console.log(req.body);


  if (!req.body.email) {
    handleError(res, "Invalid Request", "Must provide email address in order to register.", 400);
  } else if (!req.body.idtoken) {
    handleError(res, "Invalid Request","Must provide access_token.", 400);
  } else if (!req.body.interests) {
    handleError(res, "Invalid Request", "Must provide areas of interests.", 400);
  } else if (!req.body.role) {
    handleError(res, "Invalid Request", "Must provide a role to use the platform.", 400);
  } else if (!req.body.university) {
    handleError(res, "Invalid Request","Must provide university name", 400);
  } else if (!req.body.first_name) {
    handleError(res, "Invalid Request","Must provide valid first name.", 400);
  } else if (!req.body.last_name) {
    handleError(res, "Invalid Request", "Must provide valid last name.", 400);
  } else if (!req.body.userid) {
    handleError(res, "Invalid Request", "Must provide valid user id", 400);
  }
  console.log("All required parameters are checked.");

  // Validating access_token
  var userId = "";
  var expiresIn = "";
  var options = {
    host: "www.googleapis.com",
    path: "/oauth2/v3/tokeninfo?id_token=" + req.body.idtoken,
    method: "GET"
  };

  callback = function(response) {
    if (response.statusCode >= 400) {
      handleError(res, "Invalid Token","Must provide a valid access_token.", response.statusCode);
    }
    var body = ''
    response.on('data', function (data) {
      body += data;
    });
  
    response.on('end', function () {
      body = JSON.parse(body);
      console.log("Google Token Validation: Success");
      if (body["email_verified"] == 'true') {
        console.log("Should exit with status code 200");
        var newPerson = req.body;
        db.collection(STUDENTS_COLLECTION).insertOne(newPerson, function(err, doc) {
          if (err) {
            handleError(res, err.message, "Failed to create new person.");
          } else {
            console.log("Created new person")
            res.status(200).json({"success": true});
          }
        });
      }else {
        console.log("Should exit with status code 400");
        res.status(400).json({"success": false, "error": "Email verification failed."});
      }
      });
  };
  https.request(options, callback).end();
});
