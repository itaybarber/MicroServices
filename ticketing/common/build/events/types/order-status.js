"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderStatus = void 0;
var OrderStatus;
(function (OrderStatus) {
    // When the order has been created but
    // the ticket it is trying to order has not been reserved
    OrderStatus["Created"] = "created";
    // When the ticket the order is trying to reserve has already been reserved
    // or when user cancelled the order
    // or if order expires before payment
    OrderStatus["Cancelled"] = "cancelled";
    // The order has successfully reserved the ticket 
    OrderStatus["AWaitingPayment"] = "awaiting:payment";
    // The order has reserved the ticket and user has 
    // provided payment successfully
    OrderStatus["Complete"] = "complete";
})(OrderStatus = exports.OrderStatus || (exports.OrderStatus = {}));
;
