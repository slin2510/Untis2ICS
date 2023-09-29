import { DatabaseDateObject } from "./DBDateObject";

export class config {
  static school:string = "IT-Schule Stuttgart";
  static username:string = "nils.schoettle";
  static password:string = "Bnsy240!";
  static webuntisUrl:string = "mese.webuntis.com";
  static dbPath:string = "db/app.db";
  static azubiName:string = "Nils Schöttle";
  //DatabseDateObject("JAHR", "MONAT", "TAG")
  static azubiAusbildungStart:number = new DatabaseDateObject(2021,8,1).calcYears()
}
