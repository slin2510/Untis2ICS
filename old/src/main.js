import { UntisFetcher } from "./UntisFetcher.js";
import * as dotenv from "dotenv";
import {DatabaseDateObject} from "./DBDateObject.js"
dotenv.config();
var untis = new UntisFetcher(process.env.SCHOOL, process.env.USER, process.env.PASSWORD, process.env.WEBUNTISURL);
//untis.returnLessonNotesByDate( new DatabaseDateObject(2023, 9, 11)).then((lessons) => {console.log(lessons)});
console.log(untis.cookies);