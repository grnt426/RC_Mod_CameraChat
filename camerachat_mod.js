class CameraChat {
    constructor() {
        // This would match something like "c 123:45"
        this.matcher = /^c [0-9]{1,3}:[0-9]{1,3}/;
    }

    chat(message) {
        if(this.matcher.test(message)) {
            let input = message.split(" ")[1];
            console.log("Parsed input: " + input);
            let coords = input.split(":");
            console.log("Parsed coords: " + coords);
            let x = parseInt(coords[0]);
            let y = parseInt(coords[1]);

            if(x >= 0 && x < 10000 && y >= 0 && y < 10000) {
                window.granite.cameraControl.setCameraPosition(x, y, 30);
            }

            // we processed this command. Let the handler know.
            return true;
        }

        // This chat message didn't apply to us, so we ignored it.
        return false;
    }
}

window.granite.addHookListener(new CameraChat());