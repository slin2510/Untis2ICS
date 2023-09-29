import { UntisFetcher } from "./UntisFetcher";
import { DatabaseManager } from "./DatabaseManager";
import { Day } from "./WorkData";
import { DatabaseDateObject } from "./DBDateObject";
export class DataManager {
  database: DatabaseManager;
  untisfetcher: UntisFetcher;
  public static async initialize(untis_school:string,untis_user:string,untis_password:string,untis_url:string, db_path:string) {
    var untisfetcher = await UntisFetcher.initialize(
      untis_school,
      untis_user,
      untis_password,
      untis_url
    );
    await untisfetcher.login();
    return new DataManager(untisfetcher, db_path);
  }
  constructor(untisfetcher:UntisFetcher,dbpath: string
  ) {
    this.untisfetcher = untisfetcher;
    this.database = new DatabaseManager(dbpath);
  }
  hasNotesForDay(date:DatabaseDateObject) {
    return this.database.hasNotesForDay(date);
  }
  async editNotesForDay(date:DatabaseDateObject, notes:string) {
    var isschoolday = await this.untisfetcher.isSchoolDay(date);
    if (isschoolday == false) {
      if (this.database.hasNotesForDay(date)) {
        this.database.updateNotesForDay(date, notes);
      } else {
        this.database.addNotesForDay(date, notes);
      }
    }
  }
  removeNotesForDay(date:DatabaseDateObject) {
    if (this.database.hasNotesForDay(date)) {
      this.database.removeNotesForDay(date);
    }
  }
  async getNotesForDay(date:DatabaseDateObject) {
    if (await this.untisfetcher.isSchoolDay(date)) {
      var lessonnotes = await this.untisfetcher.returnLessonNotesByDate(date);
      return lessonnotes;
    } else {
      return this.database.getNotesForDay(date);
    }
  }
  async returnDay(date:DatabaseDateObject) {
    var isschoolday = await this.untisfetcher.isSchoolDay(date);
    if (isschoolday) {
      var lessonnotes:Array<any> = await this.untisfetcher.returnLessonNotesByDate(date);
      var valueToReturn = new Day(date, lessonnotes, true);
    } else {
      var notes:any = this.database.getNotesForDay(date);
      if (notes == undefined) {
        notes = {};
        notes["notes"] = "";
      }
      var valueToReturn = new Day(date, notes.notes.split("\n"), false);
    }
    return valueToReturn;
  }
  async isSchoolDay(date:DatabaseDateObject) {
    return await this.untisfetcher.isSchoolDay(date);
  }
}
