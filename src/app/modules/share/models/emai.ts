export class Emai {
    to?:string;
    subject?:string;
    body?:string;

  constructor(to: any, subject: any, body: any) {
    this.to = to;
    this.subject = subject;
    this.body = body;
  }    
}

