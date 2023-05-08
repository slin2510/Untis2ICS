import axios from "axios";
import WebUntis from "webuntis";
import HttpsProxyAgent from "https-proxy-agent";
import HttpProxyAgent from "http-proxy-agent";
import { Untis } from "./UntisClass.js";

export class UntisFetcher{
    constructor(untis_school, untis_user, untis_password, untis_url){
        this.untis = new Untis(untis_school, untis_user, untis_password, untis_url)
        if(process.env.https_proxy!="" && process.env.https_proxy!=undefined){
            var httpsagent = new HttpsProxyAgent.HttpsProxyAgent("http://proxy-003.intra.world:3128")
            this.axios = new axios.Axios({
                httpsAgent: httpsagent,
                proxy: false,
                rejectUnauthorized: false,
            })
        } else {
            this.axios = new axios.Axios({
 
                rejectUnauthorized: false,
            })
        }
        
    }
    async returnLessonNotesByDate(date){
        await this.untis.login()
        var url_date = date.toDBString()
        var timetableResult = await this.axios.get(`https://mese.webuntis.com/WebUntis/api/public/timetable/weekly/data?elementType=5&elementId=14562&date=${url_date}&formatId=2`,{headers:{Cookie: this.untis._buildCookies()}})
        var data = JSON.parse(timetableResult.data).data.result.data
        var uniqueDates = [...new Set(data.elementPeriods[data.elementIds[0]].map((lesson) => lesson.date))];
        var lessonNotesPerDay = {}
        for (var date_ of uniqueDates){
            var temp = data.elementPeriods[data.elementIds[0]].filter((item) => {
                if(item.date  == date_){
                    return true
                } 
                return false
            })
            lessonNotesPerDay[date_] = temp

        }
        
        var lessons = lessonNotesPerDay[date.toUntisString()]
        if(lessons == undefined){
            return null
        }
        var lessonIds = [...new Set(lessons.map((lesson) => lesson.lessonId))];
        var webtoken = await this.getWebToken()
        var detailedLessons = {}
        for (var lesson of lessons ){
            
            var startTimeString = ("" + lesson.startTime)
            var startTimeStringMinutes = startTimeString.slice(-2)
            var startTimeStringHours = startTimeString.replace(startTimeStringMinutes, "")
            if(startTimeStringHours.length == 1){
                startTimeStringHours = "0" + startTimeStringHours
            }
            var endTimeString = ""+ lesson.endTime
            var endTimeStringMinutes = endTimeString.slice(-2)
            var endTimeStringHours = endTimeString.replace(endTimeStringMinutes, "")
            if(endTimeStringHours.length == 1){
                endTimeStringHours = "0" + endTimeStringHours
            }
            endTimeString= endTimeStringHours + ":" + endTimeStringMinutes
            startTimeString = startTimeStringHours + ":" + startTimeStringMinutes
            var DateString = date.toDBString()
            var url = `https://mese.webuntis.com/WebUntis/api/rest/view/v1/calendar-entry/detail?elementId=14562&elementType=5&endDateTime=${DateString}T${endTimeString}:00&homeworkOption=DUE&startDateTime=${DateString}T${startTimeString}:00`
            var lessonresult = await this.axios.get(url, {headers:{Cookie: this.untis._buildCookies(), Authorization: "Bearer " + webtoken}})
            detailedLessons[lesson.lessonId] = JSON.parse(lessonresult.data)
        }
        var returnList = []
        for (var item in detailedLessons){
            returnList.push(detailedLessons[item].calendarEntries[0].subject.displayName.toString() + ": " + detailedLessons[item].calendarEntries[0].teachingContent)
        }
        this.untis.logout()
        return returnList
    }
    async isSchoolDay(date){
        await this.untis.login()
        var url_date = date.toDBString()
        var timetableResult = await this.axios.get(`https://mese.webuntis.com/WebUntis/api/public/timetable/weekly/data?elementType=5&elementId=14562&date=${url_date}&formatId=2`,{headers:{Cookie: this.untis._buildCookies()}})
        await this.untis.logout()
        
        var data = JSON.parse(timetableResult.data).data.result.data
        var uniqueDates = [...new Set(data.elementPeriods[data.elementIds[0]].map((lesson) => lesson.date.toString()))];
        if(uniqueDates.includes(date.toUntisString())){
            return true
        }else {
            return false
        }
    }
    async getWebToken(){
        await this.untis.login()
        var webtoken = await this.axios.get("https://mese.webuntis.com/WebUntis/api/token/new", {headers:{Cookie: this.untis._buildCookies()}})
        return webtoken.data
        await this.untis.logout()
    }
}