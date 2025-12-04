import { useState,useEffect } from 'react';

import CakeCatalogue from "./CakeCatalogue";
import FlowerCatalogue from "./FlowerCatalogue";
import AddOnsCatalogue from "./AddOnsCatalogue";


const Cataloguepage = ({switchPage,wishlist,toggleWishlist,cart,toggleCart,setSelectedItem}) => {
    const [activeSection,setActiveSection] = useState("cakes");

    useEffect(() => {
    const savedSection = localStorage.getItem("lastCatalogueSection");
        if (savedSection) setActiveSection(savedSection);
    }, []);

    const handleSectionClick = (tabName) => {
        setActiveSection(tabName);
        localStorage.setItem("lastCatalogueSection", tabName);
    };    
    useEffect(() => {
      const handleScroll = () => {
        localStorage.setItem(`scrollY_catalog`, window.scrollY);
      };
      window.addEventListener("scroll", handleScroll);
      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    }, [activeSection]);
    useEffect(() => {
      const savedScroll = localStorage.getItem(`scrollY_catalog`);
      if (savedScroll !== null) {
        window.scrollTo(0, parseInt(savedScroll));
      }
    }, [activeSection]);


    return(
        <div className="catalogue-page">
            <div className="catalogue-head">
                You Can Browse your catalogue here with filters of your choice
                and Order it using order on whatsapp button
            </div>
            <div className="catalogue-display-container">
                <div className="catalogue-display-head">
                    <div className={`display-tabs + ${activeSection === "cakes" ?"display-tabs-act":""}`}onClick={() => handleSectionClick("cakes")}> Cakes</div>
                    <div className={`display-tabs + ${activeSection === "flowers" ?"display-tabs-act":""}`}onClick={() => handleSectionClick("flowers")}> Flowers</div>
                    <div className={`display-tabs + ${activeSection === "addons" ?"display-tabs-act":""}`}onClick={() => handleSectionClick("addons")}> Add-Ons</div>
                </div>
                {activeSection === "cakes" && <CakeCatalogue switchPage={switchPage}  wishlist={wishlist} toggleWishlist={toggleWishlist} cart={cart} toggleCart={toggleCart} setSelectedItem = {setSelectedItem}/>}
                {activeSection === "flowers" && <FlowerCatalogue switchPage={switchPage}  wishlist={wishlist} toggleWishlist={toggleWishlist} cart={cart} toggleCart={toggleCart} setSelectedItem = {setSelectedItem}/>}
                {activeSection === "addons" && <AddOnsCatalogue switchPage={switchPage}  wishlist={wishlist} toggleWishlist={toggleWishlist} cart={cart} toggleCart={toggleCart} setSelectedItem = {setSelectedItem}/>}
            
            </div>
            <div></div>
            

        </div>
    );
}
export default Cataloguepage