class WebSocketManager {

    constructor(url) {
        this.users = [];
        this.url = url;
        this.websocket = null;
        this.reconnectInterval = 1000; // 1 second
        this.connect();
    }

    connect() {
        this.websocket = new WebSocket(this.url);
        this.websocket.onopen = () => {
            console.log('WebSocket connected');
        };
        this.websocket.onclose = () => {
            console.log('WebSocket disconnected');
            setTimeout(() => {
                console.log('WebSocket reconnecting...');
                this.connect();
            }, this.reconnectInterval);
        };
        this.websocket.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        this.websocket.onmessage = (event) => {
            this.processMessage(event.data);
        };
    }

    send(x, y) {
        var mouseCoords = {x: x, y: y};
        this.sendString(JSON.stringify(mouseCoords),false);
    }

    sendString(data) {
        if (this.websocket.readyState === WebSocket.OPEN) {
            this.websocket.send(data);
        } else {
            console.error('WebSocket not connected');
        }
    }

    getUsers() {
        return this.users;
    }


    processMessage(messageString){
        var incomingData = JSON.parse(messageString);
        
        // check if user exists if yes update ohterwise create new
        var found = false;
        for(var i = 0; i < this.users.length; i++){
            if(this.users[i].id == incomingData.id){
                this.users[i].updateData(incomingData.x,incomingData.y);
                found = true;
                break;
            }
        }
        if(!found){
            this.users.push(new User(incomingData.id,incomingData.x,incomingData.y));
        }
    
    }

    close() {
        this.websocket.close();
    }
}
