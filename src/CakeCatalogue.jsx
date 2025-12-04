import cakedatabase from '../src/cake.json'
import ItemDisplayCard from "./ItemDisplayCard";

/* Cake Flavours - Pineapple, Vanilla, ButterScotch, Chocolate, Strawberry, MixFruit, Paan, Blueberry, Choco Oreo, Black Forest, Mango, Coffee, Paani Puri, Red Velvet, Nutella,  */

import { useState,useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion'
import dropdown from '../src/Images/Icons/dropdown-arrow-white.png'
import { div } from 'framer-motion/client';
import images from './importAllImages';


const CakeCatalogue = ({switchPage,wishlist,toggleWishlist,cart,toggleCart,setSelectedItem}) => {
    const [activeTab,setActiveTab] = useState(null);

    const [filterFlavour,setFilterFlavour] = useState(null);
    const [filterType,setFilterType] = useState(null);
    const [filterOccasion,setFilterOccasion] = useState(null);

    useEffect(() => {
        const savedFlavour = localStorage.getItem("CakeFlavour");
        const savedType = localStorage.getItem("CakeType");
        const savedOccasion = localStorage.getItem("CakeOccasion");

        if (savedFlavour) setFilterFlavour(savedFlavour);
        if (savedType) setFilterType(savedType);
        if (savedOccasion) setFilterOccasion(savedOccasion);
    }, []);

    // Save to localStorage when any filter changes
    useEffect(() => {
        if (filterFlavour) { localStorage.setItem("CakeFlavour", filterFlavour);} 
            else { localStorage.removeItem("CakeFlavour");}
        if (filterType) { localStorage.setItem("CakeType", filterType);} 
            else { localStorage.removeItem("CakeType");}
        if (filterOccasion) { localStorage.setItem("CakeOccasion", filterOccasion);} 
            else { localStorage.removeItem("CakeOccasion");}
    }, [filterFlavour, filterType, filterOccasion]);

    const flavourOption = ["ButterScotch","Pineapple","Chocolate","RedVelvet","BlackForest","Rasmalai","Gulabjamun","Paan","PaaniPuri","Cheese"];
    const typeOption = ["Normal","TwoTier","FruitCake","Pinnata","MarbleEffect","JarCake","CupCake","Designer","DryCake","HeartShape"];
    const occasionOption = ["Birthday","Anniversary","ValentinesDay","BabyShower","Christmas","MothersDay","FathersDay","TeachersDay","ThemeCake","Kids"];

    const handleFilterClick = (tabName) => {
        if (activeTab === tabName){
            setActiveTab(null);
        } else {
            setActiveTab(tabName);
        }
    } 
    const handleFilterSelect = (filterType, value) => {
        if (filterType === "flavour") {
            setFilterFlavour(prev => (prev === value ? null : value));
            setFilterType(null);
            setFilterOccasion(null);
        } else if (filterType === "type") {
            setFilterFlavour(null);
            setFilterType(prev => (prev === value ? null : value));
            setFilterOccasion(null);
        } else if (filterType === "occasion") {
            setFilterFlavour(null);
            setFilterType(null);
            setFilterOccasion(prev => (prev === value ? null : value));
        }
    };
    return(
        <div className="cake-catalogue-conatiner">
            <div className="filter-tab-cont">
                <div className="filter-tabs" onClick={() => handleFilterClick("flavours")}>Flavours
                    &nbsp;&nbsp;<img src = {dropdown} className='dropdown-arrow' alt="ar"></img>
                </div>
                <div className="filter-tabs" onClick={() => handleFilterClick("caketype")}>Cake Type
                    &nbsp;&nbsp;<img src = {dropdown} className='dropdown-arrow' alt="ar"></img>
                </div>
                <div className="filter-tabs" onClick={() => handleFilterClick("occasion")}>Occasions
                    &nbsp;&nbsp;<img src = {dropdown} className='dropdown-arrow' alt="ar"></img>
                </div>
            </div>
            <AnimatePresence mode="wait">
                {activeTab === "flavours" && (
                <motion.div key="flavour" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.5 }} className="tab-content">
                    <div className='filter-options'>
                        {flavourOption.filter((_, i) => i < Math.ceil(flavourOption.length / 2)).map((flavour) => (
                            <div key={flavour} className={`filter-content ${filterFlavour === flavour ? "filter-content-active" : ""}`} onClick={() => handleFilterSelect("flavour", flavour)} > {flavour} </div>
                        ))}
                    </div>
                    <div className='filter-options'>
                        {flavourOption.filter((_, i) => i >= Math.ceil(flavourOption.length / 2)).map((flavour) => (
                            <div key={flavour} className={`filter-content ${filterFlavour === flavour ? "filter-content-active" : ""}`} onClick={() => handleFilterSelect("flavour", flavour)}>  {flavour}</div>
                        ))}
                    </div>
                </motion.div>
                )}

                {activeTab === "caketype" && (
                <motion.div key="cakeType" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.5 }} className="tab-content">   
                    <div className='filter-options'>
                        {typeOption.filter((_, i) => i < Math.ceil(typeOption.length / 2)).map((type) => (
                            <div key={type} className={`filter-content ${filterType === type ? "filter-content-active" : ""}`} onClick={() => handleFilterSelect("type", type)} > {type} </div>
                        ))}
                    </div>
                    <div className='filter-options'>
                        {typeOption.filter((_, i) => i >= Math.ceil(typeOption.length / 2)).map((type) => (
                            <div key={type} className={`filter-content ${filterType === type ? "filter-content-active" : ""}`} onClick={() => handleFilterSelect("type", type)}>  {type}</div>
                        ))}
                    </div>
                </motion.div>
                )}

                {activeTab === "occasion" && (
                <motion.div key="occasion" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.5 }} className="tab-content">  
                    <div className='filter-options'>
                        {occasionOption.filter((_, i) => i < Math.ceil(occasionOption.length / 2)).map((occasion) => (
                            <div key={occasion} className={`filter-content ${filterOccasion === occasion ? "filter-content-active" : ""}`} onClick={() => handleFilterSelect("occasion", occasion)} > {occasion} </div>
                        ))}
                    </div>
                    <div className='filter-options'>
                        {occasionOption.filter((_, i) => i >= Math.ceil(occasionOption.length / 2)).map((occasion) => (
                            <div key={occasion} className={`filter-content ${filterOccasion === occasion ? "filter-content-active" : ""}`} onClick={() => handleFilterSelect("occasion", occasion)}>  {occasion}</div>
                        ))}
                    </div>
                </motion.div>
                )}
            </AnimatePresence>
            <div className='filter-text'>
                <div>Applied Filter: {filterFlavour}{filterType}{filterOccasion}{filterFlavour || filterType || filterOccasion ? "" : "None"}</div>
                {(filterFlavour || filterType || filterOccasion) && 
                <div className='remove-filter-btn' onClick={()=>handleFilterSelect("type",null)}>
                    Remove Filter
                </div>}
            </div>
            <div className="item-display-container">
                {cakedatabase.filter(cake => {
                    const matchFlavour = filterFlavour ? cake.cakeFlavour?.includes(filterFlavour) : true;
                    const matchType = filterType ? cake.cakeType?.includes(filterType) : true;
                    const matchOccasion = filterOccasion ? cake.occasion?.includes(filterOccasion) : true;
                    return matchFlavour && matchType && matchOccasion;
                    })
                    .map(cake => (
                        <ItemDisplayCard switchPage={switchPage}  wishlist={wishlist} toggleWishlist={toggleWishlist} cart={cart} toggleCart={toggleCart} 
                            setSelectedItem = {setSelectedItem} item={cake} image={images[cake.itemId]}/>
                    
                    ))
                }
            </div>

        </div>
    );
}

export default CakeCatalogue