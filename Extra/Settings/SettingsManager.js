import SoopyOpenGuiEvent from "../../../guimanager/EventListener/SoopyOpenGuiEvent";
import Door from "../../Components/Door";
import DungeonMap from "../../Components/DungeonMap";
import MapPlayer from "../../Components/MapPlayer";
import Room from "../../Components/Room";
import MapRenderer from "../../Render/MapRenderer";
import RenderContext from "../../Render/RenderContext";
import RenderContextManager from "../../Render/RenderContextManager";
import Position from "../../Utils/Position";
import { Checkmark } from "../../Utils/Utils";
import SettingGui from "./SettingGui";
const AbstractClientPlayer = Java.type("net.minecraft.client.entity.AbstractClientPlayer")

class SettingsManager {

    /**
     * @param {RenderContextManager} renderContextManager 
     */
    constructor(renderContextManager) {
        this.renderContextManager = renderContextManager

        this.currentSettings = RenderContext.addMissing(JSON.parse(FileLib.read("soopyAddonsData", "bettermapsettings.json") || "{}") || {})

        /**
         * @type {Map<RenderContext, Object>}
         */
        this.renderContexts = new Map()

        let mapRenderer = new MapRenderer()
        mapRenderer.tabs = [mapRenderer.tabs[0]] // Only show the dungeon tab

        this.fakeDungeon = this.createFakeDungeon()

        this.settingRenderContext = this.createRenderContext({ currentRoomInfo: "none", hideInBoss: false, playerNames: "always" })

        this.settingsGui = new SettingGui(this.currentSettings, this.fakeDungeon, this.renderContextManager.getRenderContextData(this.settingRenderContext), mapRenderer)

        this.settingsGui.changed = (key, val) => {
            this.currentSettings[key] = val

            this.saveSettings()

            for (let contextData of this.renderContexts.entries()) {
                let [context, settingOverrides] = contextData

                let data = this.renderContextManager.getRenderContextData(context)

                data.setSettings({ ...this.currentSettings, ...settingOverrides })

                data.markReRender()
            }

            this.settingsGui.onSettingChangeFunctions.forEach(f => f())
        }

        this.settingsGui.changedArr = (key, index, val) => {
            if (isNaN(val)) this.currentSettings[key][index] = 0;
            else this.currentSettings[key][index] = val;

            this.saveSettings()

            for (let contextData of this.renderContexts.entries()) {
                let [context, settingOverrides] = contextData

                let data = this.renderContextManager.getRenderContextData(context)

                data.setSettings({ ...this.currentSettings, ...settingOverrides })

                data.markReRender()
            }
            this.settingsGui.onSettingChangeFunctions.forEach(f => f())
        }

        let a = register("worldLoad", () => {
            if (this.addPlayersToDungeonPreview(this.fakeDungeon))
                a.unregister()
        })

        register("renderOverlay", () => {
            this.settingsGui.renderOverlay()
        })
    }

    saveSettings() {
        new Thread(() => {
            FileLib.write("soopyAddonsData", "bettermapsettings.json", JSON.stringify(this.currentSettings))
        }).start()
    }

    /**
     * Creates a render context from the users currrent settings
     * Also adds the render context to a local list to get the settings modified if a setting is changed in the settings menu
     * @param {import("../../Render/RenderContext").ContextSettings} settingOverrides
     * @returns {Number}
     */
    createRenderContext(settingOverrides = {}) {
        let context = this.renderContextManager.createRenderContext({ ...this.currentSettings, ...settingOverrides })

        this.renderContexts.set(context, settingOverrides)

        this.renderContextManager.getRenderContextData(context).onDestroy(() => {
            this.renderContexts.delete(context)
        })

        return context
    }

