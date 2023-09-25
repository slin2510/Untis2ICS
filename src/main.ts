import { DatabaseDateObject } from "./DBDateObject";
import { UntisFetcher } from "./UntisFetcher";
import * as dotenv from "dotenv";
dotenv.config();

async function test(){
    const untisFetcher = await UntisFetcher.initialize(process.env.SCHOOL, process.env.USERNAME, process.env.PASSWORD, process.env.WEBUNTISURL)
    await untisFetcher.login();
    //console.log(JSON.stringify(await untisFetcher))
    console.log(await untisFetcher.returnLessonNotesByDate(new DatabaseDateObject(2023, 9,15)))
    //console.log(await untisFetcher.isSchoolDay(new DatabaseDateObject(2023, 9, 15)))
}
test()