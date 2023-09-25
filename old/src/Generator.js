import { createReport } from "docx-templates";
import pkg from "prompts";
const prompt = pkg;
import fs from "fs";
import dateFormat, { masks } from "dateformat";
import { DataManager } from "./DataManager.js";
import { DatabaseDateObject } from "./DBDateObject.js";
import { Week, WorkData } from "./WorkData.js";

export class Generator {
  constructor(date = null, datamanager) {
      this.date = date;
      this.datamanager = datamanager
    
  }
  async getWorkData() {
    var workdata = new WorkData("Nils Schöttle", 2, null, 8);
    workdata.week = new Week();
    workdata.week.monday = await this.datamanager.returnDay(
      this.date.getWeekStartDate()
    );
    workdata.week.tuesday = await this.datamanager.returnDay(
      this.date.getWeekStartDate().add(1)
    );
    workdata.week.wednesday = await this.datamanager.returnDay(
      this.date.getWeekStartDate().add(2)
    );
    workdata.week.thursday = await this.datamanager.returnDay(
      this.date.getWeekStartDate().add(3)
    );
    workdata.week.friday = await this.datamanager.returnDay(
      this.date.getWeekStartDate().add(4)
    );
    workdata.week.startDate = workdata.week.monday.date.toWeekDateString();
    workdata.week.endDate = workdata.week.friday.date.toWeekDateString();
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
    if (!fs.existsSync("out")) {
      fs.mkdirSync("out");
    }
    fs.writeFileSync(
      "out/" + this.date.getFullYear() +  "_KW" + this.date.getCalendarWeek(this.date) + ".docx",
      buffer
    );
    console.log(
      "Report createt at " +
        "out/KW_" +
        this.date.getCalendarWeek(this.date) +
        ".docx"
    );
  }
  
  async askForReport(date) {
    var response = await prompt({
      type: "confirm",
      name: "report",
      message: "Do you want to create a Report?",
      initial: false,
    }).then(function (response) {
      return response;
    });
    if (response["report"] == true) {
      this.genReport(date);
    }
  }
  
}
