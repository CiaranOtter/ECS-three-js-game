const loader = new THREE.GLTFLoader();

class Component {
    constructor(name, entity) {
        this.name = name;
        this.parentEntity = entity;
        return this;
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
        this.Mesh;
    }

    init() {
        this.position = new THREE.QuaternionKeyframetrack(
            '.rotation',
            [0,1],
            [
                this.Mesh.rotation.x,
                this.Mesh.rotation.y,
                this.Mesh.rotation.z,

                this.Mesh.rotation.x + 2*Math.PI,
                this.Mesh.rotation.y + 2*Math.PI,
                this.Mesh.rotation.z + 2*Math.PI
            ],
            THREE.InterpolateSmooth
        );

        this.position.createInterpolant();

        this.clip= new THREE.AnimationClip('Action', 3, [
            position
        ]);

        this.mixer = new THREE.AnimationMixer(Mesh);
        this.action = this.mixer.clipAction(clip);

        this.action.setLoop(THREE.LoopRepeat);
        this.action.startAt(0);
        this.action.play();
    }

    setMesh( mesh ) {
        this.Mesh = mesh;
        this.init();
        return this;
    }

    update( delta ) {
        console.log("updating animations")
        this.mixer.update(delta);
    }
}

//////////////////////////////////////////////////////////////////////
//!                         Object component                        // 
//                  (which extends the component class)             //
//////////////////////////////////////////////////////////////////////
//? attrubutes:                                                     //
//*     Object - a loaded gltf model or a three js geometry object  // 
//*     parentEntity - the entity to which this component belongs   // 
//////////////////////////////////////////////////////////////////////
//? methods:                                                        //
//*     setObject()                                                 //
//          to set the Object parameter                             //
//*     loadGLTFModel()                                             //
//          to load a gltf model from a file                        //
//*     loadGeometry()                                              //
//          to load a three js geometry                             //
//////////////////////////////////////////////////////////////////////
class Component_Object extends Component {
    constructor(entity){
        super("object", entity);
        this.type;
        this.position = {x: 0,y: 0,z: 0}
        this.ObjectAppearance;
        this.loaded = false;
        return this;
    }

    //////////////////////////////////////////////////////////////////////////////////////////////
    //?                     method for setting the Poition of the Object                       ?//
    //////////////////////////////////////////////////////////////////////////////////////////////
    //* parameters:                                                                             //
    //*     positions: an object containg an x, y and z value to be set to the objects position //
    //*     update: a boolean value that will make the class update position values of the      //
    //*             object contained in the class when true                                     //
    //                                                                                          //
    //* returns: this                                                                           //
    //////////////////////////////////////////////////////////////////////////////////////////////
    setPosition(positions, update) {
        let updatePos = {
            x: positions.x - this.position.x,
            y: positions.y - this.position.y,
            z: positions.z - this.position.z
        }
        this.position = positions;
        if (update) {
            this.updatePositions(updatePos);
        }
    }


    //? method for updating the positions of the object ?//
    ///////////////////////////////////////////////////////
    //* parameters:
    //* 
    updatePositions(updatedPos) {
        this.Object.position.x += updatedPos.x;
        this.Object.position.y += updatedPos.y;
        this.Object.position.z += updatedPos.z;
        return this;
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //?                          method to set the Object that this component contains                              //
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // *parameters:                                                                                                 //
    //*     params : object that contains *type and the and the *object* to be added to the component               //
    //                                                                                                              //
    //*          - type : "gltfmodel" or geometry                                                                   //
    //*          - object: is a file if type is a model or is a new THREE js geomtry if the object is a geomery     //
    //                                                                                                              //
    //* returns this if the method runs succesfully else throws an error to show that the type in the parameters   //
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    setObject( params ) {

        this.type = params.type;
        if (params.type == "gltfmodel") {
            this.loadGLTFModel(params.object);
            return this
        }

        if (params.type == "geometry") {
            this.loadGeometry(params.object);
            return this
        }

        throw new Error('invalid type for loading an object')
    }

    //////////////////////////////////////////////////////
    //?     method to load a gltf object from a file   ?//
    //////////////////////////////////////////////////////
    // *parameters:                                     //
    //*     file: a path to a gltf file                 //
    //                                                  //
    // *returns: null                                   //
    ////////////////////////////////////////////////////// 
    loadGLTFModel(file) {
        loader.load(file, (gltf) => {
            console.log("loading model from file: "+file)
            console.log("gltf model: " + gltf);
            console.log("gltf object returns")
            console.log(gltf);
            let root = gltf.scene;
            this.Object = root;
        });
    }

    //////////////////////////////////////////////////////////
    //? method to load a three geometry into the component ?//
    //////////////////////////////////////////////////////////
    //* parameters:                                         //
    //*     geomtry: three js Geometry object               //
    //                                                      //
    //* returns null                                        //
    //////////////////////////////////////////////////////////
    loadGeometry( geometry ) {
        this.Object = geometry; 
    }

    setAppearance(appearance) {
        this.Object
    }

    setTarget( object ) {
        this.Object = object;
        return this
    }
    ///////////////////////////////////////////////////////////////
    //?     method to retrieve the object from the component    ?//
    ///////////////////////////////////////////////////////////////
    //* parameters: null                                         //
    //                                                           //
    //* returns the Object contained in the class                //
    ///////////////////////////////////////////////////////////////
    getTarget() {
        return this.Object;
    }
}
//////////////////////////////////////////////////////////////////////////////
//!                             Light component                            !//
//      (extends the Object component which extends the Component class)    //
//////////////////////////////////////////////////////////////////////////////
//? attributes =:
//* 
class Component_Light extends Component_Object {
    constructor(entity) {
        super(entity)
        this.lightParamters = {
            type: 'point',
            colour: 0xffffff,
            intensity: 1,
            decay: 2,
            target: null
        }
        return this;
    }

