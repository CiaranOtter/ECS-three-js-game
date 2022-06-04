const clock = new THREE.Clock();
class System {
    constructor(game) {
        this.game = game;
        this.entities =[];
        this.entityCount = 0;
        this.renderer = new THREE.WebGLRenderer();
        this.cameras = [];
        this.scene;
    }

    init() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);

        window.addEventListener('resize', this.onWindowResize, false);

        // console.group("starting to load entites")
        // this.loadEntities();
        // console.groupEnd()
        console.group("starting to build scene")
        console.log(this.entities)
        this.buildScene();
        console.groupEnd()
        console.group("starting to render scene")
        this.renderScene();
        console.groupEnd()
        // this.animate();
    }

    setScene( scene ) {
        this.scene = scene;
        return this;
    }

    addEntity( entity ) {
        console.log('entity added');
        console.log(entity)
        this.entities.unshift(entity);
        this.entityCount += 1;
        return this;
    }

    addCamera( camera ) {
        this.cameras.push(camera);
        return this;
    }

    loadEntities() {
        
    }

    buildScene() {
        for (let i =0; i < this.entityCount; i++) {
            try {
                let object = this.entities[i].getComponent('object').getTarget();
                let parent = this.entities[i].getParent();

                console.group(`attempting to add ${this.entities[i].getName()} to ${parent.getName()}:`);
                console.log(object);
                console.groupEnd();

                parent.addToScene(object);
            } catch (error) {

            }
            
        }

        console.log("scene has been built")
    }

    animate() {
        console.time()
        window.requestAnimationFrame(this.animate.bind(this));
        console.log("animating")
        console.timeLog()
        // this.loadEntities();
        // this.renderScene();
        // console.timeLog()

        const delta = clock.getDelta();
        this.update(delta);
    }

    update( delta ) {
        for (let i =0; i < this.entityCount; i++) {
            try{
                this.entities[i].getComponent('animation').update(delta)
            } catch (error) {

            }
        }
    }
    renderScene() {
        console.log(this.entities);
        console.log("scene object is:");
        console.log(this.scene)
        console.log(this.scene.getComponent('object'))
        console.log(this.scene.getComponent('object').getTarget())

        console.log("camera is: ")
        console.log(this.cameras);
        for (let i =0; i < this.cameras.length; i++) {
            this.renderer.render(this.scene.getComponent('object').getTarget(), this.cameras[i]);
        }
        
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