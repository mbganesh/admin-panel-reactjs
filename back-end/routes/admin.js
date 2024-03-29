var express = require("express");
var router = express.Router();
var AdminModel = require("../Models/AdminLoginModel");
var mongoose = require("mongoose");
const SubModel = require("../Models/SubjectSelectedModel");
var mySubjectSchema = require("../Models/SubjectSchema");
mongoose.connect("mongodb://localhost/admin_panel");

router.get("/", function (req, res, next) {
  console.log("/");
  // var ip = req.headers['x-forwarded-for'] ||
  //  req.socket.remoteAddress ||
  //  null;
   
  const ip =req.ip
  res.json({ ip: ip });


});

router.post("/admin-login", async (req, res) => {
  console.log("/admin-login");
  let data = req.body;

  let foundAuth = await AdminModel.find({});

  if (foundAuth.length === 0) {
    let LoginModel = await AdminModel.insertMany(data);

    res.json({ message: "Login Success", success: true });
  } else {
    let user = foundAuth[0]["userName"];
    let pass = foundAuth[0]["passWord"];

    if (user === data["userName"] && pass === data["passWord"]) {
      res.json({ message: "Login Success", success: true });
    } else {
      res.json({ message: "Invalid UserName or PassWord", success: false });
    }
  }
});

router.post("/subject_api", async (req, res) => {
  console.log("/subject_api");
  let subDetails = req.body.subDetails;
  let subName = req.body.subName;


  var myBoard = subDetails["board"];
  var myMedium = subDetails["medium"];
  var myClass = subDetails["class"];
  var mySubject = [];

  var obj = {
    myBoard: myBoard,
    myClass: myClass,
    myMedium: myMedium,
    mySubject: mySubject,
  };

  let SubjectModel = await SubModel.find({});

  if (SubjectModel.length === 0) {
    let StoreFirstData = await SubModel.insertMany(obj);
  } else {
    let foundData = await SubModel.find(
      { myBoard: myBoard, myClass: myClass, myMedium: myMedium },
      { _id: 0, __v: 0 }
    );

    if (foundData.length === 0) {
      let StoreSecondData = await SubModel.insertMany(obj);
    }

    if (subName !== "") {
      let updateData = await SubModel.findOneAndUpdate(
        { myBoard: myBoard, myClass: myClass, myMedium: myMedium },
        { $push: { mySubject: subName } },
        { _id: 0, __v: 0 }
      );
    }
  }

  res.json({ message: "subject_api -- Api Works" });
});

router.post("/subject_list_api", async (req, res) => {
  console.log("/subject_list_api");
  let subDetails = req.body.subDetails;

  var myBoard = subDetails["board"];
  var myMedium = subDetails["medium"];
  var myClass = subDetails["class"];

  let foundData = await SubModel.findOne(
    { myBoard: myBoard, myClass: myClass, myMedium: myMedium },
    { _id: 0, __v: 0 }
  );

  res.json(foundData);
});

router.post("/subject_edit_api", async (req, res) => {
  console.log("/subject_edit_api");
  let subDetails = req.body.subDetails;
  let subName = req.body.subName; //

  var myBoard = subDetails["board"];
  var myMedium = subDetails["medium"];
  var myClass = subDetails["class"];

  let updateData = await SubModel.findOneAndUpdate(
    { myBoard: myBoard, myClass: myClass, myMedium: myMedium },
    { $pull: { mySubject: subName } },
    { _id: 0, __v: 0 }
  );
  res.json({ message: subName + " deleted." });
});

router.post("/create_unit_api", async (req, res) => {
  console.log("/create_unit_api");
  var reqData = req.body;

  let className = reqData.className;
  let mediumName = reqData.mediumName;
  let subjectName = reqData.subjectName;
  let boardName = reqData.boardName;

  let collectionName = reqData.collectionName;

  let unitName = reqData.unitName;

  // create schema
  var mySchema = mySubjectSchema;

  // create model
  var myModel =
    mongoose.models[collectionName] || mongoose.model(collectionName, mySchema);

  var checkModel = await myModel.find({});

  try {
    if (checkModel.length === 0) {
      let storeData = await myModel.insertMany({
        className: className,
        mediumName: mediumName,
        subjectName: subjectName,
        boardName: boardName,
        unitNames: unitName,
      });
    } else {
      let updateValue = await myModel.findOneAndUpdate(
        {
          className: className,
          mediumName: mediumName,
          boardName: boardName,
          subjectName: subjectName,
        },
        { $push: { unitNames: unitName } },
        { _id: 0, __v: 0 }
      );
    }

    res.json({ message: "data stored -- try", success: true });
  } catch (error) {
    res.json({ message: "data not stored -- catch", success: false });
  }
});

