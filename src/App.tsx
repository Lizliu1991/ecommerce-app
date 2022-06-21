import { useState } from 'react'
import { useQuery } from 'react-query'
//components
import { Drawer, LinearProgress, Grid } from '@material-ui/core';
import { AddShoppingCart } from '@material-ui/icons';
import Item from './Item/Item';
import Badge from '@mui/material/Badge';
import Cart from "./Cart/Cart"

//styles
import { Wrapper, StyledButton } from './App.styles'
//Types
export type CartItemType = {
  id: number;
  category: string;
  description: string;
  image: string;
  price: number;
  title: string;
  amount: number;
}

//get data from api
const getProducts = async (): Promise<CartItemType[]> => {
  const res = await fetch('https://fakestoreapi.com/products')
  return res.json()
}



function App() {
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([] as CartItemType[])

  // fetch data from API
  const { data, isLoading, error } = useQuery<CartItemType[]>('products', getProducts, {
    refetchOnWindowFocus: false
  })
  // console.log(data)

  // will render only once

  //run through the array of items and total up all of the quantity values, initial value being 0
  const getTotalItems = (items: CartItemType[]) =>
    items.reduce((accum: number, item) => accum + item.amount, 0)

  const handleAddToCart = (clickedItem: CartItemType) => {
    setCartItems(prev => {
      // is the item aleady in the cart
      const isItemInCart = prev.find(item => item.id === clickedItem.id)

      if (isItemInCart) {
        return prev.map(item =>
          item.id === clickedItem.id ? { ...item, amount: item.amount + 1 } : item
        )
      }
      //first time the item is added 
      return [...prev, { ...clickedItem, amount: 1 }]

    })



  }
  const handleRemoveFromCart = (id: number) => {

    setCartItems(prev => (
      prev.reduce((ack, item) => {
        if (item.id === id) {
          // if the amount is 1 ,remove it from array
          if (item.amount === 1) return ack;
          // otherwise remove 1 from the amount
          return [...ack, { ...item, amount: item.amount - 1 }]
        } else {
          // return the item as it is
          return [...ack, item]
        }
      }, [] as CartItemType[])

    ))
  }

  const clearCart = () => setCartItems([])

  if (isLoading) return <LinearProgress />
  if (error) return <div>Something Went Wrong</div>

  return (
    <Wrapper>
      <Drawer anchor="right" open={cartOpen} onClose={() => setCartOpen(false)}>

        <Cart
          cartItems={cartItems}
          addToCart={handleAddToCart}
          removeFromCart={handleRemoveFromCart} />
      </Drawer>
      <StyledButton onClick={() => setCartOpen(true)}>
        <Badge

          badgeContent={getTotalItems(cartItems)}
          color="error">
          <AddShoppingCart />
        </Badge>
      </StyledButton>
      <Grid container spacing={3}>
        {data?.map(item => (
          <Grid item key={item.id} xs={12} sm={4}>
            <Item item={item} handleAddToCart={handleAddToCart} />
          </Grid>
        ))}

      </Grid>




    </Wrapper>
  );
}

export default App;
