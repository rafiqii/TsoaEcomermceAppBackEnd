import Tbrand from "./Tbrand";
import Tcategory from "./Tcategory";

type Tproduct=
{
    _id: string;
    name: 
    {
        en:string;
        ar:string;
    };
    price: number;
    icon: string;
    isPremium: boolean;
    stock:Number;
    categories: Tcategory[];
    brandName:Tbrand;
}
export default Tproduct;