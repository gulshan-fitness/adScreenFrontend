





import React, { useContext, useState } from 'react'
import { SiRazorpay } from "react-icons/si";
import {
   
    FaMoneyBillWave,
  } from "react-icons/fa";

import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Context } from '../Context_holder';

  
export default function PaymentUI() {
  const images=[ "upilogo.png","mastercardslogo.png","visalogo.png","rupaylogo.png"]

     const {
            SelectedDeliveryAddress,
           
            subTotal,
            UserCart,notify,
            user,usertoken,setUserCart
          } = useContext(Context);
          console.log(SelectedDeliveryAddress);
          

    const [paymentMethod, setpaymentMethod] = useState("razorpay");
  
    const navigator=useNavigate()

    const CartDeleteHandler=()=>{
      if(!user||!usertoken) return
   axios.delete(`${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_CART_URL}delete/${null}/${user?._id}`,{
            headers:{
              authorization:usertoken
            }
                      }
          )
          .then((success) => {

            if (success.data.status === 1 ) {
              
              notify("Payment successful", 1);
              setUserCart([])
              navigator("/")

         }
      
          })
          .catch((error) => {
            console.error('Error:', error);
          });
    }

    const OrderItemsCreate=(orderId)=>{

  if(!usertoken||!user) return


     const products= UserCart?.map(
        data=>{
          return(
            {order_id:orderId,
              user_id:user?._id,
              recipient:SelectedDeliveryAddress?.name,
               contact: SelectedDeliveryAddress?.phone,
              
              ShopProduct_id:data?.ShopProduct_id?._id,
              
                  image: data?.image,
              
                  name: data?.name,
              
                  qty:data?.qty ,
              
                  qtyType: data?.qtyType,
              
                  vendor: data?.vendor?._id,
              
                  totalAmount:
                  data?.fixed_price
                    ? data?.fixed_price
                    : data?.qtyType === "gm"
                    ? (data?.price * data?.qty) / 1000
                    : data?.price * data?.qty
                  ,
              
                 
              paymentmethod:paymentMethod&&paymentMethod,
                  address: {
                    fullAddress: SelectedDeliveryAddress?.place,
                    Buildingname: SelectedDeliveryAddress?.building_name,
                    floor: SelectedDeliveryAddress?.floor,
                    nearbyLandmark: SelectedDeliveryAddress?.nearby_landmark,
                    typeOfAddress:SelectedDeliveryAddress?.selectedAddressType,
                    coordinates: SelectedDeliveryAddress?.coordinates

              
                   
                  },
              
                 
                  
            }

          )}
       
          
          
      )


      const data={
        products,
      }

    


       axios.post(`${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_ORDERITEMS_URL}add`,
      data,{
        headers:{ authorization:usertoken&&usertoken}
      }
      )
      .then((success) => {

        if (success.data.status === 1 ) {
       CartDeleteHandler()
     }
      })
      .catch((error) => {
        console.error('Error:', error);
      });

    }



    const orderhandler=(currency,razorpay_payment_id,paymentStatus,)=>{

          const orderdata={

          user_id:user?._id,
          
              finalAmount:subTotal,
          
              currency: currency,
            
              paymentmethod:paymentMethod,
          
              paymentStatus:paymentStatus, 
          
              transactionId:razorpay_payment_id,
        }


 


      axios.post(`${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_ORDER_URL}add`,
      orderdata,{
        headers:{ authorization:usertoken&&usertoken}
      }
      )
      .then((success) => {

        if (success.data.status === 1 ) {


       OrderItemsCreate( success.data.Order_id)
            
     }
  
     
  
      })
      .catch((error) => {
        console.error('Error:', error);
      });
      
    }

    const transactionHandler=(currency)=>{
      const data={
        user_id: user?._id,
    paymentmethod:paymentMethod,
   
  

  amount: subTotal ,
  currency:currency,
  

      }

     
      
      axios.post(`${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_TRANSATION_URL}add`,
        data
        )
        .then((success) => {
          if (success.data.status === 1 ) {

          
       }
  
        })
        .catch((error) => {
          console.error('Error:', error);
        });

    }

  
    const handlePayment = async () => {
     
      if(paymentMethod=="razorpay"){
        try {
          const data = {
            amount: subTotal,
            currency: "INR",
            user_id: user?._id,
          };
      
          const response = await axios.post(
            `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_RAZORPAY_URL}createorder`,
            data
          );
      
      
          const Order_id= response.data.order.id
          const currency=response.data.order.currency
      
          if (response.data.status === 1) {

            const options = {
              key: import.meta.env.VITE_RAZORPAY_KEY_ID,
              amount: response.data.order.amount,
              currency: currency,
              name: "My E-Commerce Store",
              description: "Test Transaction",
              order_id: Order_id,
      
              /** ✅ Handles successful payments */
              handler: async (response_data) => {

                
    
      
                try {
                  const verifyResponse = await axios.post(
                    `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_RAZORPAY_URL}verifypayment`,
                    {
                      razorpay_order_id: response_data.razorpay_order_id,
                      razorpay_payment_id: response_data.razorpay_payment_id,
                      razorpay_signature: response_data.razorpay_signature,
                      
                    }
                  )

      console.log(verifyResponse);
      

                  if( verifyResponse.data.status==1){

  
                    orderhandler(currency,response_data.razorpay_payment_id,"Paid")

                  }
                 
                } 
                
                
                catch (error) {
                  console.error("Payment verification failed", error);
                  notify("Payment verification failed", 0);
                }


              },
      
          
              prefill: {
                name: "Gulshan Jangid",
                email: "gulshan@example.com",
                contact: "9999999999",
              },
      
              theme: {
                color: "#f6fffa",
              },
            };
      
            const razor = new window.Razorpay(options);
      
            razor.open();
          }
        } catch (error) {
          console.error("Error initiating payment:", error);
          notify("Payment initiation failed", 0);
        }

      }

      else{
        transactionHandler("INR",)
        orderhandler("INR")
      }





};

  return (
   <div className="flex flex-wrap justify-center gap-4 px-4 pb-8">
   {/* Payment Method Selection */}
   <div className="p-4   w-full max-w-sm">
     <h3 className="text-lg font-semibold mb-3">Select Payment Method</h3>
     <div className="space-y-3">
     <label className="flex items-center flex-wrap space-x-2 cursor-pointer p-2 ">

<div className=' flex items-center flex-wrap space-x-2 cursor-pointer'>

<input
                   type="radio"
                   name="paymentMethod"
                   value="razorpay"
                   defaultChecked={paymentMethod == "razorpay"}
                   className="form-radio text-blue-600"
                   onChange={(e) => setpaymentMethod(e.target.value)}
                 />
                 <SiRazorpay className="text-blue-600 text-lg" />
                 <span className="text-gray-700 text-sm md:text-base">
                   {" "}
                   Rzorpay Secure
                 </span>
                 <span className="text-gray-700 text-sm md:text-base block md:inline whitespace-pre-line">
  (UPI, Cards, Wallets, NetBanking)
</span>

</div>

<div className=' flex gap-1 flex-wrap'>
  {
    images?.map(
      (data,index)=> 
      <img key={index} src={"/images/"+data} className=' bg-white w-[50px] h-[30px] p-1 border rounded' alt="" />
    )
  }

 

</div>

              


               </label>
   
               {/* Cash Payment Option */}
               <label className="flex items-center space-x-2 cursor-pointer p-2">
                 <input
                   type="radio"
                   name="paymentMethod"
                   value="cash"
                   defaultChecked={paymentMethod == "cash"}
                   className="form-radio text-green-600"
                   onChange={(e) => setpaymentMethod(e.target.value)}
                 />
                 <FaMoneyBillWave className="text-green-600 text-lg" />
                 <span className="text-gray-700 text-sm md:text-base"> Cash</span>
               </label>
     </div>
   </div>
   
   {/* Order Summary */}
   <div className="w-full max-w-sm p-4 bg-[] rounded-md shadow-md">


     {/* Delivery Address */}
     <h3 className="text-lg font-semibold mb-3">Delivery Address</h3>
     
     <div className="text-gray-700 text-sm space-y-1">
       <p>Place: {SelectedDeliveryAddress?.place}</p>
       <p>Building: {SelectedDeliveryAddress?.building_name}</p>
       {SelectedDeliveryAddress?.floor && <p>Floor: {SelectedDeliveryAddress?.floor}</p>}
       {SelectedDeliveryAddress?.nearby_landmark && <p>Landmark: {SelectedDeliveryAddress?.nearby_landmark}</p>}
       <p>Address Type: {SelectedDeliveryAddress?.selectedAddressType}</p>
       <p>Name: {SelectedDeliveryAddress?.name}</p>
       <p>Phone: {SelectedDeliveryAddress?.phone}</p>
     </div>
   
     {/* Payment Method Confirmation */}
     <div className="mt-4">
       <h3 className="text-lg font-semibold">Payment Method</h3>
       <div className="flex items-center space-x-1 flex-wrap mt-2">
         {paymentMethod === "razorpay" ? (
           <>
             <SiRazorpay className="text-blue-600 text-lg" />
             <span className="text-gray-800 text-sm">Rzorpay Secure</span>
             <span className="text-gray-800 text-sm">(Online)</span>
           </>
         ) : (
           <>
             <FaMoneyBillWave className="text-green-600 text-lg" />
             <span className="text-gray-800 text-sm">Cash</span>
           </>
         )}
       </div>
     </div>
   
     {/* Items List */}
     <h3 className="text-lg font-semibold mt-4">Items</h3>
     <div className="max-h-48 overflow-y-auto mt-2 border rounded-md p-2 bg-gray-50 text-sm">
       {UserCart?.map((item, index) => (
         <div key={index} className="flex flex-wrap  gap-1 items-center justify-between py-2  border-b">
           <img
             src={`${import.meta.env.VITE_API_IMAGE_URL}product_image/${item?.image}`}
             alt={item.name}
             className="w-12 h-12 object-cover rounded-md shadow"
           />
           <div className=" w-24 ">
             <h2 className="font-semibold text-gray-800 text-sm truncate max-w-[80%] ">{item.name}</h2>
   
             <p className="text-gray-700 text-xs">₹ {(item.price || item.fixed_price / item.qty).toFixed(2)} / {item.qtyType=="gm"?"kg":item.qtyType}</p>
             <p className="text-gray-700 text-xs">Qty: {item.qty} {item.qtyType}</p>
           </div>
           <p className="text-sm font-semibold text-gray-900">
             ₹ {item.fixed_price ? item.fixed_price.toFixed(2) : (item.qtyType === "gm" ? ((item.price * item.qty) / 1000).toFixed(2) : (item.price * item.qty).toFixed(2))}
           </p>
         </div>
       ))}
     </div>
   
     {/* Total Price and Action Button */}
    
   </div>
   <div className="w-full px-8 py-2 bg-[#F6FFFA] shadow-[0_-4px_6px_rgba(0,0,0,0.1)] fixed bottom-0 flex justify-between flex-wrap gap-2 items-center mt-4" 
  >
       <p className="text-lg font-semibold text-gray-900  ">Total: ₹ {subTotal} </p>
       <button className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700 transition whitespace-nowrap" onClick={handlePayment}> 
         {paymentMethod === "razorpay" ? "Pay Now" : "Place Order"}
       </button>
     </div>
   </div>
   
  )
}
