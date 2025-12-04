import cakedatabase from '../src/cake.json'
import addonsdatabase from '../src/addons.json'
import ItemDisplayCard from "./ItemDisplayCard";

import { useState,useEffect } from 'react';
import images from './importAllImages';



const ItemDiscription = ({switchPage,wishlist,toggleWishlist,cart,toggleCart,selectedItem,setSelectedItem}) => {
    
    const weights = selectedItem.itemId.startsWith("CK") ? Object.keys(selectedItem.discountPrice || {})
        .filter(w => selectedItem.discountPrice[w] != null).sort((a, b) => parseFloat(a) - parseFloat(b)):null;  

    const [selectedWeight, setSelectedWeight] = useState(
        selectedItem.itemId.startsWith("CK") 
        ? weights[0]
        : null
    );

    



    return(
        <div className='item-discription-page'>
            <div className='image-view'>
                <img src={images[selectedItem.itemId]} />
            </div>
            <div className='item-discription-container'>
                {selectedItem.itemId.startsWith("CK") && 
                    <>
                    <div className='item-name'>{selectedItem.itemName}</div>
                    <div className='item-price'> Price : &nbsp;
                        <span className='price'>₹{selectedItem.discountPrice[selectedWeight]}</span>
                        &nbsp;&nbsp;
                        <span className='strike-price'>&nbsp;₹{selectedItem.cakePrice[selectedWeight]}&nbsp;</span></div>
                    <div className='cake-weights'>
                    {weights.map((weight) => (
                        <div key={weight} className={`${selectedWeight === weight ? 'selected-weight' : 'un-selected-weight'}`} onClick={() => setSelectedWeight(weight)}>
                            {weight} kg
                        </div>
                    ))}
                    </div>
                    </>
                }
                {selectedItem.itemId.startsWith("FL") && 
                    <>
                    <div className='item-name'>{selectedItem.itemName}</div>
                    <div className='item-price'> Price : &nbsp;
                        <span className='price'>₹{selectedItem.discountPrice}</span>
                        &nbsp;&nbsp;
                        <span className='strike-price'>&nbsp;₹{selectedItem.price}&nbsp;</span>
                    </div>
                    </>
                }
                {selectedItem.itemId.startsWith("AD") && 
                    <>
                    <div className='item-name'>{selectedItem.itemName}</div>
                    <div className='item-price'> Price : &nbsp;
                        <span className='price'>₹{selectedItem.discountPrice}</span>
                        &nbsp;&nbsp;
                        <span className='strike-price'>&nbsp;₹{selectedItem.price}&nbsp;</span>
                    </div>
                    </>
                }
                <div className='wishlist-cart'>
                    {wishlist.includes(selectedItem.itemId) ? (
                        <div className='added-to-wishlist' onClick={() => toggleWishlist(selectedItem.itemId)}> Remove from WishList </div>):(
                        <div className='add-to-wishlist'onClick={() => toggleWishlist(selectedItem.itemId)}> Add to WishList </div>)}
                    {cart.some((list) => list.itemId ===selectedItem.itemId) ? (
                        <div className='added-to-cart' onClick={() => toggleCart(selectedItem.itemId)}> Added to Cart </div>):(
                        <div className='add-to-cart'onClick={() => toggleCart(selectedItem.itemId,selectedWeight)}> Add to Cart </div>)}
                </div>
                <div className='order-on-whatsapp'> Order On WhatsApp </div>
            </div>

            
            
        </div>
        
    )
}

export default ItemDiscription;