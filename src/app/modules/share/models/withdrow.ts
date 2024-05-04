export class Withdrow {
    withdrawId?: string;
    userId?:string;
    userName?: string;
    amount?:number;
    createDate?: string;
    updateDate?: string;
    status?: string;

  constructor(
    withdrawId: any, 
    userId: any, 
    userName: any, 
    amount: any, 
    createDate: any, 
    updateDate: any, 
    status: any
) {
    this.withdrawId = withdrawId;
    this.userId = userId;
    this.userName = userName;
    this.amount = amount;
    this.createDate = createDate;
    this.updateDate = updateDate;
    this.status = status;
  }    
}
