export class Participant {
  middlename: string;
  lastname: string;
  usertype: string;
  userID: number;
  firstname: string;
  age: number;
}

export class Survey {
  tripID: number;
  staffID: number;
  userID: number;
  timestamp: string;
  userType: string;
  q1: number;
  q2: number;
  q3: number;
  q4: number;
  q5: number;
  q6: number;
  q7: number;
  accept : number;
  isSynced : number;
}
