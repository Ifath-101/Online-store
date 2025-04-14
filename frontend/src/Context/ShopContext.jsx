import React, { createContext, useState, useEffect } from "react";

export const ShopContext = createContext(null);
const getDefaultCart = () => {                          //Initializing a empty cart assuming there
    let cart= {};                                       //there are 300 products in the store
    for (let index=0; index < 300+1; index++){          //for each product id (0-300) the no of items initialized to 0
        cart[index] = 0;
    }
    return cart;
}

//global state for products and cart management
const ShopContextProvider = (props) => {

    const [all_product,settAll_product] = useState([]);

    const [cartItems,setCartItems] = useState(getDefaultCart());

    useEffect(()=>{
        fetch('http://localhost:4000/allproducts')      //.fetch() makes a GET request to the backend
        .then((response)=>response.json())              //Assumes server returns a array of all vaailable products
        .then((data)=>settAll_product(data))            //Parses it and saves it into all_product using the settAll_product state updater

        if(localStorage.getItem('auth-token')){         // checks for a token in the browser’s localStorage
            fetch('http://localhost:4000/getcart',{     //If a user is logged in, there will be an auth-token saved
                method:'POST',                          //If yes → fetch the user's cart from the backend
                headers:{
                    Accept:'application/form-data',         // "I expect JSON back"
                    'auth-token':`${localStorage.getItem('auth-token')}`,           // "Here's my login token"
                    'Content-Type':'application/json',          // "I'm sending JSON"
                },
                body:"",                                       //sending a empty string
            }).then((response)=>response.json())            //converts the response into JSON
            .then((data)=>setCartItems(data));              //The parsed JSON is passed into setCartItems
        }                                                   //updates your app's cart state with the user's saved cart from the backend
    },[])

    const addToCart = (itemId) =>{
        const token = localStorage.getItem('auth-token');
        if(!token) {
            alert("PLease log in to add items to your cart");
            return;
        }

        setCartItems((prev)=>({...prev,[itemId]:prev[itemId]+1}));          //Gets the previous state from the existing cart and updates the count of the newly added item
        if(localStorage.getItem('auth-token')){                                    
            fetch('http://localhost:4000/addtocart',{
                method:'POST',                                          //Sends the added item details to the backend
                headers:{
                    Accept:'application/form-data',
                    'auth-token': `${localStorage.getItem('auth-token')}`,
                    'Content-Type':'application/json',
                },
                body: JSON.stringify({"itemId":itemId}),                //This tells the backend: “Please add this item to the cart for the logged-in user.”
            })
            .then((response)=>response.json())              
            .then((data)=>console.log(data));
        }
    }
    const removeFromCart = (itemId) =>{
        setCartItems((prev)=>({...prev,[itemId]:prev[itemId]-1}));
        if(localStorage.getItem('auth-token')){
            fetch('http://localhost:4000/removefromcart',{
                method:'POST',
                headers:{
                    Accept:'application/form-data',
                    'auth-token': `${localStorage.getItem('auth-token')}`,
                    'Content-Type':'application/json',
                },
                body: JSON.stringify({"itemId":itemId}),
            })
            .then((response)=>response.json())
            .then((data)=>console.log(data));
        }
    }

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for(const item in cartItems){
            if(cartItems[item]>0){
                let itemInfo = all_product.find((product) => product.id===Number(item))
                totalAmount += itemInfo.new_price * cartItems[item];
            }
        }
        return totalAmount;
    };

    const getTotalCartItems= () => {
        let totalItem = 0;
        for(const item in cartItems){
            if(cartItems[item]>0){
                totalItem+=cartItems[item];
            }
        }
        return totalItem;
    };

    const contextValue = {getTotalCartItems,getTotalCartAmount,all_product,cartItems,addToCart,removeFromCart};
    return (
        <ShopContext.Provider value={contextValue}>
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider;