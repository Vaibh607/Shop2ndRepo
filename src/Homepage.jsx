import cakedatabase from '../src/cake.json'
import flowerdatabase from '../src/flower.json'
import addonsdatabase from '../src/addons.json'

import ItemDisplayCard from "./ItemDisplayCard";
import { useState,useEffect } from 'react';

import images from './importAllImages';


const Homepage = ({switchPage,wishlist,toggleWishlist,cart,toggleCart,setSelectedItem}) => {

    
    const bestpickCK = ["CK0001","CK0002","CK0003","CK0004","CK0005","CK0006","CK0007","CK0008","CK0009","CK0010","CK0011","CK0012","CK0013","CK00014","CK0015"];
    const bestpickFL = ["FL0001","FL0002","FL0003","FL0004","FL0005","FL0006","FL0007","FL0008","FL0009","FL0010","FL0011","FL0012","FL0013","FL00014","FL0015"];
    const bestpickAD = ["AD0001","AD0002","AD0003","AD0004","AD0005","AD0006","AD0007","AD0008","AD0009","AD0010"];

    return(
        <>
        {/* <div className="hero-section">
            <h1> Turning Occasions Into Sweet Memories 🎁 </h1>
            <div> We deliver homemade cakes 🍰, fresh flower bouquets 💐, chocolates & gift hampers 🎁 across Dhanbad with free home delivery.</div>
        </div> */}
        <div className='home-head'>
            Kanhaa Cakes N Flowers Dhanbad
        </div>
        {/* Full-Width Sliding Carousel */}
        <div className="carousel-section">
            {(() => {
                // Import carousel images
                const carouselImages = import.meta.glob('../src/Images/Carousel/*.{png,jpg,jpeg}', {
                    eager: true,
                    import: 'default'
                });
                // Get image URLs in a sorted order (by filename)
                const imageList = Object.keys(carouselImages)
                    .sort()
                    .map(key => carouselImages[key]);

                // Carousel state and logic
                const [currentIndex, setCurrentIndex] = useState(0);
                const [touchStart, setTouchStart] = useState(null);
                const [touchEnd, setTouchEnd] = useState(null);
                const [isDragging, setIsDragging] = useState(false);

                useEffect(() => {
                    const interval = setInterval(() => {
                        if (!isDragging) {
                            setCurrentIndex(prev => (prev + 1) % imageList.length);
                        }
                    }, 8000);
                    return () => clearInterval(interval);
                }, [imageList.length, isDragging]);

                const nextSlide = () => {
                    setCurrentIndex(prev => (prev + 1) % imageList.length);
                };

                const prevSlide = () => {
                    setCurrentIndex(prev => (prev - 1 + imageList.length) % imageList.length);
                };

                // Touch handlers
                const handleTouchStart = (e) => {
                    setTouchEnd(null);
                    setTouchStart(e.targetTouches[0].clientX);
                    setIsDragging(true);
                };

                const handleTouchMove = (e) => {
                    setTouchEnd(e.targetTouches[0].clientX);
                };

                const handleTouchEnd = () => {
                    if (!touchStart || !touchEnd) return;
                    
                    const distance = touchStart - touchEnd;
                    const isLeftSwipe = distance > 50;
                    const isRightSwipe = distance < -50;

                    if (isLeftSwipe) {
                        nextSlide();
                    } else if (isRightSwipe) {
                        prevSlide();
                    }
                    
                    setIsDragging(false);
                };

                // Mouse drag handlers
                const handleMouseDown = (e) => {
                    setTouchStart(e.clientX);
                    setIsDragging(true);
                };

                const handleMouseMove = (e) => {
                    if (isDragging) {
                        setTouchEnd(e.clientX);
                    }
                };

                const handleMouseUp = () => {
                    if (!touchStart || !touchEnd) return;
                    
                    const distance = touchStart - touchEnd;
                    const isLeftSwipe = distance > 50;
                    const isRightSwipe = distance < -50;

                    if (isLeftSwipe) {
                        nextSlide();
                    } else if (isRightSwipe) {
                        prevSlide();
                    }
                    
                    setIsDragging(false);
                };

                return (
                    <div className="carousel-container">
                        <div 
                            className="carousel-wrapper"
                            onTouchStart={handleTouchStart}
                            onTouchMove={handleTouchMove}
                            onTouchEnd={handleTouchEnd}
                            onMouseDown={handleMouseDown}
                            onMouseMove={handleMouseMove}
                            onMouseUp={handleMouseUp}
                            onMouseLeave={handleMouseUp}
                        >
                            <div 
                                className="carousel-slides" 
                                style={{ 
                                    transform: `translateX(-${currentIndex * 100}%)`,
                                    transition: isDragging ? 'none' : 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
                                }}
                            >
                                {imageList.map((img, idx) => (
                                    <div key={idx} className="carousel-slide">
                                        <img
                                            src={img}
                                            alt={`Carousel ${idx + 1}`}
                                            className="carousel-image"
                                        />
                                    </div>
                                ))}
                            </div>
                            
                            {/* Navigation Arrows */}
                            {/* <button className="carousel-btn carousel-prev" onClick={prevSlide}>
                                &#8249;
                            </button>
                            <button className="carousel-btn carousel-next" onClick={nextSlide}>
                                &#8250;
                            </button> */}
                            
                            {/* Dots Indicator */}
                            <div className="carousel-dots">
                                {imageList.map((_, idx) => (
                                    <button
                                        key={idx}
                                        className={`carousel-dot ${idx === currentIndex ? 'active' : ''}`}
                                        onClick={() => setCurrentIndex(idx)}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                );
            })()}
        </div>
        
        
        <div className='home-content'> 
            We deliver homemade mouth watering cakes 🍰, fresh flower bouquets 💐, chocolates & gift hampers 🎁 across Dhanbad with FREE home delivery
        </div>
        
        
        <div className='top-picks'>
            Best Picks for you
        </div>
        
        <div className="quick-sample-look">
            <div className="sample-head">
                <div className='s-head'> Bestselling Flavours You Can’t Miss - </div>
                <div className="view-all" onClick={()=> {
                    localStorage.setItem("lastCatalogueSection", "cakes");
                    switchPage("catalogue")
                    }}> VIEW ALL </div>
            </div>
            <div className="sample-display">
                {cakedatabase.filter(item => bestpickCK.includes(item.itemId)).map((cake,index) => (
                    <ItemDisplayCard switchPage={switchPage}  wishlist={wishlist} toggleWishlist={toggleWishlist} cart={cart} toggleCart={toggleCart} 
                            setSelectedItem = {setSelectedItem} item={cake} image={images[cake.itemId]}/>
                ))};


            </div>
        </div>
        <div className="quick-sample-look">
            <div className="sample-head">
                <div className='s-head'> Our Most Loved Bouquets - </div>
                <div className="view-all" onClick={()=> {
                    localStorage.setItem("lastCatalogueSection", "flowers");
                    switchPage("catalogue")
                    }}> VIEW ALL </div>
            </div>
            <div className="sample-display">
                {flowerdatabase.filter(item => bestpickFL.includes(item.itemId)).map((cake,index) => (
                    <ItemDisplayCard switchPage={switchPage}  wishlist={wishlist} toggleWishlist={toggleWishlist} cart={cart} toggleCart={toggleCart} 
                            setSelectedItem = {setSelectedItem} item={cake} image={images[cake.itemId]}/>
                ))};


            </div>
        </div>
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
                {/* Pending task: also add contact details in about section */}
        <div className='about-section'>
            
                <div className="about-head">
                    About Kanhaa Cakes N Flowers
                </div>
                <div className="about-cont">
                    Fresh, Homemade, Heartfelt, <br/>
                    Kanhaa Cakes N Flowers is a homegrown bakery & gifting studio based in Dhanbad by <span className="about-subhead">Priyanka Dalmia</span>, dedicated to making every celebration sweeter and every surprise more memorable. We bake fresh, made-to-order cakes and craft beautiful bouquets, chocolate arrangements and customized hampers — all with love, clean kitchen practices, and a local-first approach.
                </div>

                <div className="about-head">
                    What We Make
                </div>
                <div className="about-cont">
                    <span className="about-subhead"> Fresh homemade cakes — </span>classic, dry, designer and tiered cakes (made to your weight/size). <br/>
                    <span className="about-subhead"> Unique regional & experimental flavours — </span>examples: pan, rasmalai, panipuri, and more (tell us your idea!). <br/>
                    <span className="about-subhead"> Cupcakes & party packs — </span>single-serve joy for any event. <br/>
                    <span className="about-subhead"> Homemade chocolates & chocolate bunches — </span>individual chocolates and creative bunches (Dairy Milk, Five Star, KitKat and similar included on request). <br/>
                    <span className="about-subhead"> Chocolate bouquets, cake toppers, candles & greeting cards — </span>ready-to-gift add-ons. <br/>
                    <span className="about-subhead"> Custom hampers & corporate gifting — </span>bespoke combos for festivals, employee appreciation, or client gifts. <br/>
                    <span className="about-subhead"> Fresh flower bouquets — </span>handmade floral arrangements to pair with cakes or stand-alone.
                </div>
                
                <div className="about-head">
                    How to order
                </div>
                <div className="about-cont">
                    We’ve made ordering from Kanhaa Cakes N Flowers simple, transparent, and mobile-friendly. Please follow these steps carefully so your order is processed smoothly:
                    WhatsApp: <span className="about-subhead">7992419378 </span><br/>
                    <span className="about-subhead">Step-by-Step Ordering Process</span><br/>
                    <span className="about-subhead">Step: 1- </span> Browse & Select – Explore our website and add your favorite cakes, bouquets, chocolates, or hampers to the cart. <br/>
                    <span className="about-subhead">Step: 2- </span> Download Order Summary – Once your cart is ready, download the PDF summary of your order directly from the website. <br/>
                    <span className="about-subhead">Step: 3- </span> Send Order on WhatsApp – Share the order summary PDF on our WhatsApp number: 7992419378. <br/>
                    {/* <span className="about-subhead">Step: 4- </span> Confirmation – Our team will review your order and confirm availability/designs with you. <br/> */}
                    <span className="about-subhead">Step: 4- </span> Payment – Once confirmed, please make the payment via UPI and share a screenshot of the payment with us on WhatsApp. <br/>
                    <span className="about-subhead">Step: 5- </span> Order Accepted – After payment verification, you will be confirmed of acceptance of your order by us on WhatsApp.
                </div>

                <div className="about-head">
                    Terms and Conditions: 
                </div>
                <div className="about-cont">
                    ✅ <span className="about-subhead">Free Delivery – </span>Applicable only for full-time delivery slots and if your address is within 10 km radius from Bank More, Dhanbad. <br/>
                    📅 <span className="about-subhead">Order in Advance – </span>Please place your order at least one day before your delivery date. That doesn't mean that order will be prepared in advance,it will be prepapred same day of delivery date. <br/>
                    🔪 <span className="about-subhead">Complimentry – </span> Knifes and Candles are complimentary with cake.<br/>
                    <span className="about-subhead">Product Images – </span> All cake and bouquet images displayed on our website are for illustration purposes only. The actual product may slightly vary in design, color, shape, or decoration, depending on availability and the artisan’s creativity. <br/>
                    <span className="about-subhead">Delivery Timings – </span> We strive to deliver orders within the chosen time slot. However, slight delays may occur due to traffic, weather, or unforeseen conditions. If we failed to deliver on your choosen time slot, you will get refund of your delivery charges.<br/>
                    <span className="about-subhead">Cancellation – </span> Cancellation of order is not allowed after the order is confirmed. However, if you want to cancel the order, you can do so by contacting us on WhatsApp. <br/>
                    <span className="about-subhead">Refunds – </span> Cancellations and refunds are accepted only before 6 hrs before starting of delivery time slot. Once the order is in progress, refunds or changes are not possible.
                    <span className="about-subhead">Privacy – </span> Your personal information is kept confidential and will not be shared with any third party. <br/>

                    We reserve the right to cancel any order after acceptance due to any curcumstances and you will get your money refunded.
                    
                    {/* 💰 <span className="about-subhead">Minimum Order Value – </span> Orders below ₹500 (before delivery charges if any) will not be accepted. <br/> */}
                </div>

                <div className="about-head">
                    Quality, safety & special requests
                </div>
                <div className="about-cont">
                    At Kanhaa Cakes N Flowers, we take pride in delivering products that are not only delicious but also safe, hygienic, and trustworthy. Every order is prepared in a clean, home-based kitchen where quality is never compromised.
                    <br/><span className="about-subhead">Our Commitment to Quality: </span><br/> 
                    Always Fresh, Never Stored – All cakes, chocolates, and hampers are made-to-order. We do not keep ready-made stock, ensuring freshness in every bite. <br/>
                    {/* Premium Ingredients – We use high-quality flour, butter, chocolate, fresh cream, and natural flavors. No shortcuts, no stale ingredients. <br/> */}
                    Safe Kitchen Practices – Utensils, surfaces, and packaging are kept clean and sanitized to maintain safety and quality. <br/>
                    <span className="about-subhead">100% Eggless Guarantee 🟢 </span> <br/>
                    We proudly deliver only eggless cakes — suitable for all occasions, cultural preferences, and family-friendly gatherings. You can be confident that every cake, from a simple dry cake to a designer tier creation, is completely egg-free.
                    <br/> <span className="about-subhead"> Personalisation & Dietary Requests </span> <br/>
                    Allergy-Friendly Options – If you or your guests are sensitive to nuts, gluten, or dairy, please mention this clearly at the time of ordering so we can guide you on safe choices.
                    Sugar-Free / Vegan Requests – Available on select items with advance notice.
                    Custom Designs – We can include personal messages, themes, toppers, or colour schemes to make your celebration unique.
                </div>

                <div className="about-head">
                    Packaging & Delivery Safety
                </div>
                <div className="about-cont">
                    Cakes and bouquets are packed securely to arrive in perfect condition. <br/>
                    Eco-friendly and premium packaging available on request. <br/>
                    Delivery is handled with care to maintain freshness and presentation.
                </div>

                <div className="about-head">
                    Why customers choose us
                </div>
                <div className="about-cont">
                    <span className="about-subhead"> Homemade freshness — </span>we bake per order to ensure maximum taste and shelf-life. <br/>
                    <span className="about-subhead"> Creative, customised designs — </span>designer cakes, themed toppers, tier cakes and quirky flavour requests welcome. <br/>
                    <span className="about-subhead"> Personalisation options — </span>choose weight, add a custom message, select packaging, or request special dietary options. <br/>
                    <span className="about-subhead"> Free delivery — </span> across Dhanbad district within 8km raduis of Bank More <br/>
                    <span className="about-subhead"> Mobile-first, WhatsApp ordering — </span>quick, simple ordering experience built for phones.
                </div>
                
                <div className="about-head">
                    Events & bulk orders
                </div>
                <div className="about-cont">
                    Weddings, college functions, corporate events, and large parties — we handle bulk and recurring orders with prior notice. For event quotations, please share date, guest count and design references via WhatsApp
                </div>
                <div className="about-head">
                    
                </div>
                <div className="about-cont">
                    
                </div>
        </div>
        </>

    );
}

export default Homepage
