import { UntisFetcher } from "./UntisFetcher.js";
import { DatabaseManager } from "./DatabaseManager.js";
import { Day } from "./WorkData.js"
export class DataManager {
    constructor(untis_school, untis_user, untis_password, untis_url, dbpath){
        this.untisfetcher = new UntisFetcher(untis_school, untis_user, untis_password, untis_url);
        this.database = new DatabaseManager(dbpath);
    }
    hasNotesForDay(date){
        return this.database.hasNotesForDay(date)
    }
    async editNotesForDay(date, notes){
        var isschoolday = await this.untisfetcher.isSchoolDay(date)
        if(isschoolday == false){
            if(this.database.hasNotesForDay(date)){
                this.database.updateNotesForDay(date, notes)
            }else {
                this.database.addNotesForDay(date, notes)
            }
        }
    }
    removeNotesForDay(date){
        if(this.database.hasNotesForDay(date)){
            this.database.removeNotesForDay(date)
        }
    }
    async getNotesForDay(date){
        if(this.untisfetcher.isSchoolDay(date)){
            var lessonnotes = await this.untisfetcher.returnLessonNotesByDate(date)
            return lessonnotes
        } else {
            return this.database.getNotesForDay(date)
        }
    }
    async returnDay(date){
        var isschoolday = await this.untisfetcher.isSchoolDay(date)
        if(isschoolday){
            var lessonnotes = await this.untisfetcher.returnLessonNotesByDate(date)
            var valueToReturn = new Day(date, lessonnotes, true)
        } else {
            var notes = this.database.getNotesForDay(date)
            if (notes == undefined){
                notes = {}
                notes["notes"] = ""
            }
            var valueToReturn = new Day(date, notes.notes.split("\n"), false)
        }
        return valueToReturn
    }
    async isSchoolDay(date){
        return await this.untisfetcher.isSchoolDay(date)
    }

}