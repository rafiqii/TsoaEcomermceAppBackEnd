import Tproduct from "./Tproduct";

type Torder= {
    _id: string;
    product: [{productID: Tproduct, quantity: number}];
    rawPrice: number;
    priceAfterDiscountAndVAT: number;
    delivered:boolean;
}

export default Torder;