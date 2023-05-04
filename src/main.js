import { DataManager } from "./DataManager.js";
import { DatabaseDateObject } from "./DBDateObject.js";
import { Generator } from "./Generator.js";
import * as dotenv from 'dotenv'
dotenv.config()
import pkg from "prompts";
const { prompt } = pkg;
var datamanager = new DataManager(
  process.env.SCHOOL,
  process.env.USERNAME,
  process.env.PASSWORD,
  process.env.WEBUNTISURL,
  process.env.DB_PATH
);

async function actionSelector() {
  var question = {
    type: "select",
    name: "value",
    message: `What do you want to do?`,
    choices: [
      { title: "Input Work", value: 0 },
      { title: "Generate Report", value: 1 },
      { title: "Inspect Notes", value: 2 },
      { title: "Remove Notes", value: 3 },
    ],
  };
  var response = await prompt(question);
  switch (response["value"]) {
    case 0:
      var date = await inputDate();
      var notes = await inputWork();
      await datamanager.editNotesForDay(date, notes.join("\n"));
      break;
    case 1:
      var date = await inputDate();
      var gen = new Generator(date, datamanager);
      gen.askForReport(date);
      break;
    case 2:
      var date = await inputDate();
      await inspectNotes(date);
      break;
    case 3:
      var date = await inputDate();
      var newnotes = await editNotesForDay(date);
      await datamanager.removeNotesForDay(date)
      datamanager.editNotesForDay(date, newnotes.join("\n"))
      break;
    default:
      break;
  }
}

async function inputDate() {
  var question = {
    type: "date",
    name: "date",
    message: `Enter the day you want to take notes for:`,
    mask: "DD-MM-YYYY",
  };
  var response = await prompt(question);
  return DatabaseDateObject.fromDateObject(response["date"]);
}
async function inspectNotes(date) {
  var data = await datamanager.returnDay(date);
  console.log(data.work.join("\n"));
}
async function editNotesForDay(date) {
  var notes = await datamanager.returnDay(date);
  var choices = [];
  for (var item in notes.work) {
    choices.push({ title: notes.work[item], value: item });
  }
  
  var question = {
    type: "multiselect",
    name: "value",
    message: "Pick the notes you want to keep.",
    choices: choices,
    hint: "- Space to select. Return to submit",
  };

  var response = await prompt(question);
  var newnotes = []
  for (item in response["value"]){
    newnotes.push(notes.work[item])
  }
  return newnotes
}
async function inputWork() {
  var input = [];
  var question = {
    type: "text",
    name: "work",
    message: "What did you do today?",
  };
  while (true) {
    const onCancel = (prompt) => {
      return false;
    };
    var response = await prompt(question, { onCancel }).then(function (
      response
    ) {
      return response;
    });
    if (response["work"] == undefined || response["work"] == "") {
      break;
    } else {
      input.push(response["work"]);
    }
  }
  return input;
}

actionSelector();
