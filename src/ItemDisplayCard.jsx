import cakedatabase from '../src/cake.json'


const ItemDisplayCard = ({switchPage,wishlist,toggleWishlist,cart,toggleCart,setSelectedItem,item,image}) => {
    
    
    if (item.itemId.startsWith("CK")) {
        const cake = item;
        const weights = Object.keys(cake.discountPrice || {})
          .filter(w => cake.discountPrice[w] != null);          // drop nulls (0.5 kg,1 kg for two‑tier)
        const minWeight = weights.sort((a, b) => parseFloat(a) - parseFloat(b))[0]; // 0.5 < 1 < 1.5 …
        const price = cake.cakePrice[minWeight];
        const discountPrice = cake.discountPrice[minWeight];
        const hasAnyFlavour = Array.isArray(item.cakeFlavour) && item.cakeFlavour.map(f => String(f).toLowerCase()).includes('any');


        return (
        <div key={cake.itemId} className="item-card">
            <img src={image} alt={cake.itemId} onClick={() => {setSelectedItem(cake); switchPage("itemdiscription") }}/>
            <div className='cake-name'>{cake.itemName}</div>
            <div className='cake-weight-price'> Price of : &nbsp;&nbsp;<span className='first-weight' onClick={() => {setSelectedItem(cake); switchPage("itemdiscription") }}> {minWeight} kg</span></div>
            <div className='cake-price'> <span className='price'>₹{discountPrice}</span> <span className='strike-price'> &nbsp;₹{price}&nbsp;</span></div>
            {hasAnyFlavour && <div className='customizable-tag'> Customizable in any flavour </div>}
            {wishlist.includes(cake.itemId) ? (
                <div className='added-to-wishlist' onClick={() => toggleWishlist(cake.itemId)}> Added to WishList </div>):(
                <div className='add-to-wishlist'onClick={() => toggleWishlist(cake.itemId)}> Add to WishList </div>)}
            {cart.some((list) => list.itemId ===cake.itemId) ? (
                <div className='added-to-cart' onClick={() => toggleCart(cake.itemId,0.5)}> Added to Cart </div>):(
                <div className='add-to-cart'onClick={() => toggleCart(cake.itemId,weights[0])}> Add to Cart </div>)}
            <div className='order-on-whatsapp'> Order On WhatsApp </div>
        </div>
        );
    }
    else if (item.itemId.startsWith("FL")) {
        const flower = item;
        return (
        <div key={flower.itemId} className="item-card">
            <img src={image} alt={flower.itemId} onClick={() => {setSelectedItem(flower); switchPage("itemdiscription") }}/>
            <div className='cake-name'>{flower.itemName}</div>
            <div className='cake-price'> Price: <span className='price'>₹{flower.discountPrice}</span> <span className='strike-price'> &nbsp;₹{flower.price}&nbsp;</span></div>
            {wishlist.includes(flower.itemId) ? (
                <div className='added-to-wishlist' onClick={() => toggleWishlist(flower.itemId)}> Added to WishList </div>):(
                <div className='add-to-wishlist'onClick={() => toggleWishlist(flower.itemId)}> Add to WishList </div>)}
            {cart.some((list) => list.itemId ===flower.itemId) ? (
                <div className='added-to-cart' onClick={() => toggleCart(flower.itemId)}> Added to Cart </div>):(
                <div className='add-to-cart'onClick={() => toggleCart(flower.itemId)}> Add to Cart </div>)}
            <div className='order-on-whatsapp'> Order On WhatsApp </div>
        </div>
        );
    }
    else if (item.itemId.startsWith("AD")) {
        const addon = item;
        return (
            <div key={addon.itemId} className="item-card">
                <img src={image} alt={addon.itemId} onClick={() => {setSelectedItem(addon); switchPage("itemdiscription") }}/>
            <div className='cake-name'>{addon.itemName}</div>
            <div className='cake-price'> Price: <span className='price'>₹{addon.discountPrice}</span> <span className='strike-price'> &nbsp;₹{addon.price}&nbsp;</span></div>
            {wishlist.includes(addon.itemId) ? (
                <div className='added-to-wishlist' onClick={() => toggleWishlist(addon.itemId)}> Added to WishList </div>):(
                <div className='add-to-wishlist'onClick={() => toggleWishlist(addon.itemId)}> Add to WishList </div>)}
            {cart.some((list) => list.itemId ===addon.itemId) ? (
                <div className='added-to-cart' onClick={() => toggleCart(addon.itemId)}> Added to Cart </div>):(
                <div className='add-to-cart'onClick={() => toggleCart(addon.itemId)}> Add to Cart </div>)}
            <div className='order-on-whatsapp'> Order On WhatsApp </div>
        </div>
        );
    }
}

export default ItemDisplayCard;