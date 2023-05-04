import Database from "better-sqlite3";
import fs from "fs"
export class DatabaseManager {
  constructor(dbpath = ":memory:", verbose = false) {

    if (verbose == true) {
      verbose = console.log;
    } else {
      verbose = null;
    }
    if(!fs.existsSync(dbpath.replace(/[^\/]+$/gm, ""))){
      fs.mkdirSync(dbpath.replace(/[^\/]+$/gm, ""))
    }
    this.db = new Database(dbpath, { verbose: verbose });
    //#region Prepared Statements
    try{
      this.createNotesTable()
    }catch{
    }
    try{
        this._addNotesByDay = this.db.prepare("INSERT INTO notes (date, notes) VALUES (?, ?)");
    }catch{}
    try{
        this._getNotesByDay = this.db.prepare("SELECT * FROM notes WHERE date = ?")    
    }catch{}
    try{
        this._updateNotesByDay = this.db.prepare("UPDATE notes SET notes = ? WHERE date = ?")
    }catch{}
    try{
        this._hasNotesByDay = this.db.prepare("SELECT COUNT(1) FROM notes WHERE date = ?")
    }catch{}
    try{
        this._removeNotesByDay = this.db.prepare("DELETE FROM notes WHERE date = ?")
    }catch{}
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
  addNotesForDay(date, notes) {
    this._addNotesByDay.run(date.toDBString(), notes);
  }
  updateNotesForDay(date, notes){
    var tempnotes = this._getNotesByDay.get(date.toDBString())
    tempnotes = tempnotes.notes + "\n" + notes
    this._updateNotesByDay.run(tempnotes, date.toDBString())
  }
  removeNotesForDay(date){
    this._removeNotesByDay.run(date.toDBString())
  }
  hasNotesForDay(date){
    var temp = this._hasNotesByDay.get(date.toDBString())
    return temp["COUNT(1)"] === 1
  }
  getNotesForDay(date){
    return this._getNotesByDay.get(date.toDBString())
  }
}