    setObject(params) {
        this.lightParamters = params;

        if (params.type == "point") {
            super.Object = new THREE.PointLight(); //color, intensity and decay
            this.update();
            return this;
        }

        if (params.type == "ambient") {
            super.Object = new THREE.AmbientLight() // color
            this.update()
            return this;
        }

        if (params.type == "directional") {
            super.Object = new THREE.DirectionalLight() // color and intensity
            this.update();
            return this;
        }

        throw new Error(`This light component does not have a valid type parameter for type: ${params.type}`);
    }

    update() {
        try{
            super.Object.color = this.lightParamters.colour;
            super.Object.intensity = this.lightParamters.intensity;
            super.Object.decay = this.decay;
        } catch (error) {
            console.warn(error)
        } finally {
            try {
                super.Object.target = this.lightParamters.target; 
            } catch (error) {
                console.warn(error)
            }
        }
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

//////////////////////////////////////////////////////////////////////////////
//!                             Camera comopnent                           !//
//      (extends the Object component which extends the Component class)    //
//////////////////////////////////////////////////////////////////////////////
//? attributes:                                                            ?//
//*     cameraSettings - an object containing the settings to be applied   *//
//*                      to the camera:                                    *//
//                        ~ type : string containg either "first_person",   //
//                                 "third_person" or "ortho"                //
//                        ~ fov : the field of view of the camera           //
//                        ~ aspectratio : the dimensions of the camera      //
//                                        as a floating point value         //
//                        ~ near : the point of the cut off closest to      //
//                                 the camera                               //
//                        ~ far : the point of the cut off furthest from    //
//                                the camera                                //
//////////////////////////////////////////////////////////////////////////////
//? methods:                                                               ?//
//* setObject()                                                            *//
//      used to initialse the camera object based on the settings           //
//      attribute and load it as the object in the Object super             //
//      class                                                               //
//////////////////////////////////////////////////////////////////////////////
class Component_Camera extends Component_Object {
    constructor(entity) {
        super(entity)
        this.cameraSettings = {
            type: "third_person",
            fov: 40,
            aspectRatio: window.innerWidth/window.innerHeight,
            near: 0.1,
            far: 1000
        }
        return this
    }

    //////////////////////////////////////////////////////////////////////
    //?     method to set the Object of the of the object component    ?//
    //?       to a camera and initialise the camera based of the       ?//
    //?                   camera settings attribute                    ?//
    //////////////////////////////////////////////////////////////////////
    //* parameters: params object that contains the settings that are  *//
    //*             desired for the cameraSettings object of the camera*//             
    //                                                                  //
    //* returns: this                                                  *//
    //////////////////////////////////////////////////////////////////////
    setObject(params) {

        this.cameraSettings = params;

        if (this.cameraSettings.type == 'ortho') {
            super.setTarget(new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, 1, 1000 ));
            return this;
        } else {
            super.setTarget(new THREE.PerspectiveCamera(this.cameraSettings.fov, this.cameraSettings.aspectRatio, this.cameraSettings.near, this.cameraSettings.far))
            console.log('camera object set to')
            console.log(super.getTarget())

            if (this.cameraSettings.type == "third_person") {
                
                super.setPosition({x: 0,y: 2,z: 5}, true);
                super.getTarget().lookAt(0,0,0);
                return this;
            }

            if (this.cameraSettings.type == "first_person") {
                super.setPosition({x: 0, y: 0, z: 0});
                return this;
            }

            throw new Error(`This camera component type : ${this.cameraSettings.type} is not a valid first or third person camera`)
        }

        throw new Error(`This camera component type : ${this.cameraSettings.type} is nother a valid ortho or perspective camera`);
        
    }

}