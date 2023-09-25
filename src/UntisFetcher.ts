import { DatabaseDateObject } from "./DBDateObject";
import axios, {
  AxiosRequestConfig,
  AxiosInstance,
  AxiosRequestHeaders,
  AxiosHeaderValue,
} from "axios";
import HttpsProxyAgent from "https-proxy-agent";
import { ElementData, Lesson, CalendarEntry } from "./UntisObjects";

export class UntisFetcher {
  cookies: string;
  untis_school: string;
  untis_user: string;
  untis_password: string;
  untis_url: string;
  private ax: AxiosInstance;
  private constructor(
    untis_school: string,
    untis_user: string,
    untis_password: string,
    untis_url: string,
    cookies: string
  ) {
    this.cookies = cookies;
    this.untis_school = untis_school;
    this.untis_user = untis_user;
    this.untis_password = untis_password;
    this.untis_url = untis_url;
    if (process.env.https_proxy != "" && process.env.https_proxy != undefined) {
      var httpsagent = new HttpsProxyAgent.HttpsProxyAgent(
        "http://proxy-003.intra.world:3128"
      );
      this.ax = axios.create({
        httpsAgent: httpsagent,
        proxy: false,
        headers: {
          Cookie: this.cookies,
        },
      });
    } else {
      this.ax = axios.create({});
    }
  }
  public static async initialize(
    untis_school: string = "",
    untis_user: string = "",
    untis_password: string = "",
    untis_url: string = ""
  ) {
    let cookies = await this.getJSESSIONID(untis_school);
    return new UntisFetcher(
      untis_school,
      untis_user,
      untis_password,
      untis_url,
      cookies
    );
  }
  /*async returnLessonNotesByDate(date: DatabaseDateObject) {
    var url_date = date.toDBString();
    var timetableResult = await this.ax.get(
      `https://mese.webuntis.com/WebUntis/api/public/timetable/weekly/data?elementType=5&elementId=14562&date=${url_date}&formatId=2`,
      { headers: { Cookie: this.cookies } }
    );
    var data = JSON.parse(timetableResult.data).data.result.data;
    var uniqueDates = [
      ...new Set(
        data.elementPeriods[data.elementIds[0]].map((lesson) => lesson.date)
      ),
    ];
    var lessonNotesPerDay = {};
    for (var date_ of uniqueDates) {
      var temp = data.elementPeriods[data.elementIds[0]].filter((item) => {
        if (item.date == date_) {
          return true;
        }
        return false;
      });
      lessonNotesPerDay[date_] = temp;
    }

    var lessons = lessonNotesPerDay[date.toUntisString()];
    if (lessons == undefined) {
      return null;
    }
    var lessonIds = [...new Set(lessons.map((lesson) => lesson.lessonId))];
    var webtoken = await this.getWebToken();
    var detailedLessons = {};
    for (var lesson of lessons) {
      var startTimeString = "" + lesson.startTime;
      var startTimeStringMinutes = startTimeString.slice(-2);
      var startTimeStringHours = startTimeString.replace(
        startTimeStringMinutes,
        ""
      );
      if (startTimeStringHours.length == 1) {
        startTimeStringHours = "0" + startTimeStringHours;
      }
      var endTimeString = "" + lesson.endTime;
      var endTimeStringMinutes = endTimeString.slice(-2);
      var endTimeStringHours = endTimeString.replace(endTimeStringMinutes, "");
      if (endTimeStringHours.length == 1) {
        endTimeStringHours = "0" + endTimeStringHours;
      }
      endTimeString = endTimeStringHours + ":" + endTimeStringMinutes;
      startTimeString = startTimeStringHours + ":" + startTimeStringMinutes;
      var DateString = date.toDBString();
      var url = `https://mese.webuntis.com/WebUntis/api/rest/view/v1/calendar-entry/detail?elementId=14562&elementType=5&endDateTime=${DateString}T${endTimeString}:00&homeworkOption=DUE&startDateTime=${DateString}T${startTimeString}:00`;
      var lessonresult = await this.axios.get(url, {
        headers: {
          Cookie: this.untis._buildCookies(),
          Authorization: "Bearer " + webtoken,
        },
      });
      detailedLessons[lesson.lessonId] = JSON.parse(lessonresult.data);
    }
    var returnList = [];
    for (var item in detailedLessons) {
      returnList.push(
        detailedLessons[
          item
        ].calendarEntries[0].subject.displayName.toString() +
          ": " +
          detailedLessons[item].calendarEntries[0].teachingContent
      );
    }
    this.untis.logout();
    return returnList;
    
  }*/
  private async getTimeTable(date: DatabaseDateObject) {
    var url_date = date.toDBString();
    var timetableResult = await this.ax.get(
      `https://mese.webuntis.com/WebUntis/api/public/timetable/weekly/data?elementType=5&elementId=14562&date=${url_date}&formatId=2`,
      {
        headers: { Cookie: this.cookies } as any as AxiosRequestHeaders,
      } as AxiosRequestConfig
    );
    return timetableResult.data.data.result.data;
  }
  private getUniqueDates(data: any): Array<number> {
    return [
      ...new Set<number>(data.map((lesson: { date: number }) => lesson.date)),
    ] as Array<number>;
  }
  private async getLesson(
    lesson: Lesson,
    date: DatabaseDateObject
  ): Promise<Array<CalendarEntry>> {
    var startTimeString = "" + lesson.startTime;
    var startTimeStringMinutes = startTimeString.slice(-2);
    var startTimeStringHours = startTimeString.replace(
      startTimeStringMinutes,
      ""
    );
    if (startTimeStringHours.length == 1) {
      startTimeStringHours = "0" + startTimeStringHours;
    }
    var endTimeString = "" + lesson.endTime;
    var endTimeStringMinutes = endTimeString.slice(-2);
    var endTimeStringHours = endTimeString.replace(endTimeStringMinutes, "");
    if (endTimeStringHours.length == 1) {
      endTimeStringHours = "0" + endTimeStringHours;
    }
    endTimeString = endTimeStringHours + ":" + endTimeStringMinutes;
    startTimeString = startTimeStringHours + ":" + startTimeStringMinutes;
    var DateString = date.toDBString();
    let webtoken = await this.getWebToken();
    var url = `https://mese.webuntis.com/WebUntis/api/rest/view/v1/calendar-entry/detail?elementId=14562&elementType=5&endDateTime=${DateString}T${endTimeString}:00&homeworkOption=DUE&startDateTime=${DateString}T${startTimeString}:00`;
    var lessonresult = await this.ax.get(url, {
      headers: { Cookie: this.cookies, Authorization: "Bearer " + webtoken },
    });
    return lessonresult.data.calendarEntries.map(
      (lessonData: any) => new CalendarEntry(lessonData)
    );
  }
  async returnLessonsByDate(date: DatabaseDateObject): Promise<Array<string>> {
    var data = await this.getTimeTable(date);
    data = data.elementPeriods[data.elementIds[0]];
    var uniqueDates: Array<number> = this.getUniqueDates(data);
    var lessonNotesPerDay: { [key: string]: Lesson[] } = {};
    for (var date_ in uniqueDates) {
      var temp = data.filter((item: { date: number }) => {
        if (item.date == uniqueDates[date_]) {
          return true;
        }
        return false;
      });

      lessonNotesPerDay[uniqueDates[date_]] = temp.map(
        (lessonData: any) => new Lesson(lessonData)
      );
    }
    var lessons = lessonNotesPerDay[date.toUntisString()];
    let studentGroup: Array<string> = [];
    for (let lesson2 in lessons) {
      if (!studentGroup.includes(lessons[lesson2].studentGroup.split("_")[0])) {
        studentGroup.push(lessons[lesson2].studentGroup.split("_")[0]);
      }
    }
    return studentGroup;
  }
  async returnLessonNotesByDate(date: DatabaseDateObject) {
    var data = await this.getTimeTable(date);
    data = data.elementPeriods[data.elementIds[0]];
    var uniqueDates: Array<number> = this.getUniqueDates(data);
    var lessonNotesPerDay: { [key: string]: Lesson[] } = {};
    for (var date_ in uniqueDates) {
      var temp = data.filter((item: { date: number }) => {
        if (item.date == uniqueDates[date_]) {
          return true;
        }
        return false;
      });

      lessonNotesPerDay[uniqueDates[date_]] = temp.map(
        (lessonData: any) => new Lesson(lessonData)
      );
    }

    var lessons = lessonNotesPerDay[date.toUntisString()];
    if (lessons == undefined) {
      return null;
    }
    let detailedLessons: { [key: string]: CalendarEntry[] } = {};
    for (var lesson of lessons) {
      detailedLessons[lesson.lessonId] = await this.getLesson(lesson, date);
    }

    var returnList = [];
    for (var item in detailedLessons) {
      returnList.push(
        detailedLessons[item][0].subject.displayName.toString() +
          ": " +
          detailedLessons[item][0].teachingContent
      );
    }
    return returnList;
  }
  async isSchoolDay(date: DatabaseDateObject) {
    var url_date = date.toDBString();
    var timetableResult = await this.ax.get(
      `https://mese.webuntis.com/WebUntis/api/public/timetable/weekly/data?elementType=5&elementId=14562&date=${url_date}&formatId=2`,
      {
        headers: { Cookie: this.cookies } as any as AxiosRequestHeaders,
      } as AxiosRequestConfig
    );
    var data = timetableResult.data.data.result.data;
    data = data.elementPeriods[data.elementIds[0]];
    var uniqueDates: Array<number> = [
      ...new Set<number>(data.map((lesson: { date: number }) => lesson.date)),
    ];
    //console.log(uniqueDates, date.toUntisString());
    for (var uniqueDate of uniqueDates) {
      if (uniqueDate == date.toUntisNumber()) {
        return true;
      }
    }
    return false;
  }

