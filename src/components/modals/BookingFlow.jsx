// import React, { useState, useEffect } from 'react';
// import ServiceModal from './ServiceModal';
// import StylistSelectModal from './StylistSelection';
// import TimeSelectionModal from './TimeSelection';
// import CartModal from './CartModal';
// import PaymentModal from './PaymentModal';
// import CategoryMenu from './CategoryMenu'; // Make sure this is imported

// const BookingFlow = ({ onClose, initialService, onBackToCategories }) => {
//   const [currentStep, setCurrentStep] = useState('categories');
//   const [selectedService, setSelectedService] = useState(null);
//   const [selectedStylist, setSelectedStylist] = useState(null);
//   const [selectedDate, setSelectedDate] = useState(null);
//   const [selectedTime, setSelectedTime] = useState(null);
//   const [cartItems, setCartItems] = useState([]);

//   // Enhanced useEffect to handle initialService
//   useEffect(() => {
//     console.log('Initial service in BookingFlow:', initialService);
//     if (initialService) {
//       if (initialService.hasMultipleServices) {
//         // Handle case where we need to show service selection
//         setCurrentStep('service');
//         setSelectedService(null); // Will be set when user selects a service
//       } else {
//         // Single service case
//         setSelectedService(initialService);
//         setCurrentStep('stylist'); // Skip service selection if only one service
//       }
//     } else {
//       // No initial service - start at categories
//       setCurrentStep('categories');
//     }
//   }, [initialService]);

//   const handleAddToCart = (service, stylist, date, time) => {
//     const newCartItem = {
//       service,
//       stylist,
//       date,
//       time,
//       id: `${service.id}-${Date.now()}`
//     };
//     console.log('Adding to cart:', newCartItem);
//     setCartItems([...cartItems, newCartItem]);
//     setCurrentStep('cart');
//   };

//   const handleAddMore = () => {
//     setCurrentStep('categories');
//      setSelectedService(null);
//     setSelectedStylist(null);
//     setSelectedDate(null);
//     setSelectedTime(null);
//   };

//   const renderStep = () => {
//     console.log('Current step:', currentStep);
//     switch(currentStep) {
//       case 'categories':
//         return (
//           <CategoryMenu 
//             onBack={onClose}
//             onSelectService={(service) => {
//               console.log('Service selected from CategoryMenu:', service);
//               if (service.services) {
//                 // Multiple services case
//                 setCurrentStep('service');
//               } else {
//                 // Single service case
//                 setSelectedService(service);
//                 setCurrentStep('stylist');
//               }
//             }}
//           />
//         );
//       case 'service':
//         return (
//           <ServiceModal 
//             services={initialService?.services || []} // Pass all services if available
//             categoryName={initialService?.category_name}
//             onBack={() => initialService ? onClose() : setCurrentStep('categories')}
//             onClose={onClose}
//             onNext={(selectedService) => {
//               console.log('Service selected from ServiceModal:', selectedService);
//               setSelectedService(selectedService);
//               setCurrentStep('stylist');
//             }}
//           />
//         );
//       case 'stylist':
//         if (!selectedService) {
//           console.error('No service selected when reaching stylist step');
//           return setCurrentStep('service');
//         }
//         return (
//           <StylistSelectModal
//             service={selectedService}
//             onBack={() => setCurrentStep('service')}
//             onClose={onClose}
//             onContinue={(stylist) => {
//               setSelectedStylist(stylist);
//               setCurrentStep('time');
//             }}
//           />
//         );
//       case 'time':
//         if (!selectedService || !selectedStylist) {
//           console.error('Missing service or stylist when reaching time step');
//           return setCurrentStep('stylist');
//         }
//         return (
//           <TimeSelectionModal
//             service={selectedService}
//             selectedStylist={selectedStylist}
//             onBack={() => setCurrentStep('stylist')}
//             onClose={onClose}
//             onContinue={(date, time) => {
//               handleAddToCart(selectedService, selectedStylist, date, time);
//             }}
//           />
//         );
//       case 'cart':
//         return (
//           <CartModal
//             cartItems={cartItems}
//             onBack={() => setCurrentStep('time')}
//             onClose={onClose}
//             onAddMore={handleAddMore}
//             onCheckout={() => setCurrentStep('payment')}
//           />
//         );
//       case 'payment':
//         return (
//           <PaymentModal
//             onBack={() => setCurrentStep('cart')}
//             onClose={onClose}
//             onPaymentSuccess={onClose}
//             cartItems={cartItems}
//           />
//         );
//       default:
//         console.error('Unknown step:', currentStep);
//         return setCurrentStep('categories');
//     }
//   };

//   return renderStep();
// };

// export default BookingFlow;