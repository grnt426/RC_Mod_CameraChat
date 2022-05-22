class CameraChat {
    constructor() {
        // This would match something like "c 123:45"
        this.matcher = /^c [0-9]{1,3}:[0-9]{1,3}/;
        this.nameMatcher = /^c [a-z\s]{1,40} [a-z]{1,40}/;

        this.nameMapping = this.#buildNameMapping();
    }

    #buildNameMapping() {
        let galaxy = window.gamestate.game.galaxy;
        let mapping = {};

        galaxy.stellar_systems.forEach(s =>  {
            let name = s.name.toLowerCase();
            let sectorName = galaxy.sectors[s.sector_id].name.toLowerCase();

            // Allow partial spelling of sectors, minimum three letters
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
                let input = message.split(" ")[1];
                console.debug("Parsed input: " + input);
                let coords = input.split(":");
                console.debug("Parsed coords: " + coords);
                let x = parseInt(coords[0]);
                let y = parseInt(coords[1]);

                if(x >= 0 && x < 10000 && y >= 0 && y < 10000) {
                    window.granite.cameraControl.setCameraPosition(x, y, 30);
                }
            }
            catch(err) {
                console.error("Failed in processing chat command for CameraChat: " + err);
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

                console.debug("Name: " + sectorName + " | System Name: " + systemName);

                let system = this.nameMapping[systemName + "," + sectorName];
                if(system) {
                    let coords = system.position;
                    console.debug("Retrieved coords: " + coords);
                    window.granite.cameraControl.setCameraPosition(coords.x, coords.y, 30);
                }
            }
            catch(err) {
                console.error("Failed in processing chat command for CameraChat: " + err);
            }

            // Regardless of success/fail, this was a command intent. Let the handler know.
            return true;
        }

        // This chat message didn't apply to us, so we ignored it.
        return false;
    }
}

window.granite.addHookListener(new CameraChat());