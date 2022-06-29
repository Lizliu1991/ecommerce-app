import CartItem from "../CartItem/CartItem"
//styles
import {Wrapper } from './Order.styles'
//types
import {CartItemType} from '../App'


type Props = {
  cartItems: CartItemType[];

}

const Order: React.FC<Props> = ({cartItems}) => {
 
    return (
      <div>Hello this is your order</div>
    )
    
   
}



export default Order;