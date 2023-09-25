export class DatabaseDateObject extends Date {
    constructor(year: number, month: number, date: number) {
      super(
        year,
        month - 1,
        date,
        -Math.round(new Date().getTimezoneOffset() / 60),
        0,
        0,
        0
      );
    }
    toDBString():String{
      return this.toISOString().substring(0, 10);
    }
    toUntisString():String{
      return this.toISOString().substring(0, 10).replace(/[-]*/g, "");
    }
    toUntisNumber():Number{
      return this.toISOString().substring(0, 10).replace(/[-]*/g, "") as any as number;
    }
    toWeekDateString():String {
      return (
        this.toISOString().substring(8, 10) +
        "." +
        this.toISOString().substring(5, 7) +
        "." +
        this.toISOString().substring(0, 4)
      );
    }
    add(days: number):DatabaseDateObject {
      return new DatabaseDateObject(
        this.getFullYear(),
        this.getMonth() + 1,
        this.getDate() + days
      );
    }
    sub(days: number):DatabaseDateObject {
      return new DatabaseDateObject(
        this.getFullYear(),
        this.getMonth() + 1,
        this.getDate() - days
      );
    }
    getWeekStartDate(date: DatabaseDateObject|undefined):DatabaseDateObject{
      if (date == undefined) {
        return this.sub(this.getDay() - 1);
      } else {
        return date.sub(date.getDay() - 1);
      }
    }
    getCalendarWeek(date: DatabaseDateObject) {
      var currentThursday = new Date(
        date.getTime() + (3 - ((date.getDay() + 6) % 7)) * 86400000
      );
      var yearOfThursday = currentThursday.getFullYear();
      var firstThursday = new Date(
        new Date(yearOfThursday, 0, 4).getTime() +
          (3 - ((new Date(yearOfThursday, 0, 4).getDay() + 6) % 7)) * 86400000
      );
      var weekNumber = Math.floor(
        1 +
          0.5 +
          (currentThursday.getTime() - firstThursday.getTime()) / 86400000 / 7
      );
      return weekNumber
    }
    static fromDateObject(date: Date){
      console.log(date.getDate(), date.getMonth() + 1, date.getFullYear())
      return new DatabaseDateObject(date.getFullYear(), date.getMonth() + 1, date.getDate())
    }
  }
  