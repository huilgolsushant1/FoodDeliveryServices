export class Balance {
    balanceId?: string;
    userId?:string;
    userName?: string;
    amount?:number;
    createDate?: string;
    updateDate?: string;
    status?: string;
  constructor(
    balanceId: any, 
    userId: any, 
    userName: any, 
    amount: any, 
    createDate: any, 
    updateDate: any, 
    status: any
) {
    this.balanceId = balanceId;
    this.userId = userId;
    this.userName = userName;
    this.amount = amount;
    this.createDate = createDate;
    this.updateDate = updateDate;
    this.status = status;
  }    
}
