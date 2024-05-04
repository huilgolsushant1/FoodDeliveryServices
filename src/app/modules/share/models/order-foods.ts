export class OrderFoods {
  orderId?: string;
  userId?: string;
  shopId?: string;
  foodId?: string;
  foodName?: string;
  foodQuantity?: number;
  foodPrice?: number;
  shopName?: string;
  foodDescription?: string;
  orderFoodStatus?: any;
  discount?: number;
  deliveryCharge?: number;
  totalPrice?: number;
  orderFoodId?: string;
  orderStep?: string;
  constructor(
    orderId: any,
    userId: any,
    shopId: any,
    foodId: any,
    foodName: any,
    foodQuantity: any,
    foodPrice: any,
    shopName: any,
    foodDescription: any,
    orderFoodStatus: any,
    discount: any,
    deliveryCharge: any,
    totalPrice: any,
    orderFoodId: any,
    orderStep: any
  ) {
    this.orderId = orderId;
    this.userId = userId;
    this.shopId = shopId;
    this.foodId = foodId;
    this.foodName = foodName;
    this.foodQuantity = foodQuantity;
    this.foodPrice = foodPrice;
    this.shopName = shopName;
    this.foodDescription = foodDescription;
    this.orderFoodStatus = orderFoodStatus;
    this.discount = discount;
    this.deliveryCharge = deliveryCharge;
    this.totalPrice = totalPrice;
    this.orderFoodId = orderFoodId;
    this.orderStep = orderStep;
  }
}
