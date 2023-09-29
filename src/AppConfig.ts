import { DatabaseDateObject } from "./DBDateObject";

export class config {
  static school = process.env.SCHOOL || "";
  static username = process.env.USERNAME || "";
  static password= process.env.PASSWORD || "";
  static webuntisUrl = process.env.WEBUNTIS_URL || "";
  static dbPath = process.env.DB_PATH || "";
  static azubiName = process.env.azubiName || "";
  //DatabseDateObject("JAHR", "MONAT", "TAG")
  static azubiAusbildungStart = process.env.AZUBIJAHR || "";
}
