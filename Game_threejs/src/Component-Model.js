class Component_Model extends Component{
    constructor(file) {
        super("object");
        this.modelfile = file;
        this.model;
        this.loaded = false;
    }

    async load() {
        let file = this.modelfile;
        let model = this;
        let modelPromise = new Promise((resolve, reject) => {
            let loader = new THREE.GLTFLoader()
            loader.load(file, (gltf) => {
                console.log("loading model from file: "+file)
                console.log("gltf model: " + gltf);
                let root = gltf.scene;
                resolve(model.setModel(root));
                console.log("model scene: "+ root);
            })
        });

        return await modelPromise;
    }

    setModel( model ){
        this.model = model;
        this.loaded = true;
        console.log("the model has been loaded and the loading status of the component is: "+ this.loaded)
        return this.getObject();
    }

    getObject() {
        return this.model;
    }

    getLoadStatus()  {
        console.log("getting  results from the overloaded getloadstatus method")
        return this.loaded;
    }
}