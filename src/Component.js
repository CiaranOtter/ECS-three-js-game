class Component {
    constructor(name) {
        this.name = name;
    }

    getLoadStatus() {
        return true;
    }

    getName() {
        return this.name;
    }

    load() {
        throw new Error(`${this.getName()} cannot be loaded`)
    }

    getTarget() {
        throw new Error(`${this.getName()} does not contain a target that can be retrieved`);
    }

    getCamera() {
        throw new Error(`${this.getName()} is not a camera`)
    }

    getLight() {
        throw new Error(`${this.getName()} does not contain a light component that can be added`);
    }

    getPositions(){
        throw new Error(`${this.getName()} does not have a position that can be retrieved`)
    }

    update() {

    }
}

class Component_Position extends Component {
    constructor(position) {
        super("position")
        this.x = position.x;
        this.y = position.y;
        this.z = position.z; 
    }

    getTarget() {
        return {x: this.x, y: this.y, z: this.z}
    }
}

class Component_animation extends Component {
    constructor(){
        super("animation");
        
    }
}

class component_Light extends Component {
    constructor() {
        super("light")
        this.light = new THREE.PointLight(0xff0000, 1.0,0);
        this.light.position.x = -1;
    }

    getTarget() {
        return this.light;
    }
}

class Component_Object extends Component {
    constructor(){
        super("object");
        this.Object;
        this.loaded = false;
    }

    setObject( object ) {
        this.Object = object;
        return this;
    }

    getTarget() {
        return this.Object;
    }

    getLoadStatus() {
        return this.loaded;
    }
}

class Component_Appearance extends Component {
    constructor() {
        super("appearance");
        this.appearance;
    }

    setAppearance(appearance) {
        this.appearnace = appearance;
        return this;
    }

    getTarget() {
        return new THREE.MeshBasicMaterial(this.appearnace);
    }
}

class Component_Camera extends Component {
    constructor() {
        super("camera")
        this.cameraSettings = {
            type: "third_person",
            fov: 40,
            aspectRatio: window.innerWidth/window.innerHeight,
            near: 0.1,
            far: 1000
        }
        this.#initCamera();
    }

    #initCamera() {
        this.camera = new THREE.PerspectiveCamera(this.cameraSettings.fov, this.cameraSettings.aspectRatio, this.cameraSettings.near, this.cameraSettings.far);

        if (this.cameraSettings.type == "third_person") {
            this.camera.position.z += 5;
            this.camera.position.y += 2;
            this.camera.lookAt(0,0,0);
        }

        if (this.cameraSettings.type == "first_person") {
            this.camera.position.z = 0;
            this.camera.position.y = 0;
        }
    }

    getTarget() {
        return this.camera;
    }
}