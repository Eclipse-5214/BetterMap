import { m } from "../../mappings/mappings.js"
import DungeonRoomData from "../Data/DungeonRoomData.js"

class Room {

    static SPAWN = 0
    static NORMAL = 1
    static PUZZLE = 2
    static MINIBOSS = 3
    static FAIRY = 4
    static BLOOD = 5
    static UNKNOWN = 6
    static TRAP = 7
    static BLACK = 8 //for wither door only

    static FAILED = -1;
    static UNOPENED = 0;
    static ADJACENT = 1;
    static OPENED = 2;
    static CLEARED = 3;
    static COMPLETED = 4;

    /**
     * Creates a room based on a type, components, and a room id
     * @param {Number} type 
     * @param {Array<Position>} components 
     * @param {String} roomId 
     */
    constructor(type, components, roomId) {
        /**
         * @type {Array<Door>}
         */
        this.adjacentDoors = []

        this.type = type
        this.components = components
        this.rotation = this.findRotation();

        /**
         * -1 -> failed
         * 0 -> not opened / not on the map yet
         * 1 -> adjacent, not opened, but visible on the map
         * 2 -> opened
         * 3 -> white tick
         * 4 -> green tick
         */
        this.checkmarkState = 0

        this.maxSecrets = undefined
        this.currentSecrets = undefined


        //room data from the room id
        this.data = undefined

        this._roomId = roomId
    }

    addComponents(newComponents) {

        let parts = []
        this.components.forEach(c => parts.push(c.arrayX + ',' + c.arrayY));

        this.components.push(newComponents)
        this.rotation = this.findRotation();
    }

    addDoor(newDoor) {
        this.adjacentDoors.push(newDoor);
        this.rotation = this.findRotation()
    }

    findRotation() {
        if (this.type === Room.FAIRY) return 1;
        var minX = -1, maxX = -1, minY = -1, maxY = -1;
        this.components.forEach((c) => {
            if (minX < 0 || c.arrayX < minX)
                minX = c.arrayX;
            if (maxX < 0 || c.arrayX > maxX)
                maxX = c.arrayX;

            if (minY < 0 || c.arrayY < minY)
                minY = c.arrayY;
            if (maxY < 0 || c.arrayY > maxY)
                maxY = c.arrayY;
        });

        let dx = maxX - minX;
        let dy = maxY - minY;

        if (dx > 0 && dy > 0) {
            //2x2
            if (this.components.length === 4) {
                return 1;
            } else if (this.components.length === 3) {
                let parts = [];
                this.components.forEach(c => parts.push(c.arrayX + ',' + c.arrayY));
                if (!parts.includes(minX + ',' + minY)) {
                    return 4;
                } else if (!parts.includes(minX + ',' + maxY)) {
                    return 3;
                } else if (!parts.includes(maxX + ',' + minY)) {
                    return 1;
                } else if (!parts.includes(maxX + ',' + maxY)) {
                    return 2;
                }
                return -1;
                //OH IT'S AN L ROOM
            }
        } else if (dx > 0) {
            return 1;
        } else if (dy > 0) {
            return 2;
        } else {
            let roomX = minX;
            let roomY = minY;
            let doorLocations = []
            this.adjacentDoors.forEach(door => doorLocations.push(door.position.arrayX + ',' + door.position.arrayY));
            let up = doorLocations.includes((roomX + 0.5) + ',' + (roomY));
            let down = doorLocations.includes((roomX + 0.5) + ',' + (roomY + 1));
            let right = doorLocations.includes((roomX + 1) + ',' + (roomY + 0.5));
            let left = doorLocations.includes((roomX) + ',' + (roomY + 0.5));
            //1x1s, check door positions
            if (this.adjacentDoors.length === 4) {
                //do not ask me why
                return 1;
            } else if (this.adjacentDoors.length === 3) {
                if (!doorLocations.includes(roomX + ',' + (roomY + 0.5))) {
                    return 3;
                } else if (!doorLocations.includes((roomX + 1) + ',' + (roomY + 0.5))) {
                    return 1;
                } else if (!doorLocations.includes((roomX + 0.5) + ',' + (roomY))) {
                    return 2;
                } else if (!doorLocations.includes((roomX + 0.5) + ',' + (roomY + 1))) {
                    return 4;
                }
            } else if (this.adjacentDoors.length === 1) {
                //dead end 
                if (right)
                    return 2;
                else if (left)
                    return 4;
                else if (down)
                    return 3;
                else if (up)
                    return 1;

            } else {
                if (up && down) return 2;
                if (left && right) return 1;

                if (left && down) return 1;
                if (up && left) return 2;
                if (up && right) return 3;
                if (right && down) return 4;
            }
        }
        return -1;
    }

    get roomId() {
        return this._roomId
    }
    /**@param {String} value */
    set roomId(value) {
        if (!value) return

        this._roomId = value.trim()
        this.data = DungeonRoomData.getDataFromId(value.trim())

        if (this.data) {
            this.maxSecrets = this.data.secrets
            this.currentSecrets = this.currentSecrets || 0
        }
    }

    setType(type) {
        if (this.roomId) return
        this.type = type
    }
    /**
     * returns true if a room was cleared (at least white checkmark)
     */
    isCleared() {
        //always assume blood is cleared
        if (this.type === Room.BLOOD) return true;

        return this.checkmarkState >= Room.CLEARED;
    }

    getLore() {
        let roomLore = []
        if (this.roomId) { //TODO: COLORS!
            roomLore.push(this.data?.name || '???')
            roomLore.push("&8" + (this.roomId || ""))
            if (this.data?.soul) roomLore.push("&dFAIRY SOUL!")
            if (this.maxSecrets) roomLore.push("Secrets: " + this.currentSecrets + ' / ' + this.maxSecrets)
            if (this.data?.crypts !== undefined && (this.type === Room.NORMAL || this.type === Room.MINIBOSS)) roomLore.push("Crypts: " + this.data.crypts)
            if (this.type === Room.NORMAL) roomLore.push("Spiders: " + (this.data?.spiders ? "Yes" : "No"))
        } else {
            roomLore.push('Unknown room!')
        }

        return roomLore
    }

}

export default Room
