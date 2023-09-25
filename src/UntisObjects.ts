export class Lesson {
  id: number;
  lessonId: number;
  lessonNumber: number;
  lessonCode: string;
  lessonText: string;
  periodText: string;
  hasPeriodText: boolean;
  periodInfo: string;
  periodAttachments: any[]; // You can specify a more specific type for periodAttachments if needed
  substText: string;
  date: number;
  startTime: number;
  endTime: number;
  elements: ElementData[];
  studentGroup: string;
  hasInfo: boolean;
  code: number;
  cellState: string;
  priority: number;
  is: {
    standard: boolean;
    event: boolean;
  };
  roomCapacity: number;
  studentCount: number;

  constructor(data: any) {
    this.id = data.id;
    this.lessonId = data.lessonId;
    this.lessonNumber = data.lessonNumber;
    this.lessonCode = data.lessonCode;
    this.lessonText = data.lessonText;
    this.periodText = data.periodText;
    this.hasPeriodText = data.hasPeriodText;
    this.periodInfo = data.periodInfo;
    this.periodAttachments = data.periodAttachments;
    this.substText = data.substText;
    this.date = data.date;
    this.startTime = data.startTime;
    this.endTime = data.endTime;
    this.elements = data.elements.map((elementData: any) => new ElementData(elementData));
    this.studentGroup = data.studentGroup;
    this.hasInfo = data.hasInfo;
    this.code = data.code;
    this.cellState = data.cellState;
    this.priority = data.priority;
    this.is = data.is;
    this.roomCapacity = data.roomCapacity;
    this.studentCount = data.studentCount;
  }
  static fromJSON(jsonData: any): Lesson {
    return new Lesson({
      id: jsonData.id,
      lessonId: jsonData.lessonId,
      lessonNumber: jsonData.lessonNumber,
      lessonCode: jsonData.lessonCode,
      lessonText: jsonData.lessonText,
      periodText: jsonData.periodText,
      hasPeriodText: jsonData.hasPeriodText,
      periodInfo: jsonData.periodInfo,
      periodAttachments: jsonData.periodAttachments,
      substText: jsonData.substText,
      date: jsonData.date,
      startTime: jsonData.startTime,
      endTime: jsonData.endTime,
      elements: jsonData.elements.map((elementData: any) => ElementData.fromJSON(elementData)),
      studentGroup: jsonData.studentGroup,
      hasInfo: jsonData.hasInfo,
      code: jsonData.code,
      cellState: jsonData.cellState,
      priority: jsonData.priority,
      is: jsonData.is,
      roomCapacity: jsonData.roomCapacity,
      studentCount: jsonData.studentCount,
    });
  }

}

export class ElementData {
  type: number;
  id: number;
  orgId: number;
  missing: boolean;
  state: string;

  constructor(data: any) {
    this.type = data.type;
    this.id = data.id;
    this.orgId = data.orgId;
    this.missing = data.missing;
    this.state = data.state;
  }
  static fromJSON(jsonData: any): ElementData {
    return new ElementData({
      type: jsonData.type,
      id: jsonData.id,
      orgId: jsonData.orgId,
      missing: jsonData.missing,
      state: jsonData.state,
    });
  }
}

export class CalendarEntry {
  id: number;
  previousId: number | null;
  nextId: number | null;
  absenceReasonId: number | null;
  booking: any | null;
  color: string | null;
  endDateTime: string;
  exam: any | null;
  homeworks: any[]; // You can specify a more specific type for homeworks if needed
  klasses: Klass[];
  lesson: SubLesson;
  lessonInfo: any | null;
  mainStudentGroup: StudentGroup;
  messengerChannel: any | null;
  notesAll: any | null;
  notesAllFiles: any[]; // You can specify a more specific type for notesAllFiles if needed
  notesStaff: any | null;
  notesStaffFiles: any[]; // You can specify a more specific type for notesStaffFiles if needed
  originalCalendarEntry: any | null;
  permissions: string[];
  resources: any[]; // You can specify a more specific type for resources if needed
  rooms: Room[];
  singleEntries: any[]; // You can specify a more specific type for singleEntries if needed
  startDateTime: string;
  status: string;
  students: any[]; // You can specify a more specific type for students if needed
  subType: SubType;
  subject: Subject;
  substText: string | null;
  teachers: Teacher[];
  teachingContent: any | null;
  teachingContentFiles: any[]; // You can specify a more specific type for teachingContentFiles if needed
  type: string;
  videoCall: any | null;
  integrationsSection: any[]; // You can specify a more specific type for integrationsSection if needed

