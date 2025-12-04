import flowerdatabase from '../src/flower.json'
import ItemDisplayCard from "./ItemDisplayCard";


import { useState,useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion'
import dropdown from '../src/Images/Icons/dropdown-arrow-white.png'
import { div } from 'framer-motion/client';
import images from './importAllImages';


const FlowerCatalogue = ({switchPage,wishlist,toggleWishlist,cart,toggleCart,setSelectedItem}) => {
    const [activeTab,setActiveTab] = useState(null);

    const [filterType,setFilterType] = useState(null);
    const [filterArrangement,setFilterArrangement] = useState(null);
    const [filterColour,setFilterColour] = useState(null);

    useEffect(() => {
        const savedType = localStorage.getItem("FlowerType");
        const savedArrangement = localStorage.getItem("FlowerArrangement");
        const savedColour = localStorage.getItem("FlowerColour");

        if (savedType) setFilterType(savedType);
        if (savedArrangement) setFilterArrangement(savedArrangement);
        if (savedColour) setFilterColour(savedColour);
    }, []);

    // Save to localStorage when any filter changes
    useEffect(() => {
        if (filterType) { localStorage.setItem("FlowerType", filterType);} 
            else { localStorage.removeItem("FlowerType");}
        if (filterArrangement) { localStorage.setItem("FlowerArrangement", filterArrangement);} 
            else { localStorage.removeItem("FlowerArrangement");}
        if (filterColour) { localStorage.setItem("FlowerColour", filterColour);} 
            else { localStorage.removeItem("FlowerColour");}
    }, [filterType, filterArrangement, filterColour]);

    const TypeOption = ["Rose","Carnation","Orchid","Lily"];
    const ArrangementOption = ["Single Flower","6-12bunch","Basket"];
    const ColourOption = ["Yellow","Red","Blue","White","Purple","Mix"]

    const handleFilterClick = (tabName) => {
        if (activeTab === tabName){
            setActiveTab(null);
        } else {
            setActiveTab(tabName);
        }
    } 
    const handleFilterSelect = (filterTypeo, value) => {
        if (filterTypeo === "type") {
            setFilterType(prev => (prev === value ? null : value));
            setFilterArrangement(null);
            setFilterColour(null);
        } else if (filterTypeo === "arrangement") {
            setFilterType(null);
            setFilterArrangement(prev => (prev === value ? null : value));
            setFilterColour(null);
        } else if (filterTypeo === "colour") {
            setFilterType(null);
            setFilterArrangement(null);
            setFilterColour(prev => (prev === value ? null : value));
        }
    };
    return(
        <div className="cake-catalogue-conatiner">
            <div className="filter-tab-cont">
                <div className="filter-tabs" onClick={() => handleFilterClick("type")}>Flower Type
                    &nbsp;&nbsp;<img src = {dropdown} className='dropdown-arrow' alt="ar"></img>
                </div>
                <div className="filter-tabs" onClick={() => handleFilterClick("arrangement")}>Arrangement
                    &nbsp;&nbsp;<img src = {dropdown} className='dropdown-arrow' alt="ar"></img>
                </div>
                <div className="filter-tabs" onClick={() => handleFilterClick("colour")}>Color Theme
                    &nbsp;&nbsp;<img src = {dropdown} className='dropdown-arrow' alt="ar"></img>
                </div>
            </div>
            <AnimatePresence mode="wait">
                {activeTab === "type" && (
                <motion.div key="type" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.5 }} className="tab-content">
                    <div className='filter-options'>
                        {TypeOption.filter((_, i) => i < Math.ceil(TypeOption.length / 2)).map((type) => (
                            <div key={type} className={`filter-content ${filterType === type ? "filter-content-active" : ""}`} onClick={() => handleFilterSelect("type", type)} > {type} </div>
                        ))}
                    </div>
                    <div className='filter-options'>
                        {TypeOption.filter((_, i) => i >= Math.ceil(TypeOption.length / 2)).map((type) => (
                            <div key={type} className={`filter-content ${filterType === type ? "filter-content-active" : ""}`} onClick={() => handleFilterSelect("type", type)} > {type} </div>
                        ))}
                    </div>
                </motion.div>
                )}

                {activeTab === "arrangement" && (
                <motion.div key="arrangement" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.5 }} className="tab-content">   
                    <div className='filter-options'>
                        {ArrangementOption.filter((_, i) => i < Math.ceil(ArrangementOption.length / 2)).map((arrangement) => (
                            <div key={arrangement} className={`filter-content ${filterArrangement === arrangement ? "filter-content-active" : ""}`} onClick={() => handleFilterSelect("arrangement", arrangement)} > {arrangement} </div>
                        ))}
                    </div>
                    <div className='filter-options'>
                        {ArrangementOption.filter((_, i) => i >= Math.ceil(ArrangementOption.length / 2)).map((arrangement) => (
                            <div key={arrangement} className={`filter-content ${filterArrangement === arrangement ? "filter-content-active" : ""}`} onClick={() => handleFilterSelect("arrangement", arrangement)} > {arrangement} </div>
                        ))}
                    </div>
                </motion.div>
                )}

                {activeTab === "colour" && (
                <motion.div key="colour" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.5 }} className="tab-content">  
                    <div className='filter-options'>
                        {ColourOption.filter((_, i) => i < Math.ceil(ColourOption.length / 2)).map((colour) => (
                            <div key={colour} className={`filter-content ${filterColour === colour ? "filter-content-active" : ""}`} onClick={() => handleFilterSelect("colour", colour)} > {colour} </div>
                        ))}
                    </div>
                    <div className='filter-options'>
                        {ColourOption.filter((_, i) => i >= Math.ceil(ColourOption.length / 2)).map((colour) => (
                            <div key={colour} className={`filter-content ${filterColour === colour ? "filter-content-active" : ""}`} onClick={() => handleFilterSelect("colour", colour)} > {colour} </div>
                        ))}
                    </div>
                </motion.div>
                )}
            </AnimatePresence>
            <div className='filter-text'>
                <div>Applied Filter: {filterType}{filterArrangement}{filterColour}{filterType || filterArrangement || filterColour ? "" : "None"}</div>
                {(filterType || filterArrangement || filterColour) && 
                <div className='remove-filter-btn' onClick={()=>handleFilterSelect("type",null)}>
                    Remove Filter
                </div>}
            </div>
            <div className="item-display-container">
                {flowerdatabase.filter(flower => {
                    const matchType = filterType ? flower.flowerType?.includes(filterType) : true;
                    const matchArrangeent = filterArrangement ? flower.flowerArrangement?.includes(filterArrangement) : true;
                    const matchColour = filterColour ? flower.colourTheme?.includes(filterColour) : true;
                    return matchType && matchArrangeent && matchColour;
                    })
                    .map(flower => (
                        <ItemDisplayCard switchPage={switchPage}  wishlist={wishlist} toggleWishlist={toggleWishlist} cart={cart} toggleCart={toggleCart} 
                            setSelectedItem = {setSelectedItem} item={flower} image={images[flower.itemId]}/>
                    
                    ))
                }
            </div>

        </div>
    );
}

export default FlowerCatalogue


