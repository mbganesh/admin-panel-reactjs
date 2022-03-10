var mongoose = require("mongoose");

var mySchema = new mongoose.Schema({
  unitNames: [
    {
      unitNo: String,
      unitTopics: [
        {
          topicName: String,
          topicUrl: String,
          topicId: String,
        },
      ],
      unitName: String,
      unitTwoMarks: [
        {
          question: String,
          answer: String,
          twoMarkId: String,
        },
      ],
      unitOneMarks: [
        {
          oneMarkId: String,
          question: String,
          option1: String,
          option2: String,
          option3: String,
          option4: String,
          answer: String,
        },
      ],
      unitId: String,
    },
  ],

  className: String,
  mediumName: String,
  subjectName: String,
  boardName: String,
});

module.exports = mySchema;

/**
 * 
 
var mongoose = require('mongoose')

var mySchema = new mongoose.Schema({
    unitNames:  Array,
    className: String,  
    mediumName: String,
    subjectName: String,
    boardName: String,
  });
  

module.exports = mySchema
 */
