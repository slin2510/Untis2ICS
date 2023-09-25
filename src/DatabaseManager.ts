import Database from "better-sqlite3"
import fs from "fs"
import { DatabaseDateObject } from "./DBDateObject";
export class DatabaseManager {
  db: Database.Database;
  _addNotesByDay: Database.Statement;
  _getNotesByDay: Database.Statement;
  _updateNotesByDay: Database.Statement;
  _hasNotesByDay: Database.Statement;
  _removeNotesByDay: Database.Statement;
  constructor(dbpath:string = ":memory:") {
    if(!fs.existsSync(dbpath.replace(/[^\/]+$/gm, ""))){
      fs.mkdirSync(dbpath.replace(/[^\/]+$/gm, ""))
    }
    this.db = new Database(dbpath);
    //#region Prepared Statements
    this.createNotesTable()
    this._addNotesByDay = this.db.prepare("INSERT INTO notes (date, notes) VALUES (?, ?)");
    this._getNotesByDay = this.db.prepare("SELECT * FROM notes WHERE date = ?")    
    this._updateNotesByDay = this.db.prepare("UPDATE notes SET notes = ? WHERE date = ?")
    this._hasNotesByDay = this.db.prepare("SELECT COUNT(1) FROM notes WHERE date = ?")
    this._removeNotesByDay = this.db.prepare("DELETE FROM notes WHERE date = ?")
//#endregion

    
  
  }
  createNotesTable() {
    try {
      this.db
        .prepare(
          "CREATE TABLE notes (date DATE PRIMARY KEY, notes MEDIUMTEXT);"
        )
        .run();
    } catch {}
  }
  addNotesForDay(date:DatabaseDateObject, notes:string) {
    this._addNotesByDay.run(date.toDBString(), notes);
  }
  updateNotesForDay(date:DatabaseDateObject, notes:string){
    var tempnotes:any = this._getNotesByDay.get(date.toDBString())
    tempnotes = tempnotes.notes + "\n" + notes
    this._updateNotesByDay.run(tempnotes, date.toDBString())
  }
  removeNotesForDay(date:DatabaseDateObject){
    this._removeNotesByDay.run(date.toDBString())
  }
  hasNotesForDay(date:DatabaseDateObject){
    var temp:any = this._hasNotesByDay.get(date.toDBString())
    return temp["COUNT(1)"] === 1
  }
  getNotesForDay(date:DatabaseDateObject){
    return this._getNotesByDay.get(date.toDBString())
  }
}
