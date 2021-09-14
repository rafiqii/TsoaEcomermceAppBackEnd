import mongoose, { mquery } from 'mongoose';
import { Order } from '../Models/order';
import express from 'express';
import { isLoggedIn } from '../MiddleWare/logedInAuth';
import { Cart } from '../Models/cart';
import { User } from '../Models/user';
import { isAdmin } from '../MiddleWare/isAdminAuth';
import { Invoice } from '../Models/invoice';
import { Product } from '../Models/product';
import cartsAndQuantity from '../Interfaces/IproductsInCart';
import { Icart } from '../Interfaces/Icart';
import { Iproduct } from '../Interfaces/Iproduct';
import { Controller, Path, Post, Put, Request, Route, Security } from '@tsoa/runtime';
import { Iorder } from '../Interfaces/Iorder';
import { invoice } from '../Interfaces/Iinvoice';

const router = express.Router();

@Route("order")
export class orderRoute extends Controller {
    @Security("isLoggedIn")
    @Post("/buyItems")
    public async buyItems(@Request() req: Express.Request): Promise<Iorder> {
        const user = await User.findById(req.user._id);
        const myCart = await Cart.findById(req.user.cartID);

        //Collapsing the cart so no reputation in ids
        let cartArray = [...myCart!.products];
        let collapsedCart: cartsAndQuantity[] = [];
        while (cartArray.length > 0) {
            // console.log(`in while ${cartArray.length}`)
            const myObj: cartsAndQuantity = { productID: JSON.parse(JSON.stringify(cartArray[0].productID)), quantity: 0 };
            let quantity = 0
            //map find filter
            for (let i = 0; i < cartArray.length;) {
                // console.log(myObj.productID==cartArray[i].productID)
                // console.log(`in for ${cartArray.length}`)
                // console.log(`objID: ${myObj.productID}\ncartArray:${cartArray}`)
                if (myObj.productID == cartArray[i].productID) {
                    // console.log(i);
                    // console.log(`cartArray:${cartArray[i].quantity}`)

                    myObj.quantity += cartArray[i].quantity;

                    cartArray.splice(i, 1);

                    // console.log(quantity)
                }
                else {
                    // console.log(`it is false\nobjID: ${myObj.productID}\ncartArray:${cartArray[i].productID}`)
                    i++;
                }
            }
            collapsedCart.push(myObj);
        }
        // console.log(collapsedCart)

        //checking if the stock is avalible
        const myProducts = await Product.find({ _id: { $in: collapsedCart.map(element => element.productID) } })
        // console.log(myProducts)

        for (let i = 0; i < myProducts.length; i++) {
            if (myProducts[i].stock < collapsedCart[i].quantity) {
                throw new Error(`${myProducts[i].name.en}`)
            }
        }

        const order = new Order();
        order.products = [...myCart!.products]

        //removing stock and calculating price
        order.rawPrice = 0;

        for (let i = 0; i < myProducts.length; i++) {

            // console.log(`product price: ${myProducts[i].price}`)
            // console.log(`quantity: ${collapsedCart[i].quantity}`)
            // console.log(`raw price: ${order.rawPrice}`)
            order.rawPrice += myProducts[i].price * collapsedCart[i].quantity;
            myProducts[i].stock -= collapsedCart[i].quantity;

            await myProducts[i].save();
        }

        myCart!.products = [];
        let discount = -1;
        const vat = 1.15;
        req.user.isPremium ? discount = .5 : discount = 1;

        order.priceAfterDiscountAndVAT = order.rawPrice * discount * vat;

        order.delivered = false;

        await order.save();
        await myCart!.save();

        user!.previousOrders.push(order.id);
        await user!.save();

        return order

    }
    //add dedction to stock
    // router.post("/buyItems", isLoggedIn, async (req,res)=>{
    // });
    @Security("isLoggedIn")
    @Put("/orderRecieved/{_id}")
    public async recievedOrder(@Path() _id:string):Promise<invoice> {
        const invoice = new Invoice();
        const myOrder = await Order.findById(_id);
        if (!myOrder)
            throw new Error("Order not found")

        myOrder.delivered = true;
        myOrder.invoice = invoice.id;
        await myOrder.save();


        invoice.products = [...myOrder.products];
        invoice.pricePaid = myOrder.priceAfterDiscountAndVAT;
        await invoice.save();
        return invoice

    }
    // router.put("/orderRecieved/:_id", isLoggedIn, isAdmin, async (req, res)=>
    // {


    // })
}