// Helpers help here**
router.post("/delete_unit_api", async (req, res) => {
  console.log("/delete_unit_api");
  var reqData = req.body;

  let className = reqData.className;
  let mediumName = reqData.mediumName;
  let subjectName = reqData.subjectName;
  let boardName = reqData.boardName;

  let collectionName = reqData.collectionName;

  let unitDetail = reqData.unitName;

  let unitName = unitDetail.unitName;
  let unitNo = unitDetail.unitNo;

  console.log(unitName, unitNo);

  // create schema
  var mySchema = mySubjectSchema;

  // create model
  var myModel =
    mongoose.models[collectionName] || mongoose.model(collectionName, mySchema);
    
    let x = await myModel.find({})

    console.log(x);
    
  try {
    let updateValue = await myModel.findOneAndUpdate({ className:className, "unitNames.unitName": unitName },
    { $pull: { "unitNames.$.sessions" : { device: "mobile" } } }
);

    res.json({ message: "data deleted -- try", success: true });
  } catch (error) {
    console.log(error.message);
    res.json({ message: "data not deleted -- catch", success: false });
  }
});

router.post("/list_unit_api", async (req, res) => {
  console.log("/list_unit_api");
  let reqData = req.body;

  let className = reqData.className;
  let mediumName = reqData.mediumName;
  let subjectName = reqData.subjectName;
  let boardName = reqData.boardName;

  let collectionName = reqData.collectionName;

  // let unitName = reqData.unitName;

  // create schema
  var mySchema = mySubjectSchema;

  // create model
  var myModel =
    mongoose.models[collectionName] || mongoose.model(collectionName, mySchema);

  try {
    var checkModel = await myModel.findOne({}, { _id: 0, __v: 0 });
  } catch (error) {}

  res.json(checkModel);
});

router.post("/list_topic_api", async (req, res) => {
  console.log("/list_topic_api");

  var reqData = req.body;

  let collectionName = reqData.collectionName;
  let unitName = reqData.unitName;

  // create schema
  var mySchema = mySubjectSchema;

  // create model
  var myModel =
    mongoose.models[collectionName] || mongoose.model(collectionName, mySchema);

  let foundData = await myModel.findOne({}, { unitNames: 1, _id: 0 });

  let foundObj = foundData.unitNames.filter(
    (el) => el.unitNo === unitName.unitNo
  );

  res.json({ message: foundObj[0], success: true });
});

router.post("/topic_add_api", async (req, res) => {
  console.log("/topic_add_api");

  var reqData = req.body;

  console.log(reqData.topicDetails);

  let collectionName = reqData.collectionName;
  let unitName = reqData.unitDetail.unitName;
  
  let topicDetails = reqData.topicDetails;

  // create schema
  var mySchema = mySubjectSchema;

  // create model
  var myModel =
    mongoose.models[collectionName] || mongoose.model(collectionName, mySchema);

  try {
    let preFound = await myModel.updateOne(
      { "unitNames.unitName": unitName, "unitNames.$": 1 },
      { $push: { "unitNames.$.unitTopics": topicDetails } }
    );

    console.log(preFound);

    // var found = await myModel.aggregate([
    //   {$unwind:"$unitNames"},
    //   {$unwind:"$unitNames.unitOneMarks"},
    //   {$unwind:"$unitNames.unitOneMarks.question"},
    //   {$match:{"unitNames.unitOneMarks.question":"a+b"}},
    // ])
    
    // console.log(found[0]["unitNames"]["unitOneMarks"]);

  } catch (error) {
    console.log(error.message);
  }

  res.json({ messsge: "topic_add_api - called" });
});

// review needed*
router.post("/topic_edit_api", async (req, res) => {
  console.log("/topic_edit_api");

  var reqData = req.body;

  console.log(reqData);

  let collectionName = reqData.collectionName;
  let unitName = reqData.unitDetail.unitName;
  let topicDetails = reqData.topicDetails;

  // create schema
  var mySchema = mySubjectSchema;

  // create model
  var myModel =
    mongoose.models[collectionName] || mongoose.model(collectionName, mySchema);

  try {
    let preFound = await myModel.updateOne(
      {"unitNames.unitName": unitName,"unitNames.$": 1, },{$pull:{"unitNames.$.unitTopics":topicDetails}}  )
  
    console.log("waiting for helps");
  } catch (error) {
    console.log(error.message);
  }

  res.json({ messsge: "list_topic_Edit_api - called" });
});

router.post("/topic_delete_api", async (req, res) => {
  console.log("/topic_delete_api");

  var reqData = req.body;

  console.log(reqData);

  let collectionName = reqData.collectionName;
  let unitName = reqData.unitDetail.unitName;
  let topicDetails = reqData.topicDetails;

  // create schema
  var mySchema = mySubjectSchema;

  // create model
  var myModel =
    mongoose.models[collectionName] || mongoose.model(collectionName, mySchema);

  try {
    let preFound = await myModel.updateOne(
      { "unitNames.unitName": unitName, "unitNames.$": 1 },
      { $pull: { "unitNames.$.unitTopics": topicDetails } }
    );
  } catch (error) {}

  res.json({ messsge: "list_topic_delete_api - called" });
});

