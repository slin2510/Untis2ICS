import { DatabaseDateObject } from "./DBDateObject";

export class Azubi {
  name : String;
  year : Number;
  abteilung : String|any;
  constructor(name:String, year:number, abteilung:String|any) {
    (this.name = name), (this.year = year), (this.abteilung = abteilung);
  }
}
export class Day {
  date: DatabaseDateObject;
  work:Array<string>;
  school: boolean;
  constructor(date:DatabaseDateObject, work:Array<any>, school:boolean = false) {
    (this.date = date), (this.work = work), (this.school = school);
  }
}

export class Week {
  startDate:string;
  endDate: string;
  monday: Day;
  tuesday: Day;
  wednesday: Day;
  thursday: Day;
  friday: Day;
  constructor(monday:Day, tuesday:Day, wednesday:Day, thursday:Day, friday:Day) {
    this.startDate = monday.date.toWeekDateString(),
    this.endDate = friday.date.toWeekDateString(),
    (this.monday = monday),
      (this.tuesday = tuesday),
      (this.wednesday = wednesday),
      (this.thursday = thursday),
      (this.friday = friday);
  }
  _startDate() {
    if (this.monday == undefined) {
      return undefined;
    }
    return this.monday.date;
  }
  _endDate() {
    if (this.friday == undefined) {
      return undefined;
    }
    return this.friday.date;
  }
}
export class WorkData {
  azubi: Azubi;
  hours: Number;
  week: Week;
  constructor(azubi:Azubi, hours:number, week:Week) {
    this.azubi =azubi;
    this.week = week;
    this.hours = hours;
  }
}