  constructor(data: any) {
    this.id = data.id;
    this.previousId = data.previousId;
    this.nextId = data.nextId;
    this.absenceReasonId = data.absenceReasonId;
    this.booking = data.booking;
    this.color = data.color;
    this.endDateTime = data.endDateTime;
    this.exam = data.exam;
    this.homeworks = data.homeworks;
    this.klasses = data.klasses.map((klassData: any) => new Klass(klassData));
    this.lesson = new SubLesson(data.lesson);
    this.lessonInfo = data.lessonInfo;
    this.mainStudentGroup = new StudentGroup(data.mainStudentGroup);
    this.messengerChannel = data.messengerChannel;
    this.notesAll = data.notesAll;
    this.notesAllFiles = data.notesAllFiles;
    this.notesStaff = data.notesStaff;
    this.notesStaffFiles = data.notesStaffFiles;
    this.originalCalendarEntry = data.originalCalendarEntry;
    this.permissions = data.permissions;
    this.resources = data.resources;
    this.rooms = data.rooms.map((roomData: any) => new Room(roomData));
    this.singleEntries = data.singleEntries;
    this.startDateTime = data.startDateTime;
    this.status = data.status;
    this.students = data.students;
    this.subType = new SubType(data.subType);
    this.subject = new Subject(data.subject);
    this.substText = data.substText;
    this.teachers = data.teachers.map((teacherData: any) => new Teacher(teacherData));
    this.teachingContent = data.teachingContent;
    this.teachingContentFiles = data.teachingContentFiles;
    this.type = data.type;
    this.videoCall = data.videoCall;
    this.integrationsSection = data.integrationsSection;
  }
}

export class Klass {
  displayName: string;
  hasTimetable: boolean;
  id: number;
  longName: string;
  shortName: string;

  constructor(data: any) {
    this.displayName = data.displayName;
    this.hasTimetable = data.hasTimetable;
    this.id = data.id;
    this.longName = data.longName;
    this.shortName = data.shortName;
  }
}

export class SubLesson {
  lessonId: number;
  lessonNumber: number;

  constructor(data: any) {
    this.lessonId = data.lessonId;
    this.lessonNumber = data.lessonNumber;
  }
}

export class StudentGroup {
  id: number;
  name: string;

  constructor(data: any) {
    this.id = data.id;
    this.name = data.name;
  }
}

export class Room {
  displayName: string;
  hasTimetable: boolean;
  id: number;
  longName: string;
  shortName: string;
  status: string;

  constructor(data: any) {
    this.displayName = data.displayName;
    this.hasTimetable = data.hasTimetable;
    this.id = data.id;
    this.longName = data.longName;
    this.shortName = data.shortName;
    this.status = data.status;
  }
}

export class SubType {
  displayInPeriodDetails: boolean;
  displayName: string;
  id: number;

  constructor(data: any) {
    this.displayInPeriodDetails = data.displayInPeriodDetails;
    this.displayName = data.displayName;
    this.id = data.id;
  }
}

export class Subject {
  displayName: string;
  hasTimetable: boolean;
  id: number;
  longName: string;
  shortName: string;

  constructor(data: any) {
    this.displayName = data.displayName;
    this.hasTimetable = data.hasTimetable;
    this.id = data.id;
    this.longName = data.longName;
    this.shortName = data.shortName;
  }
}

export class Teacher {
  displayName: string;
  hasTimetable: boolean;
  id: number;
  longName: string;
  shortName: string;
  status: string;
  imageUrl: string | null;

  constructor(data: any) {
    this.displayName = data.displayName;
    this.hasTimetable = data.hasTimetable;
    this.id = data.id;
    this.longName = data.longName;
    this.shortName = data.shortName;
    this.status = data.status;
    this.imageUrl = data.imageUrl;
  }
}