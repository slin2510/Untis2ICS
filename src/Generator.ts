import { createReport } from "docx-templates";
import pkg from "prompts";
const prompt = pkg;
import fs from "fs";
import { DataManager } from "./DataManager";
import { DatabaseDateObject } from "./DBDateObject";
import { Week, WorkData, Azubi } from "./WorkData";

export class Generator {
  datamanager: DataManager
  date: DatabaseDateObject
  azubi: Azubi
  constructor(date:DatabaseDateObject, datamanager: DataManager, azubi:Azubi) {
      this.date = date;
      this.datamanager = datamanager
      this.azubi = azubi
    
  }
  async getWorkData() {
    let monday = await this.datamanager.returnDay(
      this.date.getWeekStartDate()
    );
    let tuesday = await this.datamanager.returnDay(
      this.date.getWeekStartDate().add(1)
    );
    let wednesday = await this.datamanager.returnDay(
      this.date.getWeekStartDate().add(2)
    );
    let thursday = await this.datamanager.returnDay(
      this.date.getWeekStartDate().add(3)
    );
    let friday = await this.datamanager.returnDay(
      this.date.getWeekStartDate().add(4)
    );
    var week = new Week(monday, tuesday, wednesday, thursday, friday)
    var workdata = new WorkData(this.azubi, 8, week);
    return workdata;
  }
  async genReport() {
    const template = fs.readFileSync(
      "templates/Ausbildungsnachweis_taeglich-TO.docx"
    );
    //const work = inputWork();
    var data = await this.getWorkData();
    const buffer = await createReport({
      template,
      data: data,
    });
    if (!fs.existsSync("docx")) {
      fs.mkdirSync("docx");
    }
    fs.writeFileSync(
      "docx/" + this.date.getFullYear() +  "_KW" + this.date.getCalendarWeek(this.date) + ".docx",
      buffer
    );
    console.log(
      "Report createt at " +
        "out/KW_" +
        this.date.getCalendarWeek(this.date) +
        ".docx"
    );
  }
  
  async askForReport() {
    var response = await prompt({
      type: "confirm",
      name: "report",
      message: "Do you want to create a Report?",
      initial: false,
    }).then(function (response) {
      return response;
    });
    if (response["report"] == true) {
      this.genReport();
    }
  }
  
}
