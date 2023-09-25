import ics from 'ics';
export function DayToICS(){

}
let test = ics.createEvent({
  start: [2018, 5, 30, 6, 30],
  duration: { hours: 6, minutes: 30 },
  title: 'Bolder Boulder'
})
console.log(test)