class CameraChat {
    constructor() {
        // This would match something like "c 123:45"
        this.matcher = /^goto\s[0-9]{1,3}[\s:][0-9]{1,3}/;
        this.nameMatcher = /^goto [a-z\s]{1,40} [a-z]{1,40}/;
        this.name = "Coordinate Jumper";

        this.nameMapping = this.#buildNameMapping();
    }

    #buildNameMapping() {
        let galaxy = window.gamestate.game.galaxy;
        let mapping = {};

        galaxy.stellar_systems.forEach(s =>  {
            let name = s.name.toLowerCase();
            let sectorName = galaxy.sectors[s.sector_id].name.toLowerCase();

            // Allow partial spelling of sectors, minimum three letters
            // NOTE: we assume all sectors are unique for the first 3 letters. Never proven :\
            let start = sectorName.length < 3 ? sectorName.length : 3;
            for(let i = start; i <= sectorName.length; i++) {
                mapping[name + "," + sectorName.substring(0, i)] = s;
            }
        });

        return mapping;
    }

    chatMessage(message) {
        if(this.matcher.test(message)) {
            try {

                // This allows us to support `c 193:212` and `c 193 212`
                if(message.indexOf(":") !== 0) {
                    message = message.replace(":", " ");
                }
                let input = message.split(" ");
                window.granite.debug("Parsed input: " + input, window.granite.levels.DEBUG);
                let x = parseInt(input[1]);
                let y = parseInt(input[2]);

                if(x >= 0 && x < 10000 && y >= 0 && y < 10000) {
                    window.granite.cameraControl.setCameraPosition(x, y, 30);
                }
            }
            catch(err) {
                window.granite.showMessageInChat(
                    "M:" + this.name,
                    "Something went wrong in parsing that command! Send the rc_mod.log file to @Granite"
                );
                window.granite.debug(
                    "Failed in processing chat command for CameraChat: " + err,
                    window.granite.levels.ERROR
                );
            }

            // Regardless of success/fail, this was a command intent. Let the handler know.
            return true;
        }
        else if(this.nameMatcher.test(message)) {
            try {
                let input = message.split(" ");

                // We assume sectors are single words, and last
                let sectorName = input[input.length - 1].toLowerCase();

                // We also assume the name of the system is everything after the command character, and before the last
                // token, which is the sector name
                let systemName = input.slice(1, input.length - 1).join(" ").toLowerCase();

                window.granite.debug(
                    "Name: " + sectorName + " | System Name: " + systemName,
                    window.granite.levels.DEBUG
                );

                let system = this.nameMapping[systemName + "," + sectorName];
                if(system) {
                    let coords = system.position;
                    window.granite.debug("Retrieved coords: " + coords, window.granite.levels.DEBUG);
                    window.granite.cameraControl.setCameraPosition(coords.x, coords.y, 30);
                }
                else {
                    window.granite.showMessageInChat(
                        "M:" + this.name,
                        "No such system/sector: " + systemName + " in " + sectorName
                    );
                }
            }
            catch(err) {
                window.granite.showMessageInChat(
                    "M:" + this.name,
                    "Something went wrong in parsing that command! Send the rc_mod.log file to @Granite"
                );
                window.granite.debug(
                    "Failed in processing chat command for CameraChat: " + err,
                    window.granite.levels.ERROR
                );
            }

            // Regardless of success/fail, this was a command intent. Let the handler know.
            return true;
        }

        // This chat message didn't apply to us, so we ignored it.
        return false;
    }
}

window.granite.addHookListener(new CameraChat());