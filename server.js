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
});

app.put("/api/persons/:id", function(req, res) {
});

app.delete("/api/persons/:id", function(req, res) {
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
  if (!req.body.email) {
    handleError(res, "Invalid Request: Must provide email address in order to register.", 400);
  } else if (!req.body.idtoken) {
    handleError(res, "Invalid Request: Must provide access_token.", 400);
  } else if (!req.body.interests) {
    handleError(res, "Invalid Request: Must provide areas of interests.", 400);
  } else if (!req.body.role) {
    handleError(res, "Invalid Request: Must provide a role to use the platform.", 400);
  } else if (!req.body.university) {
    handleError(res, "Invalid Request: Must provide university name", 400);
  } else if (!req.body.first_name) {
    handleError(res, "Invalid Request: Must provide valid first name.", 400);
  } else if (!req.body.last_name) {
    handleError(res, "Invalid Request: Must provide valid last name.", 400);
  }

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
      handleError(res, "Invalid Token: Must provide a valid access_token.", response.statusCode);
    }
    var body = ''
    response.on('data', function (data) {
      body += data;
    });
  
    response.on('end', function () {
      body = JSON.parse(body);
      userId += body["userid"];
      expiresIn += body["expires_in"];

      console.log(body);

    //   // Creating new user records in the db
    //   db.collection(STUDENTS_COLLECTION).insertOne(newStudent, function(err, doc) {
    //     if (err) {
    //       handleError(res, err.message, "Failed to register new user.");
    //     } else {
    //       res.status(201).json({"success": true});
    //     }
    //   });
      });
  };
  https.request(options, callback).end();
});
