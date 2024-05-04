export class Users {
    userId?:string;
    userFullName?:String;
    username?:String;
    userEmail?:String;
    userPassword?:String;
    userAddress?:string;
    
  constructor(
    userId: any, 
    userFullName: any, 
    username: any, 
    userEmail: any, 
    userPassword: any, 
    userAddress: any
) {
    this.userId = userId;
    this.userFullName = userFullName;
    this.username = username;
    this.userEmail = userEmail;
    this.userPassword = userPassword;
    this.userAddress = userAddress;
  }    

}
