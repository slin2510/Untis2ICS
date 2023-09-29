import prompts from "prompts";
import { DataManager } from "./DataManager.js";
import { DatabaseDateObject } from "./DBDateObject.js";
import { Generator } from "./Generator.js";
import * as dotenv from 'dotenv'
dotenv.config()
import pkg from "prompts";
import { Azubi } from "./WorkData.js";
const { prompt } = pkg;
import { config } from "./AppConfig.js";


export class Interface{
  datamanager: DataManager
  azubi:Azubi
  public static async initialize():Promise<Interface>{
    const datamanager = await DataManager.initialize(config.school,config.username,config.password,config.webuntisUrl,config.dbPath)
    const azubi = new Azubi(config.azubiName, config.azubiAusbildungStart, "")
    return new Interface(datamanager, azubi)
  }
  constructor(datamanager:DataManager, azubi:Azubi){
    this.azubi = azubi
    this.datamanager = datamanager;
    this.actionSelector()

  }

  async actionSelector() {
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
        var date = await this.inputDate();
        var notes = await this.inputWork();
        await this.datamanager.editNotesForDay(date, notes.join("\n"));
        break;
      case 1:
        var date = await this.inputDate();
        var gen = new Generator(date, this.datamanager, this.azubi);
        gen.askForReport();
        break;
      case 2:
        var date = await this.inputDate();
        await this.inspectNotes(date);
        break;
      case 3:
        var date = await this.inputDate();
        var newnotes = await this.editNotesForDay(date);
        await this.datamanager.removeNotesForDay(date)
        this.datamanager.editNotesForDay(date, newnotes.join("\n"))
        break;
      default:
        break;
    }
  }
  
  async inputDate() {
    var question = {
      type: "date",
      name: "date",
      message: `Enter the day you want to take notes for:`,
      mask: "DD-MM-YYYY",
    };
    var response = await prompt(question);
    return DatabaseDateObject.fromDateObject(response["date"]);
  }
  async inspectNotes(date:DatabaseDateObject) {
    var data = await this.datamanager.returnDay(date);
    console.log(data.work.join("\n"));
  }
  async editNotesForDay(date:DatabaseDateObject) {
    var notes = await this.datamanager.returnDay(date);
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
      newnotes.push(notes.work[parseInt(item)])
    }
    return newnotes
  }
  async inputWork() {
    var input = [];
    var question = {
      type: "text",
      name: "work",
      message: "What did you do today?",
    };
    while (true) {
      const onCancel = (prompt:pkg.PromptObject) => {
        return false;
      };
      var response = await prompt(question, { onCancel }).then(function (
        response:any
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
  
}
  


