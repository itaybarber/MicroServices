export enum OrderStatus {
  // When the order has been created but
  // the ticket it is trying to order has not been reserved
  Created = 'created', 

  // When the ticket the order is trying to reserve has already been reserved
  // or when user cancelled the order
  // or if order expires before payment
  Cancelled = 'cancelled', 

  // The order has successfully reserved the ticket 
  AWaitingPayment = 'awaiting:payment',

  // The order has reserved the ticket and user has 
  // provided payment successfully
  Complete = 'complete'
  
};