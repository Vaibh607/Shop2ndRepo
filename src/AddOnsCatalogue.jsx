
import addonsdatabase from '../src/addons.json'
import ItemDisplayCard from "./ItemDisplayCard";


import { useState,useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion'
import dropdown from '../src/Images/Icons/dropdown-arrow-white.png'
import { div } from 'framer-motion/client';
import images from './importAllImages';


const AddOnsCatalogue = ({switchPage,wishlist,toggleWishlist,cart,toggleCart,setSelectedItem}) => {
    const [activeTab,setActiveTab] = useState(null);

    const [addonType,setAddonType] = useState(null);
    // const [filterType,setFilterType] = useState(null);
    // const [filterOccasion,setFilterOccasion] = useState(null);

    useEffect(() => {
        const savedAddonType = localStorage.getItem("AddonType");
        // const savedType = localStorage.getItem("CakeType");
        // const savedOccasion = localStorage.getItem("CakeOccasion");

        if (savedAddonType) setAddonType(savedAddonType);
        // if (savedType) setFilterType(savedType);
        // if (savedOccasion) setFilterOccasion(savedOccasion);
    }, []);

    // Save to localStorage when any filter changes
    useEffect(() => {
        if (addonType) { localStorage.setItem("AddonType", addonType);} 
            else { localStorage.removeItem("AddonType");}
        // if (filterType) { localStorage.setItem("CakeType", filterType);} 
            // else { localStorage.removeItem("CakeType");}
        // if (filterOccasion) { localStorage.setItem("CakeOccasion", filterOccasion);} 
            // else { localStorage.removeItem("CakeOccasion");}
    }, [addonType]);

    // const flavourOption = ["ButterScotch","Pineapple","Chocolate","RedVelvet","BlackForest","Rasmalai","Gulabjamun","Paan","PaaniPuri","Cheese"];
    // const typeOption = ["Normal","TwoTier","FruitCake","Pinnata","MarbleEffect","JarCake","CupCake","Designer","DryCake","HeartShape"];
    // const occasionOption = ["Birthday","Anniversary","ValentinesDay","BabyShower","Christmas","MothersDay","FathersDay","TeachersDay","ThemeCake","Kids"];
    const addonTypeOption = ["Soft Toy","Chocolate","Greeting Card","Candle","Cake Topper","Gift"];

    const handleFilterClick = (tabName) => {
        if (activeTab === tabName){
            setActiveTab(null);
        } else {
            setActiveTab(tabName);
        }
    } 
    const handleFilterSelect = (filterType, value) => {
        if (filterType === "addonType") {
            setAddonType(prev => (prev === value ? null : value));
        }
    };
    return(
        <div className="cake-catalogue-conatiner">
            <div className="filter-tab-cont">
                <div className="filter-tabs" onClick={() => handleFilterClick("addonType")}>Addon Type
                    &nbsp;&nbsp;<img src = {dropdown} className='dropdown-arrow' alt="ar"></img>
                </div>
                {/* <div className="filter-tabs" onClick={() => handleFilterClick("caketype")}>Cake Type
                    &nbsp;&nbsp;<img src = {dropdown} className='dropdown-arrow' alt="ar"></img>
                </div> */}
                {/* <div className="filter-tabs" onClick={() => handleFilterClick("occasion")}>Occasions
                    &nbsp;&nbsp;<img src = {dropdown} className='dropdown-arrow' alt="ar"></img>
                </div> */}
            </div>
            <AnimatePresence mode="wait">
                {activeTab === "addonType" && (
                <motion.div key="addonType" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.5 }} className="tab-content">
                    <div className='filter-options'>
                        {addonTypeOption.filter((_, i) => i < Math.ceil(addonTypeOption.length / 2)).map((addOnType) => (
                            <div key={addOnType} className={`filter-content ${addOnType === addonType ? "filter-content-active" : ""}`} onClick={() => handleFilterSelect("addonType", addOnType)} > {addOnType} </div>
                        ))}
                    </div>
                    <div className='filter-options'>
                        {addonTypeOption.filter((_, i) => i >= Math.ceil(addonTypeOption.length / 2)).map((addOnType) => (
                            <div key={addOnType} className={`filter-content ${addOnType === addonType ? "filter-content-active" : ""}`} onClick={() => handleFilterSelect("addonType", addOnType)}>  {addOnType}</div>
                        ))}
                    </div>
                </motion.div>
                )}

                {/* {activeTab === "caketype" && (
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
                )} */}
            </AnimatePresence>
            <div className='filter-text'>
                <div>Applied Filter: {addonType}{addonType ? "" : "None"}</div>
                {(addonType) && 
                <div className='remove-filter-btn' onClick={()=>handleFilterSelect("addonType",null)}>
                    Remove Filter
                </div>}
            </div>
            <div className="item-display-container">
                {addonsdatabase.filter(addon => {
                    const matchAddonType = addonType ? addon.addonType?.includes(addonType) : true;
                    return matchAddonType;
                    })
                    .map(addon => (
                        <ItemDisplayCard switchPage={switchPage}  wishlist={wishlist} toggleWishlist={toggleWishlist} cart={cart} toggleCart={toggleCart} 
                            setSelectedItem = {setSelectedItem} item={addon} image={images[addon.itemId]}/>
                    
                    ))
                }
            </div>

        </div>
    );
}
export default AddOnsCatalogue
