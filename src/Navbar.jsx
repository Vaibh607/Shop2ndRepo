import Logo from "./Images/Logo/Kanhaa Cake N Flowers Logo.png";
import wishicon from "./Images/Icons/WishlistIcon.png";
import { useState, useEffect } from 'react';

const Navbar = ({switchPage,activePage,wishlist,cart,homeSectionActive}) => {
    const [wishlistAnimation, setWishlistAnimation] = useState(false);
    const [cartAnimation, setCartAnimation] = useState(false);

    // Trigger animation when wishlist length changes
    useEffect(() => {
        setWishlistAnimation(true);
        const timer = setTimeout(() => setWishlistAnimation(false), 600);
        return () => clearTimeout(timer);
    }, [wishlist.length]);

    // Trigger animation when cart length changes
    useEffect(() => {
        setCartAnimation(true);
        const timer = setTimeout(() => setCartAnimation(false), 600);
        return () => clearTimeout(timer);
    }, [cart.length]);
    return (
        <>
        <div className="navigation-bar">
            <div className="nav-top">

            <img src={Logo} alt = "company logo"></img>
                <div className="nav-links">
                    <div className={`nav-link ${activePage === "home" && homeSectionActive !== 'about' ? "active-link" : ""}`} onClick={()=> switchPage("home", activePage === 'home' ? 'homeTop' : 'homeTop')}>
                        Home
                    </div>|
                    <div className={`nav-link ${activePage === "catalogue" ? "active-link" : ""}`} onClick={()=> switchPage("catalogue")}>
                        Catalog 
                    </div>|<div className={`nav-link ${activePage === "home" && homeSectionActive === 'about' ? "active-link" : ""}`} onClick={()=> switchPage("home", activePage === 'home' ? 'about' : 'about')}>
                        About 
                    </div>
                    {/* <div className="nav-link" onClick={()=> switchPage("wishlist")}>
                        Wishlist 
                        </div>|
                        <div className="nav-link" onClick={()=> switchPage("cart")}>
                        Cart 
                        </div> */}
                </div>
            </div>
            <div className="nav-bottom">
                <div className="social-media">

                </div>
                <div className="page-links">
                    <div className={`wishlist-link ${activePage === "wishlist" ? "active-link" : ""} ${wishlistAnimation ? "animate-glow" : ""}`} onClick={()=> switchPage("wishlist")}>
                        Wishlist ({wishlist.length})
                    </div>
                    <div className={`cart-link ${activePage === "cart" ? "active-link" : ""} ${cartAnimation ? "animate-glow" : ""}`} onClick={()=> switchPage("cart")}>
                        Cart ({cart.length})
                    </div>
                </div>
            </div>

        </div>
        </>
    );
}

export default Navbar;