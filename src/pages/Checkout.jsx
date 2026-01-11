import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Check, MapPin, CreditCard, ShoppingBag } from 'lucide-react';
import { createOrder } from '../store/slices/ordersSlice';
import { clearCart } from '../store/slices/cartSlice';
import Button from '../components/UI/Button';
import toast from 'react-hot-toast';

const CheckoutStep = ({ number, title, active, completed }) => (
  <div className={`flex items-center ${active || completed ? 'text-amber-600 dark:text-amber-400' : 'text-gray-400'}`}>
    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center mr-3 transition-colors ${
      completed 
        ? 'bg-amber-500 border-amber-500 text-white' 
        : active 
        ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20' 
        : 'border-gray-300 dark:border-gray-600'
    }`}>
      {completed ? <Check className="h-4 w-4" /> : number}
    </div>
    <span className="font-medium">{title}</span>
  </div>
);

const Checkout = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    pincode: '',
  });
  const [deliveryOption, setDeliveryOption] = useState('delivery');
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, total } = useSelector(state => state.cart);
  const { orderLoading } = useSelector(state => state.orders);

  const steps = [
    { number: 1, title: 'Customer Details' },
    { number: 2, title: 'Delivery Options' },
    { number: 3, title: 'Payment Method' },
    { number: 4, title: 'Confirm Order' },
  ];

  const handleInputChange = (e) => {
    setCustomerInfo({ ...customerInfo, [e.target.name]: e.target.value });
  };

  const validateStep = (step) => {
    switch (step) {
      case 1:
        return customerInfo.name && customerInfo.email && customerInfo.phone;
      case 2:
        return deliveryOption === 'pickup' || (customerInfo.address && customerInfo.city && customerInfo.pincode);
      case 3:
        return true; // Always valid as we only have COD
      case 4:
        return true;
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep) && currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handlePlaceOrder = async () => {
    if (!validateStep(4)) return;

    const orderData = {
      customerInfo,
      items,
      total,
      deliveryOption,
      paymentMethod: 'cod',
    };

    try {
      const result = await dispatch(createOrder(orderData)).unwrap();
      
      // Success
      dispatch(clearCart());
      toast.success('🎉 Order placed successfully!');
      navigate('/orders');
      
    } catch (error) {
      // Error handling - show user-friendly message
      toast.error(error || 'Order failed. Please try again.');
      console.error('Order creation failed:', error);
    }
  };

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Checkout</h1>

      {/* Step Indicator */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-8 shadow-lg">
        <div className="flex flex-col sm:flex-row justify-between space-y-4 sm:space-y-0">
          {steps.map((step) => (
            <CheckoutStep
              key={step.number}
              number={step.number}
              title={step.title}
              active={currentStep === step.number}
              completed={currentStep > step.number}
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            {/* Step 1: Customer Details */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Customer Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={customerInfo.name}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={customerInfo.email}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors"
                      required
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={customerInfo.phone}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Delivery Options */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Delivery Options</h3>
                
                <div className="space-y-4">
                  <label className="flex items-start space-x-3 p-4 border border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <input
                      type="radio"
                      name="deliveryOption"
                      value="delivery"
                      checked={deliveryOption === 'delivery'}
                      onChange={(e) => setDeliveryOption(e.target.value)}
                      className="mt-1 text-amber-600"
                    />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">Home Delivery</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">Cash on Delivery Available</div>
                    </div>
                  </label>
                  
                  <label className="flex items-start space-x-3 p-4 border border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <input
                      type="radio"
                      name="deliveryOption"
                      value="pickup"
                      checked={deliveryOption === 'pickup'}
                      onChange={(e) => setDeliveryOption(e.target.value)}
                      className="mt-1 text-amber-600"
                    />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">Self Pickup</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">Pick up from our store</div>
                    </div>
                  </label>
                </div>

                {deliveryOption === 'pickup' && (
                  <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <MapPin className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="font-medium text-amber-800 dark:text-amber-200">Pickup Address</div>
                        <div className="text-sm text-amber-700 dark:text-amber-300">
                          dingdongcakebake, 12 Main Road, Ooty – 643006<br />
                          Pickup Time: 10 AM – 9 PM
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {deliveryOption === 'delivery' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Address *
                      </label>
                      <textarea
                        name="address"
                        value={customerInfo.address}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors"
                        required={deliveryOption === 'delivery'}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={customerInfo.city}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors"
                        required={deliveryOption === 'delivery'}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Pincode *
                      </label>
                      <input
                        type="text"
                        name="pincode"
                        value={customerInfo.pincode}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors"
                        required={deliveryOption === 'delivery'}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Payment Method */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Payment Method</h3>
                
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
                  <div className="flex items-center space-x-3">
                    <CreditCard className="h-6 w-6 text-green-600 dark:text-green-400" />
                    <div>
                      <div className="font-medium text-green-800 dark:text-green-200">Cash on Delivery</div>
                      <div className="text-sm text-green-700 dark:text-green-300">
                        Pay when your order is delivered to your doorstep or during pickup
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Confirm Order */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Confirm Your Order</h3>
                
                <div className="space-y-4">
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Customer Details</h4>
                    <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                      <div>{customerInfo.name}</div>
                      <div>{customerInfo.email}</div>
                      <div>{customerInfo.phone}</div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Delivery</h4>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      {deliveryOption === 'pickup' ? (
                        <div>Self Pickup from store</div>
                      ) : (
                        <div>
                          <div>Home Delivery</div>
                          <div>{customerInfo.address}</div>
                          <div>{customerInfo.city}, {customerInfo.pincode}</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t dark:border-gray-600">
              {currentStep > 1 && (
                <Button variant="outline" onClick={prevStep}>
                  Previous
                </Button>
              )}
              
              {currentStep < 4 ? (
                <Button
                  onClick={nextStep}
                  disabled={!validateStep(currentStep)}
                  className="ml-auto"
                >
                  Next
                </Button>
              ) : (
                <Button
                  onClick={handlePlaceOrder}
                  loading={orderLoading}
                  disabled={!validateStep(currentStep)}
                  className="ml-auto"
                >
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Place Order
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg sticky top-4">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              Order Summary
            </h3>
            
            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div key={item._id} className="flex justify-between">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">{item.name}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">₹{item.price} × {item.quantity}</div>
                  </div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="border-t dark:border-gray-600 pt-4">
              <div className="flex justify-between text-xl font-bold text-gray-900 dark:text-white">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
              <div className="text-sm text-green-600 dark:text-green-400 mt-1">
                Cash on Delivery
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;