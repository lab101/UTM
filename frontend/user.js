class User {
    constructor(id, x, y) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.lastUpdate = Date.now();
    }

    updateData(x, y) {
        this.x = x;
        this.y = y;
        this.lastUpdate = Date.now();
    }
    
    getTimeDiv(){
        return Date.now() - this.lastUpdate;
    }

}
