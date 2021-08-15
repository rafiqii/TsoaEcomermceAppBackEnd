import cartsAndQuantity from "./IproductsInCart";

export interface invoice{
    pricePaid: number;
    products: cartsAndQuantity[];
}