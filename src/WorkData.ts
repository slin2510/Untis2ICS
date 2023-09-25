import { DatabaseDateObject } from "./DBDateObject";

class Azubi {
  name : String;
  year : Number;
  abteilung : String|any;
  constructor(name:String, year:number, abteilung:String|any) {
    (this.name = name), (this.year = year), (this.abteilung = abteilung);
  }
}
export class Day {
  date: DatabaseDateObject;
  work:Array<any>;
  school: boolean;
  constructor(date:DatabaseDateObject, work:Array<any>, school:boolean = false) {
    (this.date = date), (this.work = work), (this.school = school);
  }
}

export class Week {
  startDate: Date|undefined;
  endDate: Date|undefined;
  monday: Day|undefined;
  tuesday: Day|undefined;
  wednesday: Day|undefined;
  thursday: Day|undefined;
  friday: Day|undefined;
  constructor() {
    this.startDate =undefined,
    this.endDate = undefined,
    (this.monday = undefined),
      (this.tuesday = undefined),
      (this.wednesday = undefined),
      (this.thursday = undefined),
      (this.friday = undefined);
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
  week: Week|null;
  constructor(azubiname: String, azubiyear:number, azubiabteilung:String, hours:number) {
    this.azubi = new Azubi(azubiname, azubiyear, azubiabteilung);
    (this.hours = hours), (this.week = null);
  }
}