router.post("/list_one_mark_api", async (req, res) => {
  console.log("/list_one_mark_api");

  var reqData = req.body;

  let collectionName = reqData.collectionName;
  let unitName = reqData.unitDetails.unitName;

  // create schema
  var mySchema = mySubjectSchema;

  // create model
  var myModel =
    mongoose.models[collectionName] || mongoose.model(collectionName, mySchema);

  let foundData = await myModel.findOne({}, { unitNames: 1, _id: 0 });

  let foundObj = foundData.unitNames.filter((el) => el.unitName === unitName);

  res.json({ message: foundObj[0].unitOneMarks, success: true });
});

router.post("/list_one_edit_mark_api", async (req, res) => {
  console.log("/list_one_edit_mark_api");

  var reqData = req.body;

  console.log(reqData);

  let collectionName = reqData.collectionName;
  let unitName = reqData.unitDetails.unitName;
  let unitOneMarks = reqData.unitOneMarks;

  // create schema
  var mySchema = mySubjectSchema;

  // create model
  var myModel =
    mongoose.models[collectionName] || mongoose.model(collectionName, mySchema);

  try {
    let preFound = await myModel.updateOne(
      { "unitNames.unitName": unitName, "unitNames.$": 1 },
      { $push: { "unitNames.$.unitOneMarks": unitOneMarks } }
    );
  } catch (error) {}

  res.json({ messsge: "list_topic_edit_api - called" });
});

router.post("/one_mark_delete_api", async (req, res) => {
  console.log("/one_mark_delete_api");

  var reqData = req.body;


  let collectionName = reqData.collectionName;
  let unitName = reqData.unitDetail.unitName;
  let oneMarkDetails = reqData.oneMarkDetails;

  // create schema
  var mySchema = mySubjectSchema;

  // create model
  var myModel =
    mongoose.models[collectionName] || mongoose.model(collectionName, mySchema);

  try {
    let preFound = await myModel.updateOne(
      { "unitNames.unitName": unitName,  "unitNames.$": 1 },
      { $pull: { "unitNames.$.unitOneMarks": oneMarkDetails } }
    );
  } catch (error) {}

  res.json({ messsge: "one_mark_delete_api - called" });
});

router.post("/list_edit_two_mark_api", async (req, res) => {
  console.log("/list_edit_two_mark_api");

  var reqData = req.body;

  console.log(reqData);

  let collectionName = reqData.collectionName;
  let unitName = reqData.unitDetails.unitName;
  let unitTwoMarks = reqData.unitTwoMarks;

  // create schema
  var mySchema = mySubjectSchema;

  // create model
  var myModel =
    mongoose.models[collectionName] || mongoose.model(collectionName, mySchema);

  try {

    let preFound = await myModel.updateOne(
      { "unitNames.unitName": unitName, "unitNames.$": 1 },
      { $push: { "unitNames.$.unitTwoMarks": unitTwoMarks } }
    );
    
console.log("********");
console.log(preFound);
console.log("********");
    
  } catch (error) {
    console.log(error.message)
  }

  res.json({ messsge: "add_one_mark_api - called" });
});

router.post("/list_two_mark_api", async (req, res) => {
  console.log("/list_two_mark_api");

  var reqData = req.body;

  let collectionName = reqData.collectionName;
  let unitName = reqData.unitDetails.unitName;

  // create schema
  var mySchema = mySubjectSchema;

  // create model
  var myModel =
    mongoose.models[collectionName] || mongoose.model(collectionName, mySchema);

  let foundData = await myModel.findOne({}, { unitNames: 1, _id: 0 });

  let foundObj = foundData.unitNames.filter((el) => el.unitName === unitName);


  res.json({ message: foundObj[0].unitTwoMarks, success: true });
});

router.post("/two_mark_delete_api", async (req, res) => {
  console.log("/two_mark_delete_api");
  var reqData = req.body;

  let collectionName = reqData.collectionName;
  let unitName = reqData.unitDetail.unitName;
  let twoMarkDetails = reqData.twoMarkDetails;

  // create schema
  var mySchema = mySubjectSchema;

  // create model
  var myModel =
    mongoose.models[collectionName] || mongoose.model(collectionName, mySchema);

  try {
    let preFound = await myModel.updateOne(
      { "unitNames.unitName": unitName,  "unitNames.$": 1 },
      { $pull: { "unitNames.$.unitTwoMarks": twoMarkDetails } }
    );
  } catch (error) {
    console.log(error.message);
  }

  res.json({ messsge: "two_mark_delete_api - called" });
});

router.post("/drop_subject_api", async (req, res) => {
  console.log("/drop_subject_api");
  var collectionName = req.body.collectionName;

  // create schema
  var mySchema = mySubjectSchema;

  // create model
  var myModel =
    mongoose.models[collectionName] || mongoose.model(collectionName, mySchema);

  let foundData = await myModel.findOne({});

  try {
    if (foundData !== null) {
      var dropedCol = await myModel.collection.drop();
      res.json({ message: "Collection Deleted", success: dropedCol });
    } else {
      res.json({ message: "Collection Not Created.", success: false });
    }
  } catch (error) {
    res.json({ message: "Syster Down", success: false });
  }
});

module.exports = router;

