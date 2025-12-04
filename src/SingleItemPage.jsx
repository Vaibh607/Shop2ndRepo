import cakedatabase from '../src/cake.json'

import addonsdatabase from '../src/addons.json'
import ItemDisplayCard from "./ItemDisplayCard";
import ItemDiscription from "./ItemDiscription";

import { useState,useEffect } from 'react';
import images from './importAllImages';



const SingleItemPage = ({switchPage,wishlist,toggleWishlist,cart,toggleCart,selectedItem,setSelectedItem}) => {
    
    const bestpickAD = ["AD0001","AD0002","AD0003","AD0004","AD0005","AD0006","AD0007","AD0008","AD0009","AD0010"];



    return(
        <>
            <div className='discription-id'>
                <div className='back-to-catalog' onClick={() => switchPage("catalogue")}>Back to Catalog </div>
                <div className='item-id'>{selectedItem.itemId}</div>
            </div>
            <ItemDiscription switchPage={switchPage}  
            wishlist={wishlist} toggleWishlist={toggleWishlist} cart={cart} toggleCart={toggleCart} 
            selectedItem = {selectedItem} setSelectedItem = {setSelectedItem}/>

            <br/><br/><br/><br/>
            <div className="quick-sample-look">
                <div className="sample-head">
                    <div className='s-head'> Make Your Gift Extra Memorable 🎁</div>
                    <div className="view-all" onClick={()=> {
                    localStorage.setItem("lastCatalogueSection", "addons");
                    switchPage("catalogue")
                    }}> VIEW ALL </div>
                </div>
                <div className="sample-display">
                    {addonsdatabase.filter(item => bestpickAD.includes(item.itemId)).map((cake,index) => (
                        <ItemDisplayCard switchPage={switchPage}  wishlist={wishlist} toggleWishlist={toggleWishlist} cart={cart} toggleCart={toggleCart} 
                                setSelectedItem = {setSelectedItem} item={cake} image={images[cake.itemId]}/>
                    ))};


                </div>
            </div>
            
        </>
    )
}

export default SingleItemPage;