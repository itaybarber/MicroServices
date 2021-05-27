"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Listener = void 0;
var Listener = /** @class */ (function () {
    function Listener(client) {
        this.ackWait = 5 * 1000; // 5 seconds 
        this.client = client;
    }
    Listener.prototype.subscriptionOptions = function () {
        return this.client
            .subscriptionOptions()
            .setDeliverAllAvailable() // The first time our subscription is created, we'll get all messages
            .setManualAckMode(true)
            .setAckWait(this.ackWait)
            .setDurableName(this.queueGroupName);
    };
    Listener.prototype.listen = function () {
        var _this = this;
        var subscription = this.client.subscribe(this.subject, // name of channel: 
        // Queue groud name: (in case we have several instances of the listener and we don't want it to repeat the same)
        // The queue group is also important that we won't lose events from past if listener is down from the setDurableName
        this.queueGroupName, this.subscriptionOptions());
        subscription.on('message', function (msg) {
            console.log("Message received: " + _this.subject + " / " + _this.queueGroupName);
            var parsedData = _this.parseMessage(msg);
            _this.onMessage(parsedData, msg);
        });
    };
    Listener.prototype.parseMessage = function (msg) {
        var data = msg.getData();
        return typeof data === 'string' ? JSON.parse(data) : JSON.parse(data.toString('utf8'));
    };
    return Listener;
}());
exports.Listener = Listener;
