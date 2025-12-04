import Navbar from "./Navbar.jsx"
import Homepage from "./Homepage.jsx"
import Cataloguepage from "./Cataloguepage.jsx";
import SingleItemPage from "./SingleItemPage.jsx";
import WishListPage from "./WishListPage.jsx";
import CartPage from "./CartPage.jsx";
import { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
/*pending Tasks
    PINCODE:

*/

const Web = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [pendingScrollTarget, setPendingScrollTarget] = useState(null);
    const [homeSectionActive, setHomeSectionActive] = useState('home'); // 'home' | 'about'

    // Map old switchPage calls to routes
    const switchPage = (tabName, scrollTarget = null) => {
        if (tabName === 'home') {
            navigate('/');
            if (scrollTarget) setPendingScrollTarget(scrollTarget);
            return;
        }
        if (tabName === 'catalogue') return navigate('/catalogue');
        if (tabName === 'wishlist') return navigate('/wishlist');
        if (tabName === 'cart') return navigate('/cart');
        if (tabName === 'itemdiscription') return navigate('/item');
        // default
        navigate('/');
    }
    //selected item for display
    const [selectedItem,setSelectedItem] = useState(null);
    useEffect(() => {
        console.log(selectedItem);
    }, [selectedItem]);

    // Wishlist
    const [wishlist, setWishlist] = useState(() => {
    const stored = localStorage.getItem("wishlist");
    return stored ? JSON.parse(stored) : [];
    });
    const toggleWishlist = (itemId) => {
        setWishlist((prevWishlist) =>
        prevWishlist.includes(itemId)
            ? prevWishlist.filter((id) => id !== itemId)
            : [...prevWishlist, itemId]
        );
        
    }
    useEffect(() => {
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
    }, [wishlist]);

    // Cart
    const [cart, setCart] = useState(() => {
    const stored = localStorage.getItem("cart");
    return stored ? JSON.parse(stored) : [];
    });

    const toggleCart = (itemId,weight = null, customFlavour = null) => {
        setCart((prevcart) => {
            const exists = prevcart.some(item => item.itemId === itemId );
            if (exists) {
                return prevcart.filter(item => item.itemId !== itemId);
            } else {
                const newItem = itemId.startsWith("CK")
                    ? { itemId: itemId , qty: 1, weight: weight, CakeMessage: "", customFlavour: customFlavour}
                    : { itemId, qty: 1 };

                return [...prevcart, newItem];
            }
        })
    }

    const updateCart = (itemId, qty = 1, weight = null, CakeMessage = "", customFlavour = null) => {
      setCart((prevcart) => {
        const exists = prevcart.find(item => item.itemId === itemId);

        if (!exists) {
            console.log("ERROR occured in cart update");
            return prevcart; // If item doesn't exist, do nothing
        }
        const updatedCart = prevcart.filter(item => item.itemId !== itemId);

        const updatedItem = {
          ...exists,
          qty,
          ...(itemId.startsWith("CK") && { weight, CakeMessage, customFlavour })
        };

        return [...updatedCart, updatedItem];
      });
    };
    
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
        console.log(cart);
    }, [cart]);

    // scrolling behavior when changing pages or on demand
    useEffect(() => {
        const isHome = location.pathname === '/';
        if (!isHome) {
            window.scrollTo({ top: 0, behavior: 'auto' });
            return;
        }
        if (!pendingScrollTarget) return;
        if (pendingScrollTarget === 'homeTop') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else if (pendingScrollTarget === 'about') {
            const el = (document.querySelector('.about-section'));
            if (el) {
                const y = el.getBoundingClientRect().top + window.pageYOffset - 100;
                window.scrollTo({ top: y, behavior: 'smooth' });
            } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }
        setPendingScrollTarget(null);
    }, [location.pathname, pendingScrollTarget]);

    // Track which section is active on the home page for navbar highlighting
    useEffect(() => {
        const isHome = location.pathname === '/';
        if (!isHome) return;
        const handleScroll = () => {
            const aboutEl = document.querySelector('.about-section');
            if (!aboutEl) {
                setHomeSectionActive('home');
                return;
            }
            const triggerY = aboutEl.getBoundingClientRect().top + window.pageYOffset - 120;
            const currentY = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
            if (currentY >= triggerY) {
                setHomeSectionActive('about');
            } else {
                setHomeSectionActive('home');
            }
        };
        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [location.pathname]);

    
    const activePage = (() => {
        const path = location.pathname;
        if (path === '/') return 'home';
        if (path.startsWith('/catalogue')) return 'catalogue';
        if (path.startsWith('/wishlist')) return 'wishlist';
        if (path.startsWith('/cart')) return 'cart';
        if (path.startsWith('/item')) return 'itemdiscription';
        return 'home';
    })();

    return (
        <>
            <Navbar switchPage={switchPage} activePage={activePage} wishlist={wishlist} cart={cart} homeSectionActive={homeSectionActive} />

            <Routes>
                <Route path="/" element={
                    <Homepage
                        switchPage={switchPage}
                        wishlist={wishlist}
                        toggleWishlist={toggleWishlist}
                        cart={cart}
                        toggleCart={toggleCart}
                        setSelectedItem={setSelectedItem}
                    />
                } />
                <Route path="/catalogue" element={
                    <Cataloguepage
                        switchPage={switchPage}
                        wishlist={wishlist}
                        toggleWishlist={toggleWishlist}
                        cart={cart}
                        toggleCart={toggleCart}
                        setSelectedItem={setSelectedItem}
                    />
                } />
                <Route path="/item" element={
                    <SingleItemPage
                        switchPage={switchPage}
                        wishlist={wishlist}
                        toggleWishlist={toggleWishlist}
                        cart={cart}
                        toggleCart={toggleCart}
                        selectedItem={selectedItem}
                        setSelectedItem={setSelectedItem}
                    />
                } />
                <Route path="/wishlist" element={
                    <WishListPage
                        switchPage={switchPage}
                        wishlist={wishlist}
                        toggleWishlist={toggleWishlist}
                        cart={cart}
                        toggleCart={toggleCart}
                        setSelectedItem={setSelectedItem}
                    />
                } />
                <Route path="/cart" element={
                    <CartPage
                        switchPage={switchPage}
                        wishlist={wishlist}
                        toggleWishlist={toggleWishlist}
                        cart={cart}
                        toggleCart={toggleCart}
                        updateCart={updateCart}
                    />
                } />
            </Routes>
        </>
    );
}
 export default Web;