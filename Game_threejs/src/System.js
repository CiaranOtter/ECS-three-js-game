class System {
    constructor(game) {
        this.game = game;
        this.entities =[];
        this.entityCount = 0;
        this.renderer = new THREE.WebGLRenderer();
        this.camera;
        
    }

    init() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);

        window.addEventListener('resize', this.onWindowResize, false);

        this.loadEntities();
        this.buildScene();
        this.renderScene();
        this.animate();
    }

    addEntity( entity ) {
        console.log('entity added');
        console.log(entity)
        this.entities.unshift(entity);
        this.entityCount += 1;
    }


    loadEntities() {
        for (let i =0;  i < this.entityCount; i++) {
            let camera = this.entities[i].loadComponents();
            if (camera != null) {
                this.camera = camera;
            }
        }
    }

    buildScene() {
        for (let i =0; i < this.entityCount; i++) {
            try {
                let loadedModel = this.entities[i].getLoadedObject();
                let parent = this.entities[i].getParent();
                parent.addChild(loadedModel);
            } catch (error) {

            }
            
        }
    }

    animate() {
        console.time()
        window.requestAnimationFrame(this.animate.bind(this));
        console.log("animating")
        console.timeLog()
        // this.loadEntities();
        // this.renderScene();
        // console.timeLog()
    }
    renderScene() {
        console.log(this.entities);
        let scene = this.findEntity('scene').getLoadedObject();
        console.log("scene object is:");
        console.log(scene)

        console.log("camera is: ")
        console.log(this.camera);
        this.renderer.render(scene, this.camera);
    }

    findEntity( name ) {
        for (let i =0; i < this.entityCount; i++) {
            if (this.entities[i].getName() == name) {
                return this.entities[i];
            }
        }

        throw new Error(`cannot find entity with name ${name}`);
    }

    onWindowResize() {
        console.log("window has been resized")
    }
}