    /**
     * Creates a fake dungeon map used to render the dungeon in the settings gui
     * 
     * AUTOGENERATED CODE, see ./LoadSettingMap.js
     * @returns {DungeonMap}
     */
    createFakeDungeon() {
        let dungeon = new DungeonMap("F7", new Set(), false);
        // [Room, secrets, checkmarkState]
        const rooms = [
            [new Room(dungeon, Room.SPAWN, [new Position(-168, -200)], "102,66"), 0, Checkmark.GREEN],
            [new Room(dungeon, Room.NORMAL, [new Position(-168, -168), new Position(-168, -136), new Position(-136, -136)], "1050,-524"), 2, Checkmark.WHITE],
            [new Room(dungeon, Room.NORMAL, [new Position(-136, -104)], "498,-240"), 0, Checkmark.WHITE],
            [new Room(dungeon, Room.PUZZLE, [new Position(-104, -136)], "-60,-600"), 0, Checkmark.GREEN],
            [new Room(dungeon, Room.NORMAL, [new Position(-104, -104)], "246,-60"), 0, Checkmark.NONE],
            [new Room(dungeon, Room.FAIRY, [new Position(-136, -72)], "462,-312"), 0, Checkmark.GREEN],
            [new Room(dungeon, Room.BLOOD, [new Position(-200, -72)], undefined), undefined, Checkmark.NONE],
            [new Room(dungeon, Room.NORMAL, [new Position(-200, -40), new Position(-168, -40), new Position(-136, -40)], "530,-420"), 0, Checkmark.WHITE],
            [new Room(dungeon, Room.NORMAL, [new Position(-136, -200), new Position(-104, -200), new Position(-136, -168), new Position(-104, -168)], "166,-592"), 1, Checkmark.WHITE],
            [new Room(dungeon, Room.NORMAL, [new Position(-72, -168)], "66,-276"), 1, Checkmark.GREEN],
            [new Room(dungeon, Room.PUZZLE, [new Position(-72, -200)], "-96,-168"), 0, Checkmark.NONE],
            [new Room(dungeon, Room.NORMAL, [new Position(-40, -168)], "66,-240"), 0, Checkmark.WHITE],
            [new Room(dungeon, Room.PUZZLE, [new Position(-40, -200)], "-60,-564"), 0, Checkmark.NONE],
            [new Room(dungeon, Room.NORMAL, [new Position(-72, -136), new Position(-40, -136)], "574,-384"), 3, Checkmark.GREEN],
            [new Room(dungeon, Room.NORMAL, [new Position(-72, -104), new Position(-72, -72), new Position(-104, -72)], "438,-524"), 0, Checkmark.NONE],
            [new Room(dungeon, Room.NORMAL, [new Position(-40, -104), new Position(-40, -72), new Position(-40, -40)]), 0, Checkmark.WHITE],
            [new Room(dungeon, Room.UNKNOWN, [new Position(-104, -40)], undefined), undefined, Checkmark.GRAY],
            [new Room(dungeon, Room.MINIBOSS, [new Position(-72, -40)], "174,66"), 0, Checkmark.GREEN],
            [new Room(dungeon, Room.NORMAL, [new Position(-200, -200), new Position(-200, -168), new Position(-200, -136), new Position(-200, -104)], "30,-456"), 0, Checkmark.WHITE],
            [new Room(dungeon, Room.NORMAL, [new Position(-168, -104)], "174,-132"), 0, Checkmark.WHITE],
            [new Room(dungeon, Room.TRAP, [new Position(-168, -72)], "-312,30"), 1, Checkmark.WHITE],
        ]
        rooms.forEach(([room, secrets, checkmarkState]) => {
            room.secrets = secrets
            room.checkmarkState = checkmarkState
            dungeon.addRoom(room)
        })

        const doors = [
            new Door(Room.NORMAL, new Position(-157, -173), false),
            new Door(Room.NORMAL, new Position(-156, -172), false),
            new Door(Room.NORMAL, new Position(-172, -156), true),
            new Door(Room.NORMAL, new Position(-140, -156), true),
            new Door(Room.PUZZLE, new Position(-108, -124), true),
            new Door(Room.NORMAL, new Position(-124, -108), false),
            new Door(Room.NORMAL, new Position(-108, -92), true),
            new Door(Room.FAIRY, new Position(-124, -76), false),
            new Door(Room.NORMAL, new Position(-124, -44), false),
            new Door(Room.BLOOD, new Position(-188, -44), false),
            new Door(Room.NORMAL, new Position(-76, -156), true),
            new Door(Room.PUZZLE, new Position(-60, -172), false),
            new Door(Room.NORMAL, new Position(-44, -156), true),
            new Door(Room.PUZZLE, new Position(-28, -172), false),
            new Door(Room.NORMAL, new Position(-28, -140), false),
            new Door(Room.NORMAL, new Position(-60, -108), false),
            new Door(Room.NORMAL, new Position(-28, -108), false),
            new Door(Room.UNKNOWN, new Position(-92, -44), false),
            new Door(Room.MINIBOSS, new Position(-60, -44), false),
            new Door(Room.NORMAL, new Position(-172, -92), true),
            new Door(Room.TRAP, new Position(-156, -76), false),
        ]

        doors.forEach(door => {
            dungeon.doors.set(door.position.arrayStr, door)
        })

        return dungeon;
    }

    /**
     * @param {DungeonMap} dungeon 
     */
    addPlayersToDungeonPreview(dungeon) {
        if (dungeon.players.length !== 0) return true

        let fun = AbstractClientPlayer.class.getDeclaredMethod("func_175155_b") // getPlayerInfo
        fun.setAccessible(true)
        let info = fun.invoke(Player.getPlayer())
        if (!info) return false

        {
            let player = new MapPlayer(info, dungeon, Player.getName())
            player.setX(-50)
            player.setY(-142)
            player.setRotate(73)
            player.uuid = Player.getUUID().toString()
            dungeon.players.push(player)

            player.dungeonClass = "Healer"
            player.classLevel = "20"
            player.skyblockLevel = "400"
        }
        {
            let player = new MapPlayer(info, dungeon, "Minikloon")
            player.setX(-126)
            player.setY(-64)
            player.setRotate(152)
            dungeon.players.push(player)

            player.dungeonClass = "Tank"
            player.classLevel = "25"
            player.skyblockLevel = "300"
        }

        return true
    }
}

export default SettingsManager