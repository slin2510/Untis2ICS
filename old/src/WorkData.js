class Azubi {
  constructor(name, year, abteilung) {
    (this.name = name), (this.year = year), (this.abteilung = abteilung);
  }
}
export class Day {
  constructor(date = undefined, work = undefined, school = undefined) {
    (this.date = date), (this.work = work), (this.school = school);
  }
}

export class Week {
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
  constructor(azubiname, azubiyear, azubiabteilung, hours) {
    this.azubi = new Azubi(azubiname, azubiyear, azubiabteilung);
    (this.hours = hours), (this.week = null);
  }
}
