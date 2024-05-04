export class Foods {
  foodId?: string;
  foodName?: string;
  foodType?: string;
  foodDescription?: string;
  foodPrice?: number;
  foodDiscount?: number;
  foodDiscountPrice?: number;
  shopId?: string;
  shopName?: string;
  shopAddress?: string;
  action?: boolean;
  quantity?:any;

  constructor(
    foodId: any,
    foodName: any,
    foodType: any,
    foodDescription: any,
    foodPrice: any,
    foodDiscount: any,
    foodDiscountPrice: any,
    shopId: any,
    shopName: any,
    shopAddress: any,
    action: any,
    quantity:any
  ) {
    this.foodId = foodId;
    this.foodName = foodName;
    this.foodType = foodType;
    this.foodDescription = foodDescription;
    this.foodPrice = foodPrice;
    this.foodDiscount = foodDiscount;
    this.foodDiscountPrice = foodDiscountPrice;
    this.shopId = shopId;
    this.shopName = shopName;
    this.shopAddress = shopAddress;
    this.action = action;
    this.quantity = quantity;
  }
}
