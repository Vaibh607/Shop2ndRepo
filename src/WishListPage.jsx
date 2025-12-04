import cakedatabase from './cake.json'
import flowerdatabase from '../src/flower.json'
import addonsdatabase from '../src/addons.json'
import ItemDisplayCard from "./ItemDisplayCard";
import ItemDiscription from "./ItemDiscription";

import { useState,useEffect } from 'react';
import images from './importAllImages';



const WishlistPage = ({switchPage,wishlist,toggleWishlist,cart,toggleCart,setSelectedItem}) => {
    const allItems = [...cakedatabase, ...flowerdatabase, ...addonsdatabase];
    const wishlistItems = allItems.filter(item => wishlist.includes(item.itemId));


    return(
        <>
                <div className='back-to-catalog' onClick={() => switchPage("catalogue")}>Back to Catalog </div>
            {wishlistItems.map(item => (
                <>
                    <div className='item-id'>{item.itemId}</div>
                
                <ItemDiscription switchPage={switchPage}  
                wishlist={wishlist} toggleWishlist={toggleWishlist} cart={cart} toggleCart={toggleCart} 
                selectedItem = {item} setSelectedItem = {setSelectedItem}/>
                </>
            ))
            }
        </>
    )
}

export default WishlistPage;