  async login() {
    var body = `school=${process.env.SCHOOL}&j_username=${process.env.USERNAME}&j_password=${process.env.PASSWORD}&token=`;
    var login = await fetch(
      "https://mese.webuntis.com/WebUntis/j_spring_security_check",
      {
        headers: {
          accept: "application/json",
          "accept-language": "de-DE,de;q=0.9",
          "cache-control": "no-cache",
          "content-type": "application/x-www-form-urlencoded",
          pragma: "no-cache",
          "sec-ch-ua":
            '"Chromium";v="116", "Not)A;Brand";v="24", "Google Chrome";v="116"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"macOS"',
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
          cookie: this.cookies,
          "x-csrf-token": "efc3e540-a335-4a7e-9937-74de5f0a745f",
          Referer:
            "https://mese.webuntis.com/WebUntis/?school=IT-Schule+Stuttgart",
          "Referrer-Policy": "strict-origin-when-cross-origin",
        },
        body: body,
        method: "POST",
      }
    );
  }

  private static async getJSESSIONID(untis_school: string) {
    var jSessionID = await fetch(
      `https://mese.webuntis.com/WebUntis/?school=${untis_school.replace(
        " ",
        "+"
      )}`,
      {
        headers: {
          accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
          "accept-language": "de-DE,de;q=0.9",
          "cache-control": "no-cache",
          pragma: "no-cache",
          "sec-ch-ua":
            '"Chromium";v="116", "Not)A;Brand";v="24", "Google Chrome";v="116"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"macOS"',
          "sec-fetch-dest": "document",
          "sec-fetch-mode": "navigate",
          "sec-fetch-site": "none",
          "sec-fetch-user": "?1",
          "upgrade-insecure-requests": "1",
        },
        referrerPolicy: "strict-origin-when-cross-origin",
        body: null,
        method: "GET",
      }
    );
    var cookies: string = "";
    if (jSessionID.headers != null) {
      var headers = jSessionID.headers.get("set-cookie");
      if (headers != null) {
        for (var element in headers.split(",")) {
          var regex = /(?<key>\w*)=(?<value>(\W?)\w*(\W{2})?"?)/m;
          var token: string = headers.split(",")[element].split(";")[0];
          if (token != null) {
            try {
              var match = token.match(regex);
              if (match != null) {
                var groups = match.groups;
                if (groups != null) {
                  cookies =
                    cookies + groups["key"] + "=" + groups["value"] + "; ";
                }
              }
            } catch {}
          }
        }
      }
    }

    return cookies;
  }
  async getWebToken() {
    var webtoken = await this.ax.get(
      "https://mese.webuntis.com/WebUntis/api/token/new",
      { headers: { Cookie: this.cookies } }
    );
    return webtoken.data;
  }
}
