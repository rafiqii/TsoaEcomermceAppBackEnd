import Tproduct from "./Tproduct";


type Tcart={
    _id: string;
    products: [{productID: Tproduct, quantity: number}];
};

export default Tcart;