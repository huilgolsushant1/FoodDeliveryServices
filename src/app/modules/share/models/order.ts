export class Order {

    orderId?: string;
    orderDate?: string;
    orderStatus?: string;
    userId?: string;
    userName?: string;
    userphone?: string;
    userEmail?: string;
    userAddress?: string;
    shopId?: string;
    shopName?: string;
    shopAddress?: string;
    paymentMethod?: string;
    payNumber?: string;
    transectionNumber?: string;
    discount?: number;
    totalPrice?: number;
    
    constructor(
        orderId: any,
        orderDate: any,
        orderStatus: any,
        userId: any,
        userName: any,
        userphone: any,
        userEmail: any,
        userAddress: any,
        shopId: any,
        shopName: any,
        shopAddress: any,
        paymentMethod: any,
        payNumber: any,
        transectionNumber: any,
        discount: any,
        totalPrice: any
    ) {
        this.orderId = orderId;
        this.orderDate = orderDate;
        this.orderStatus = orderStatus;
        this.userId = userId;
        this.userName = userName;
        this.userphone = userphone;
        this.userEmail = userEmail;
        this.userAddress = userAddress;
        this.shopId = shopId;
        this.shopName = shopName;
        this.shopAddress = shopAddress;
        this.paymentMethod = paymentMethod;
        this.payNumber = payNumber;
        this.transectionNumber = transectionNumber;
        this.discount = discount;
        this.totalPrice = totalPrice;
    }
}
