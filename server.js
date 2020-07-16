let express = require("express");
let mongojs = require("mongojs");
var test_path = require("path");
var ObjectId = require("mongodb").ObjectID;

let app = express();
let wrkoutdb = mongojs("Workout", ["Workout"]);
let router = express.Router();

app.get("/index", function (req, res) {
  res.sendFile(test_path.join(__dirname + "/public/index.html"));
});

app.get("/index.js", function (req, res) {
  res.sendFile(test_path.join(__dirname + "/public/index.js"));
});

app.get("/api.js", function (req, res) {
  res.sendFile(test_path.join(__dirname + "/public/api.js"));
});
app.get("/exercise.js", function (req, res) {
  res.sendFile(test_path.join(__dirname + "/public/exercise.js"));
});
app.get("/stats.js", function (req, res) {
  res.sendFile(test_path.join(__dirname + "/public/stats.js"));
});
app.get("/workout.js", function (req, res) {
  res.sendFile(test_path.join(__dirname + "/public/workout.js"));
});
app.get("/style.css", function (req, res) {
  res.sendFile(test_path.join(__dirname + "/public/style.css"));
});
app.get("/workout-style.css", function (req, res) {
  res.sendFile(test_path.join(__dirname + "/public/workout-style.css"));
});
app.get("/stats", function (req, res) {
  res.sendFile(test_path.join(__dirname + "/public/stats.html"));
});
app.get("/exercise", function (req, res) {
  res.sendFile(test_path.join(__dirname + "/public/exercise.html"));
});
app.get("/", function (req, res) {
  res.sendFile(test_path.join(__dirname + "/public/index.html"));
});

//API
app.get("/api/workouts", function (req, res) {
  wrkoutdb.Workout.find(function (err, data) {
    if (err) return err;
    else res.json(data);
  });
});

app.post("/api/workouts", function (req, res) {
  var body = "";
  req.on("data", function (data) {
    body += data;
  });
  req.on("end", function () {
    var dataToInsert;
    if (body == {} || body == "" || body == undefined || body == null) {
      dataToInsert = {};
    } else {
      dataToInsert = JSON.parse(body);
    }
    wrkoutdb.Workout.insert(dataToInsert, function (error, datar) {
      if (error) return error;
      else {
        return res.json(datar);
      }
    });
  });
  // wrkoutdb.Workout.find
});

app.get("/api/workouts/range", function (req, res) {
  wrkoutdb.Workout.find(function (err, data) {
    if (err) return err;
    else {
      return res.json(data);
    }
  });
});

app.put("/api/workouts/:id", function (req, res) {
  var body = "";
  req.on("data", function (data) {
    body += data;
  });
  req.on("end", function () {
    wrkoutdb.Workout.find({ _id: ObjectId(req.params.id) }, function (
      err,
      data
    ) {
      if (err) return err;
      else {
        if (data[0].exercises !== undefined && data[0].exercises.length > 0) {
          data[0].exercises.push(JSON.parse(body));
        } else {
          data[0].exercises = [];
          data[0].exercises.push(JSON.parse(body));
        }

        if (data[0].day === undefined || data[0].day === null) {
          data[0].day = new Date().getTime();
        }
        wrkoutdb.Workout.update(
          { _id: ObjectId(req.params.id) },
          { $set: { exercises: data[0].exercises, day: data[0].day } },
          function (error, doc) {
            if (err) return err;
            else res.json("exercise added");
          }
        );
      }
    });
  });
});

app.listen(2000);

console.log("App running on port 2000. Open http://localhost:2000 in browser");
