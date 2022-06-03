class Game {
    constructor() {
        console.log("New game created");
        this.System = new System(this);
        this.init();
        this.System.init();
        
    }

    init() {
        console.log("game initialsed")
        const scene = new Entity_Scene();
        this.System.addEntity(scene)

        const cube1 = new Entity()
        cube1.setName("cube1");
        cube1.setParent(scene) 
        cube1.addComponent(new component_Light())
        cube1.addComponent(new Component_Camera({type: 'third_person'}))
        cube1.addComponent(new Component_Object().setObject(new THREE.BoxGeometry(1,1,1)));
        cube1.addComponent(new Component_Appearance().setAppearance({color: 0xff0000}))
        cube1.addComponent(new Component_Position({x: 5, y: 0, z: 0}));
        this.System.addEntity(cube1);

    }  

    loadScene() {
            console.log(game.entities)
            //loop through entites
            for (let i =0; i < this.entityCount; i++) {
                // loop through the the components in the
                let curEntity = this.entities[i];
                console.group("curent Entity");
                console.log(curEntity);
                console.groupEnd();
                // loop through all the components in the entity that need to have functions run
                for (let j =0; j < this.entities[i].getComponentCount(); j++) {

                    
                    let curComponent = this.entities[i].components[j];
                    console.log(curComponent)

                    // game.loadModel(curComponent);
                    this.loadLights(curEntity, curComponent);
                    this.loadCamera(curEntity, curComponent);
                    this.loadObject(curComponent);
                    this.setPositions(curEntity, curComponent);
                     
                }
            }
    }

    buildScene(){
        for (let i =0; i < this.entityCount; i++){
            this.addObjectToParent(this.entities[i])
        }
    }

    setPositions( entity, component) {
        try {
            let positions = component.getPositions();
            let object = entity.getComponent('object').getObject();

            console.error(positions)
            console.error(object)

            object.position.x = positions.x;
            object.position.y = positions.y;
            object.position.z = positions.z;
        } catch(error) {
            console.warn(error);
        }
    }
    checkLoaded() {
        for (let i =0; i < this.entityCount; i++) {
            if (!this.entities[i].getLoadStatus()) {
                this.loaded = false;
                return;
            }
        }

        this.loaded = true;
    }

    loadLights( entity, component ) {
        try {
            let light = component.getLight();
            entity.getComponent('object').addObject(light);
            this.lights.push(light);
        } catch(error) {
            console.warn(error)
        }
    }

    addObjectToParent( entity ) {
        try {
            console.log("adding an entity to the parent")
            let childObject = entity.getComponent('object').getObject();
            console.log(childObject);
            let parentObject = entity.getParent().getComponent("object");
            console.log(parentObject)
            parentObject.addObject(childObject);
            console.log("component has ben added to parent");
        } catch(error) {
            console.warn(error);
        }
        
    }
    loadObject(component) {
        try {
            component.load()
        } catch (error){
            console.warn(error)
        }
    }
      
    // loadModel(component) {
    //     console.log(component);

    //     // start loading a model from the component in the entity
    //     component.load()
    //     // wait for the asynchronous function to return the loaded model
    //     .then((model) => {
    //         console.log("adding a model to a scene");
    //         // add the loaded model to the scene
    //         this.Scene.add(model);
    //     })
    //     // if the component is not a model that can be loaded catch this as an error
    //     .catch((error) => {
    //         console.warn(error);
    //     });   
    // }

    loadCamera(entity, component) {
        let camera;
        try {
            camera = component.getCamera();
            entity.getComponent('object').addObject(camera)
            this.cameras.push(camera);
        } catch(error) {
            console.warn(error);
        }
    }

    renderScene() {
        console.group("cameras");
        console.log(this.cameras);
        console.groupEnd();
        console.group("lights");
        console.log(this.lights);
        console.groupEnd()
        console.log("Rendering scene")
        // game.loadLights(curEntity, curComponent);
        // testLight.position.x = 3.5;
        let scene = this.getEntityByName('scene').getComponent('object').getObject()
        console.log(scene)
        for (let i =0; i < this.cameras.length; i++) {
            this.renderer.render(this.getEntityByName('scene').getComponent('object').getObject(), this.cameras[i]);
        }
    }

    getEntityByName( name ) {
        for (let i =0; i< this.entityCount; i++) {
            if (this.entities[i].getName() == name){
                return this.entities[i];
            }
        }
        throw new Error(`The entity with name ${name} can not be foudn in list of entities`);
    }

    animateScene() {
        if (this.running) {
            for (let i =0; i < this.entityCount; i++){
                try{
                    let animationComponent = thuis.entities[i].getComponent("animation");
                } catch (error) {
                    console.warn(error)
                }
            }
        }
    }
}