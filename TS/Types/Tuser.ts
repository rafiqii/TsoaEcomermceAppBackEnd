import Tcart from "./Tcart";
import Torder from "./Torder";

type Tuser=
{
    _id: string;
    userName: string;
    password: string;
    isAdmin: boolean;
    isPremium: boolean;
    previousOrders: Torder[]; // if it doesnt work change to string
    cartID: Tcart ; // if it doesnt work change to string
}

export default Tuser;