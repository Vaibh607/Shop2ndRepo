import cakedatabase from './cake.json'
import flowerdatabase from '../src/flower.json'
import addonsdatabase from '../src/addons.json'
import ItemDisplayCard from "./ItemDisplayCard";
import ItemDiscription from "./ItemDiscription";
import Minus from '../src/Images/Icons/Minus-Icon.jpg'
import Plus from '../src/Images/Icons/Plus-Icon.jpg'
import qrCode from '../src/Images/QR Code/Kanhaa QR.jpg'
import jsPDF from 'jspdf';

import { useState,useEffect, useMemo } from 'react';
import images from './importAllImages';
import { div } from 'framer-motion/client';



const CartPage = ({switchPage,wishlist,toggleWishlist,cart,toggleCart,updateCart}) => {
    const allItems = [...cakedatabase, ...flowerdatabase, ...addonsdatabase];
    const allCakeFlavours = ["Chocolate","Pineapple","Butter Scotch", "Vanilla", "Strawberry","Mix Fruit","Paan","Blueberry"];
    const cartItems = allItems.filter((item) => cart.some((list) => list.itemId ===item.itemId));

    const calculateTotal = () => {
      return cart.reduce((total, cartItem) => {
        const matchedItem = allItems.find(item => item.itemId === cartItem.itemId);    
        if (!matchedItem) return total;
        let itemPrice = 0;
        if (cartItem.itemId.startsWith("CK")) {
          const price = matchedItem.discountPrice?.[cartItem.weight];
          if (price) {
            itemPrice = parseFloat(price) * cartItem.qty;
          }
        } else {
          itemPrice = parseFloat(matchedItem.discountPrice) * cartItem.qty;
        }
        return total + itemPrice;
      }, 0);
    };

    const [occasionType, setOccasionType] = useState("");
    const [customOccasion, setCustomOccasion] = useState("");
    const [senderName, setSenderName] = useState("");
    const [receiverName, setReceiverName] = useState("");
    const [deliveryAddress, setDeliveryAddress] = useState("");
    const [deliveryPincode, setDeliveryPincode] = useState("");
    const [senderPhone, setSenderPhone] = useState("");
    const [receiverPhone, setReceiverPhone] = useState("");
    const [deliveryDate, setDeliveryDate] = useState("");
    const [cardMessage, setCardMessage] = useState("");
    const [deliveryInstructions, setDeliveryInstructions] = useState("");
    // delivery time Format
    const formatTimeRange = (startHour) => {
        const format = (h) => {
          const period = h >= 12 ? "pm" : "am";
          let hour = h % 12;
          if (hour === 0) hour = 12;
          return `${hour}${period}`;
        };
      
        const endHour = (startHour + 1) % 24;
        return `${format(startHour)} - ${format(endHour)}`;
      };
    const DELIVERY_TIERS = [
        { id: "free",  label: "Anytime 9am–9pm (Free)", fee: 0,  slots: null },
        { id: "half",label: "6-hour window (₹20)",   fee: 20, slots: ["9am – 3pm", "3pm – 9pm"] },
        { id: "window",label: "3-hour window (₹50)",   fee: 50, slots: ["9am – 12pm", "12pm – 3pm", "3pm–6pm", "6pm–9pm"] },
        { id: "fixed", label: "Fixed 1-hour slot (₹100)",  fee: 100, slots: Array.from({ length: 12 }, (_, i) => 9 + i).map((hour) => formatTimeRange(hour))}, 
        
      ];
    // delivery time multidropdown 
    const [deliveryTime, setDeliveryTime] = useState(() => {
        const saved = JSON.parse(localStorage.getItem("delivery_detail") || "{}");
        // Backward compatible: if old value was a string, default to free
        if (saved.deliveryTime && typeof saved.deliveryTime === "object") {
          return saved.deliveryTime;
        }
        return { tier: "free", slot: null }; // default
    });
    const handleTierChange = (e) => {
        const nextTier = e.target.value;
        // Reset slot if the new tier doesn't need one
        const tierObj = DELIVERY_TIERS.find(t => t.id === nextTier);
        setDeliveryTime({ tier: nextTier, slot: tierObj?.slots ? tierObj.slots[0] : null });
    };
    const handleSlotChange = (e) => {
        setDeliveryTime(prev => ({ ...prev, slot: e.target.value }));
    };
    const deliveryFee = (DELIVERY_TIERS.find(t => t.id === deliveryTime.tier)?.fee) || 0;
    const grandTotal = calculateTotal() + deliveryFee; // your existing cart total + fee
    const needsSlot = ["window","fixed"].includes(deliveryTime.tier);
    const isDeliveryValid = !needsSlot || !!deliveryTime.slot;
    // Disable place order button if !isDeliveryValid

      
    const [data,setData] = useState(() => {
        const saved = localStorage.getItem('delivery_detail');
        return saved ? JSON.parse(saved) : {};
    });

    useEffect(() => {
        setOccasionType(data.occasionType || "");
        setCustomOccasion(data.customOccasion || "");
        setSenderName(data.senderName || "");
        setReceiverName(data.receiverName || "");
        setDeliveryAddress(data.deliveryAddress || "");
        setDeliveryPincode(data.deliveryPincode || "");
        setSenderPhone(data.senderPhone || "");
        setReceiverPhone(data.receiverPhone || "");
        setDeliveryDate(data.deliveryDate || "");
        setDeliveryTime(data.deliveryTime || "");
        setCardMessage(data.cardMessage || "");
        setDeliveryInstructions(data.deliveryInstructions || "");
    
    }, []); 

    useEffect(() => {
        const updatedData = {
            occasionType,
            customOccasion,
            senderName,
            receiverName,
            deliveryAddress,
            deliveryPincode,
            senderPhone,
            receiverPhone,
            deliveryDate,
            deliveryTime,
            cardMessage,
            deliveryInstructions
        };
        setData(updatedData); 
        localStorage.setItem('delivery_detail', JSON.stringify(updatedData));
    }, [occasionType, customOccasion, senderName, receiverName, deliveryAddress, deliveryPincode, senderPhone, receiverPhone, deliveryDate, deliveryTime, cardMessage, deliveryInstructions]);

    

    // Helper to convert an image URL to a data URL for embedding in the PDF
    const convertImageToDataURL = (url) => {
        return new Promise((resolve, reject) => {
            try {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    canvas.width = img.naturalWidth;
                    canvas.height = img.naturalHeight;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0);
                    try {
                        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
                        resolve({ dataUrl, width: img.naturalWidth, height: img.naturalHeight });
                    } catch (e) {
                        reject(e);
                    }
                };
                img.onerror = reject;
                img.src = url;
            } catch (err) {
                reject(err);
            }
        });
    };

    const addWrappedText = (doc, text, x, y, maxWidth, lineHeight = 6) => {
        const lines = doc.splitTextToSize(text, maxWidth);
        doc.text(lines, x, y);
        return y + lines.length * lineHeight;
    };

    const generatePDF = async () => {
        try {
            const doc = new jsPDF();
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();
            const marginX = 20;
            const marginY = 15;
            let y = marginY;

            // 1. TITLE SECTION
            doc.setFontSize(22);
            doc.setFont(undefined, 'bold');
            doc.text('Kanhaa Cakes - Order Details', pageWidth / 2, y, { align: 'center' });
            y += 15; // Reduced from 30

            // 2. DELIVERY DETAILS SECTION
            doc.setFontSize(18);
            doc.setFont(undefined, 'bold');
            doc.text('Delivery Details', marginX, y);
            y += 10; // Reduced from 20
            doc.setFontSize(12);
            doc.setFont(undefined, 'normal');

            // Two column layout for delivery details
            const colWidth = (pageWidth - marginX * 2 - 20) / 2;
            const leftX = marginX;
            const rightX = marginX + colWidth + 20;
            let yLeft = y;
            let yRight = y;

            const addDeliveryDetail = (label, value, isLeft) => {
                const text = `${label}: ${value || ''}`.trim();
                const lines = doc.splitTextToSize(text, colWidth);
                const blockHeight = lines.length * 6 + 2; // Reduced from 4
                
                if (isLeft) {
                    if (yLeft + blockHeight > pageHeight - marginY - 50) {
                        doc.addPage();
                        yLeft = marginY;
                        yRight = marginY;
                        // Redraw section header
                        doc.setFontSize(16);
                        doc.setFont(undefined, 'bold');
                        doc.text('Delivery Details (continued)', marginX, yLeft);
                        yLeft += 10; // Reduced from 20
                        yRight += 10; // Reduced from 20
                        doc.setFontSize(12);
                        doc.setFont(undefined, 'normal');
                    }
                    doc.text(lines, leftX, yLeft);
                    yLeft += blockHeight;
                } else {
                    if (yRight + blockHeight > pageHeight - marginY - 50) {
                        doc.addPage();
                        yLeft = marginY;
                        yRight = marginY;
                        // Redraw section header
                        doc.setFontSize(16);
                        doc.setFont(undefined, 'bold');
                        doc.text('Delivery Details (continued)', marginX, yRight);
                        yLeft += 10; // Reduced from 20
                        yRight += 10; // Reduced from 20
                        doc.setFontSize(12);
                        doc.setFont(undefined, 'normal');
                    }
                    doc.text(lines, rightX, yRight);
                    yRight += blockHeight;
                }
            };

            // Left column
            addDeliveryDetail("Receiver's Name", receiverName, true);
            addDeliveryDetail("Address", deliveryAddress, true);
            addDeliveryDetail("Pincode", deliveryPincode, true);
            addDeliveryDetail("Sender Phone", senderPhone, true);
            addDeliveryDetail("Receiver Phone", receiverPhone, true);
            addDeliveryDetail("Occasion", occasionType === 'Others' ? customOccasion : occasionType, true);

            // Right column
            addDeliveryDetail("Sender's Name", senderName, false);
            addDeliveryDetail("Delivery Date", deliveryDate, false);
            addDeliveryDetail("Delivery Slot", deliveryTime.tier === "free" ? "Full Day Slot" : deliveryTime.tier === "half" ? "Half Day Slot" : deliveryTime.tier === "window" ? "3-hour Window" :"Fixed Time Delivery", false);
            addDeliveryDetail("Delivery Time", deliveryTime.tier === "free" ? "9am - 9pm" : deliveryTime.slot, false);
            addDeliveryDetail("Delivery Charges", deliveryTime.tier === "free" ? "FREE" : deliveryFee, false);
            if (deliveryInstructions) {
                addDeliveryDetail('Delivery Instructions', deliveryInstructions, false);
            }

            // Continue below the taller column
            y = Math.max(yLeft, yRight) + 5; // Reduced from 20

            // 3. TOTAL AMOUNT SECTION
            doc.setFontSize(16);
            doc.setFont(undefined, 'bold');
            doc.text(`Total Amount: Rs. ${grandTotal.toFixed(2)}`, marginX, y);
            y += 15; // Reduced from 25

            // Check if we need a page break before items
            if (y > pageHeight - marginY - 100) {
                doc.addPage();
                y = marginY;
            }

            // 4. ITEMS SECTION
            doc.setFontSize(16);
            doc.setFont(undefined, 'bold');
            doc.text('Items', marginX, y);
            y += 5; // Reduced from 20

            // Process each item
            for (let i = 0; i < cartItems.length; i++) {
                const item = cartItems[i];
                const cartItem = cart.find((list) => item.itemId === list.itemId);

                // Check if we need a page break
                if (y > pageHeight - marginY - 30) {
                    doc.addPage();
                    y = marginY;
                    doc.setFontSize(16);
                    doc.setFont(undefined, 'bold');
                    doc.text('Items (continued)', marginX, y);
                    y += 15; // Reduced from 20
                    doc.setFontSize(12);
                    doc.setFont(undefined, 'normal');
                }

                // Prepare image
                let imageInfo = null;
                const imageUrl = images[item.itemId];
                try {
                    if (imageUrl) {
                        imageInfo = await convertImageToDataURL(imageUrl);
                    }
                } catch (_) {
                    imageInfo = null;
                }

                // Calculate layout
                const imageSize = 35;
                const textStartX = marginX + (imageInfo ? (imageSize + 15) : 0);
                const textWidth = pageWidth - textStartX - marginX;

                // Item name
                doc.setFontSize(13);
                doc.setFont(undefined, 'bold');
                const nameLines = doc.splitTextToSize(item.itemName, textWidth);
                const nameHeight = nameLines.length * 6;

                // Item details
                doc.setFontSize(12);
                doc.setFont(undefined, 'normal');
                const details = [];
                if (item.itemId.startsWith('CK')) {
                    details.push(`Weight: ${cartItem.weight} kg`);
                    if (cartItem.customFlavour) {
                        details.push(`Custom Flavour: ${cartItem.customFlavour}`);
                    }
                    if (cartItem.CakeMessage) {
                        details.push(`Cake Message: ${cartItem.CakeMessage}`);
                    }
                }
                const unitPrice = item.itemId.startsWith('CK')
                    ? parseFloat(item.discountPrice[cartItem.weight])
                    : parseFloat(item.discountPrice);
                const lineTotal = unitPrice * cartItem.qty;
                details.push(`Quantity: ${cartItem.qty}`);
                details.push(`Unit Price: Rs. ${unitPrice.toFixed(2)}`);
                details.push(`Price: Rs. ${lineTotal.toFixed(2)}`);

                const detailsHeight = details.length * 6;
                const totalItemHeight = Math.max(imageSize, nameHeight + detailsHeight + 6); // Reduced from 10

                // Draw card background
                doc.setFillColor(248, 250, 252);
                doc.rect(marginX - 2, y - 2, pageWidth - 2 * marginX + 4, totalItemHeight + 4, 'F');
                doc.setDrawColor(200, 200, 200);
                doc.rect(marginX - 2, y - 2, pageWidth - 2 * marginX + 4, totalItemHeight + 4);

                // Draw image
                if (imageInfo) {
                    const imgRatio = imageInfo.width / imageInfo.height;
                    let drawW = imageSize;
                    let drawH = imageSize;
                    if (imgRatio >= 1) {
                        drawH = imageSize / imgRatio;
                    } else {
                        drawW = imageSize * imgRatio;
                    }
                    const imgX = marginX + (imageSize - drawW) / 2;
                    const imgY = y + (imageSize - drawH) / 2;
                    doc.addImage(imageInfo.dataUrl, 'JPEG', imgX, imgY, drawW, drawH);
                }

                // Draw text
                let textY = y + 6;
                doc.setTextColor(44, 62, 80);
                
                // Item name
                doc.setFontSize(13);
                doc.setFont(undefined, 'bold');
                doc.text(nameLines, textStartX, textY);
                textY += nameHeight + 2; // Reduced from 4

                // Item details
                doc.setFontSize(12);
                doc.setFont(undefined, 'normal');
                for (const detail of details) {
                    doc.text(detail, textStartX, textY);
                    textY += 5;
                }

                // Move to next item
                y += totalItemHeight + 8; // Reduced from 15
            }

            // 5. CARD MESSAGE SECTION (if provided)
            if (cardMessage) {
                if (y > pageHeight - marginY - 20) {
                    doc.addPage();
                    y = marginY;
                }
                
                doc.setFontSize(14);
                doc.setFont(undefined, 'bold');
                // doc.text('Card Message', marginX, y);
                doc.setLineWidth(0.4); // Thicker line width makes the dashes look like dots
                doc.setLineDash([4, 1], 0); // 1-unit line, 3-unit gap
                doc.line(20, y, 190, y);
                y += 10; // Reduced from 15
                doc.setFontSize(12);
                doc.setFont(undefined, 'normal');
                
                const messageLines = doc.splitTextToSize(cardMessage, pageWidth - marginX * 2);
                doc.text(messageLines, marginX, y);
            }

            // Save PDF
            doc.save('kanhaa-cakes-order.pdf');
        } catch (error) {
            console.error('Failed to generate PDF:', error);
        }
    };

    const CKitem = ({item,image,wishlist,toggleWishlist,cart,toggleCart,updateCart}) => {
        const cartItem = cart.find((list) => item.itemId === list.itemId);
        const weights = item.itemId.startsWith("CK") ? Object.keys(item.discountPrice || {})
            .filter(w => item.discountPrice[w] != null).sort((a, b) => parseFloat(a) - parseFloat(b)):null;  
        const [selectedWeight, setSelectedWeight] = useState(
            item.itemId.startsWith("CK") 
            ? cartItem.weight
            : null
        );
        const [selectQty,setSelectQty] = useState(cartItem.qty);
        const [cakeMessage, setCakeMessage] = useState(cartItem.CakeMessage || "");
        const hasAnyFlavour = Array.isArray(item.cakeFlavour) && item.cakeFlavour.map(f => String(f).toLowerCase()).includes('any');
        const [customFlavor, setCustomFlavor] = useState(cartItem.customFlavour || "");
        useEffect(()=> {
            if (selectQty !== cartItem.qty){
                updateCart(item.itemId,selectQty,selectedWeight,cartItem.CakeMessage, customFlavor || null);
            }
        },[selectQty]);
        const handleAddMessage = () => {
          if (item.itemId.startsWith("CK") && cakeMessage !== cartItem.CakeMessage) {
            updateCart(item.itemId, selectQty, selectedWeight, cakeMessage, customFlavor || null);
          }
        };
        useEffect(()=> {
            if (item.itemId.startsWith("CK")) {
                if (selectedWeight !== cartItem.weight){
                updateCart(item.itemId,selectQty,selectedWeight,cartItem.CakeMessage, customFlavor || null);
                }
            }
        },[selectedWeight]);

        const handleCustomFlavor = () => {
            if (item.itemId.startsWith("CK") && customFlavor !== cartItem.customFlavour) {
              updateCart(item.itemId, selectQty, selectedWeight, cakeMessage, customFlavor || null);
            }
        };

        const CakeMessagePlaceholder = ["Enter Cake message",  "Happy Birthday" , "Happy Anniversary" , "Best Wishes",  "Congratulations",  "Thinking of you" , "Happy Mothers Day"];
        const [placeholderIndex, setPlaceholderIndex] = useState(0);
        useEffect(() => {
            const intervalId = setInterval(() => {
                setPlaceholderIndex((prev) => (prev + 1) % CakeMessagePlaceholder.length);
            }, 5000);
            return () => clearInterval(intervalId);
        }, []);

        
        return(
            <div className='CartItem'>
                <div className="item-details">
                    <div className='image'>
                        <img src={image} />
                    </div>
                    <div className='details'>
                        <div className='item-name'> {item.itemName}</div>
                        {item.itemId.startsWith("CK") &&
                        <>
                        <div className='item-price'> 
                            <span className='price'>₹{item.discountPrice[selectedWeight]*cartItem.qty}</span>
                            &nbsp;&nbsp;
                            <span className='strike-price'>&nbsp;₹{item.cakePrice[selectedWeight]*cartItem.qty}&nbsp;</span>                  
                        </div>
                        <div className='item-weight-head'> 
                            Select Weight: 
                        </div>
                        <div className='item-weight'> 
                            {weights.map((weight) => (
                                <div key={weight} className={`${selectedWeight === weight ? 'selected-weight' : 'un-selected-weight'}`} onClick={() => setSelectedWeight(weight)}>
                                    {weight} kg
                                </div>
                            ))}
                        </div>
                        </>
                        }
                        {item.itemId.startsWith("CK") || 
                            <div className='item-price'> 
                                <span className='price'>₹{item.discountPrice*cartItem.qty}</span>
                                &nbsp;&nbsp;
                                <span className='strike-price'>&nbsp;₹{item.price*cartItem.qty}&nbsp;</span>                  
                            </div>
                        }
                        <div className='item-quantity'> 
                            <span className='qty-head'>  Quantity: </span>
                            <span className='qty-dec' onClick={() => setSelectQty((prev)=> Math.max(prev-1,1))}> <img src={Minus} alt="" /></span>
                            <span className='qty'>  {cartItem.qty}</span>
                            <span className='qty-inc' onClick={() => setSelectQty((prev)=> prev+1)} > <img src={Plus} alt="" /></span>
                        </div>
                        <div className='remove-from-cart' onClick={() => toggleCart(item.itemId)}> 
                            Remove from Cart 🗑️
                        </div>
                    </div>
                </div>
                        {item.itemId.startsWith("CK") && hasAnyFlavour &&
                        <div className="cake-message-section">
                            <label>Custom Flavour <span>(optional)</span>:</label>
                            <select value={customFlavor} onChange={(e) => {
                                setCustomFlavor(e.target.value)
                                }}
                                onBlur={handleCustomFlavor}
                                >
                              {item.cakeFlavour.filter(t => t !== 'any').map(t => (
                                <option key = {t} value={t}> {t} </option>
                              ))}
                              {/* <option value="">Default</option> */}
                              {allCakeFlavours.filter(t => !item.cakeFlavour.includes(t)).map(t => (
                                <option key={t} value={t}>{t}</option>
                              ))}
                            </select>
                        </div>
                        }
                        {item.itemId.startsWith("CK") &&
                        <div className="cake-message-section">
                            <label htmlFor={`message-${item.itemId}`}>Message on Cake<br/><span>(optional)</span>:</label>
                            <input
                              type="text"
                              id={`message-${item.itemId}`}
                              placeholder={CakeMessagePlaceholder[placeholderIndex]}
                              value={cakeMessage}
                              onChange={(e) => setCakeMessage(e.target.value)}
                              maxLength={40} // optional
                              className="cake-message-input"
                              onBlur={handleAddMessage}
                              />
                        </div>
                        }
            </div>
        );
    }

    const [acceptTnC, setAcceptTnC] = useState(false);
    const [confirmDetails, setConfirmDetails] = useState(false);
    const [showCheckboxError, setShowCheckboxError] = useState(false);
    useEffect(() => {
        if (acceptTnC && confirmDetails) {
            setShowCheckboxError(false);
        }
    }, [acceptTnC, confirmDetails]);


    return(
        <>
            <div className='back-to-catalog' onClick={() => switchPage("catalogue")}>Back to Catalog </div>
            {cartItems.map((item) => {
                return(
                <CKitem key={item.itemId} image = {images[item.itemId]}item = {item} wishlist={wishlist} toggleWishlist={toggleWishlist} cart={cart} toggleCart={toggleCart} updateCart= {updateCart}/>
                );
            })}

            <div className='delivery-info-head'> Delivery Details </div>
            <div className='delivery-info-cont'>

                <label className='label-head'>Sender's Name :</label>
                <input className="input-name" type="text" value={senderName} onChange={(e) => setSenderName(e.target.value)} />

                <label className='label-head'>Receiver's Name :</label>
                <input className="input-name" type="text" value={receiverName} onChange={(e) => setReceiverName(e.target.value)} />

                <label className='label-head'>Complete Delivery Address :</label>
                <textarea className="input-delivery" value={deliveryAddress} onChange={(e) => setDeliveryAddress(e.target.value)} />

                <label className='label-head'>Delivery Pincode</label>
                <input inputMode="numeric" pattern="[0-9]*" required maxLength="6" placeholder="Enter 6-digit Pincode" value={deliveryPincode} onChange={(e) => {
                        const value = e.target.value;
                        const numericValue = value.replace(/[^0-9]/g, '');
                        setDeliveryPincode(numericValue);
                    }}  />

                <label className='label-head'>Sender's Phone Number</label>
                <input 
                    type="tel" 
                    placeholder="Enter Sender's Phone No." 
                    value={senderPhone} 
                    onChange={(e) => {
                        const value = e.target.value;
                        // Allow +91 format, spaces, and numbers
                        let numericValue = value.replace(/[^0-9+ ]/g, '');

                        // If user starts with +91, keep it and add space after +91
                        if (numericValue.startsWith('+91')) {
                            // Remove any existing spaces and add proper formatting
                            numericValue = numericValue.replace(/\s/g, '');
                            if (numericValue.length > 3) {
                                numericValue = numericValue.substring(0, 3) + ' ' + numericValue.substring(3);
                            }
                            // Limit to +91 + 10 digits (including space)
                            if (numericValue.length > 14) {
                                numericValue = numericValue.substring(0, 14);
                            }
                        } else if (numericValue.startsWith('91') && numericValue.length > 2) {
                            // If user types 91, convert to +91 with space
                            numericValue = numericValue.replace(/\s/g, '');
                            numericValue = '+91 ' + numericValue.substring(2);
                        } else if (numericValue.length > 10) {
                            // If just numbers, limit to 10 digits
                            numericValue = numericValue.replace(/\s/g, '').substring(0, 10);
                        }

                        setSenderPhone(numericValue);
                    }} 
                />

                <label className='label-head'>Receiver's Phone Number</label>
                <input 
                    type="tel"
                    placeholder="Enter Receiver's Phone No." 
                    value={receiverPhone} 
                    onChange={(e) => {
                        const value = e.target.value;
                        // Allow +91 format, spaces, and numbers
                        let numericValue = value.replace(/[^0-9+ ]/g, '');

                        // If user starts with +91, keep it and add space after +91
                        if (numericValue.startsWith('+91')) {
                            // Remove any existing spaces and add proper formatting
                            numericValue = numericValue.replace(/\s/g, '');
                            if (numericValue.length > 3) {
                                numericValue = numericValue.substring(0, 3) + ' ' + numericValue.substring(3);
                            }
                            // Limit to +91 + 10 digits (including space)
                            if (numericValue.length > 14) {
                                numericValue = numericValue.substring(0, 14);
                            }
                        } else if (numericValue.startsWith('91') && numericValue.length > 2) {
                            // If user types 91, convert to +91 with space
                            numericValue = numericValue.replace(/\s/g, '');
                            numericValue = '+91 ' + numericValue.substring(2);
                        } else if (numericValue.length > 10) {
                            // If just numbers, limit to 10 digits
                            numericValue = numericValue.replace(/\s/g, '').substring(0, 10);
                        }

                        setReceiverPhone(numericValue);
                    }} 
                />

                <label className='label-head'>Delivery Date</label>
                <input type="date" value={deliveryDate} onChange={(e) => setDeliveryDate(e.target.value)} />

                <label className='label-head'>Delivery Time</label>
                <select value={deliveryTime.tier} onChange={handleTierChange}>
                  {DELIVERY_TIERS.map(t => (
                    <option key={t.id} value={t.id}>{t.label}</option>
                  ))}
                </select>
                
                {(() => {
                  const tier = DELIVERY_TIERS.find(t => t.id === deliveryTime.tier);
                  if (!tier?.slots) return null;
                  return (
                    <div className="field">
                      <label className='label-head'>
                        {deliveryTime.tier === "half" ? "Select half day slot" : deliveryTime.tier === "window" ? "Select 3-hour window" :"Select 1-hour slot"}
                      </label> <br/><br/>
                      <select value={deliveryTime.slot || ""} onChange={handleSlotChange}>
                        {tier.slots.map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                  );
                })()}
                

                <label className='label-head'>Occasion</label>
                <select value={occasionType} onChange={(e) => setOccasionType(e.target.value)}>
                  <option value="">Select Occasion</option>
                  <option value="Birthday">Birthday</option>
                  <option value="Anniversary">Anniversary</option>
                  <option value="Congratulations">Congratulations</option>
                  <option value="Others">Others</option>
                </select>

                {occasionType === "Others" && (
                    <input
                    type="text"
                    placeholder="Specify Occasion"
                    value={customOccasion}
                    onChange={(e) => setCustomOccasion(e.target.value)}
                    />
                )}

                <label className='label-head'>Message on Card (optional)</label>
                <textarea
                    className="input-delivery"
                    placeholder="Enter a short message to be printed on the card"
                    maxLength={300}
                    value={cardMessage}
                    onChange={(e) => setCardMessage(e.target.value)}
                />

                <label className='label-head'>Delivery Instructions (optional)</label>
                <textarea value={deliveryInstructions} onChange={(e) => setDeliveryInstructions(e.target.value)} />
            </div>
            <div className='cart-total'>
                <div className='total-label'>Total Amount</div>
                <div className='total-value'>₹{grandTotal}</div>
            </div>
            {/* Add state for checkboxes at the top of your component if not already present */}
            
            <div className="mandatory-checkboxes">
              <div>
                <input
                  id="acceptTnC"
                  type="checkbox"
                  checked={acceptTnC}
                  onChange={e => { setAcceptTnC(e.target.checked); }}
                  required
                />
                <label htmlFor="acceptTnC">
                  I have read and accept all the <span onClick={()=> switchPage("home", "about")}>terms and conditions</span> provided in the About section.
                </label>
              </div>
              <div>
                <input
                  id="confirmDetails"
                  type="checkbox"
                  checked={confirmDetails}
                  onChange={e => { setConfirmDetails(e.target.checked);}}
                  required
                />
                <label htmlFor="confirmDetails">
                  I confirm all the above details entered are correct.
                </label>
              </div>

            </div>
            <div className='instruction'>
                Click on <span> Download PDF Button </span>to download your order summary and send this to us on <a href="https://wa.me/7992419378/">Whatsapp: +91 7992419378 </a>
            </div>
            
            <button className={`${acceptTnC && confirmDetails ? "download-pdf-btn" : "download-pdf-btn-disabled"}`} onClick={acceptTnC && confirmDetails ? generatePDF :() => setShowCheckboxError(true)}>
                Download PDF
            </button>
            {showCheckboxError && (
                <div className="checkbox-error">
                    Please check both boxes before downloading the PDF.
                </div>
            )}

            <div className='payment-qr-code'>
                <div className='qr-code-head'>
                    Scan and Pay: ₹{grandTotal} using QR
                </div>
                <div className='qr-code-image'>
                    <img src={qrCode} alt="Payment QR Code" />
                </div>
            </div>

        </>
    )
}

export default CartPage;