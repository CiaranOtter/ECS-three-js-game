class Entity {
    constructor() { 
        this.name = null; 
        this.parent = null;
        this.components = [];
        this.componentCount= 0;
        this.loadedModel = new THREE.Group();
        
    }

    loadComponents() {
        let camera = null;
        let child;
        let prevChild;
        for (let i =0; i < this.componentCount; i++) {
            console.log(this.components[i])
            try{
                child = this.components[i].getTarget();
                if (this.components[i].getName() == 'object'){
                    console.log("found the object component")
                    prevChild = child 
                    continue;
                }
                if (this.components[i].getName()== 'appearance') {
                    console.log("prevChild is:")
                    console.log(prevChild);
                    let object = new THREE.Mesh(prevChild, child);
                    child = object
                }
                if (this.components[i].getName() == 'position') {
                    this.loadedModel.position.x = child.x;
                    this.loadedModel.position.y = child.y;
                    this.loadedModel.position.z = child.z;
                    continue;
                }

                this.addChild(child)
                // prevChild = 
                if (this.components[i].getName() == 'camera') {
                    camera = child;
                }
            } catch (error) {
                console.warn(error);
            }
        }
        return camera;
    }

    addChild( child ) {
        this.loadedModel.add(child);
        return this;
    }

    setLoadedModel(object) {
        this.loadedModel = object;
    }

    getLoadedObject() {
        return this.loadedModel;
    }

    getLoadStatus() {
        console.group("checking the load status of:")
        console.log(this);
        for (let i =0; i < this.componentCount; i++) {
            console.group('for component');
            console.log(this.components[i])
            let status = this.components[i].getLoadStatus();
            console.log("status is: "+status)
            console.groupEnd()
        }
        console.groupEnd()
        return true;
    }

    getComponentCount() {
        return this.componentCount; 
    }

    getParent() {
        if (this.parent == null) {
            throw new Error(`${this.getName()} does not have a parent component`);
        }
        return this.parent;
    }
    setParent( entity ) {
        console.log(`setting parent of ${this.getName()} to ${entity.getName()}`)
        this.parent = entity;
    }

    removeParent() {
        this.parent = null;
    }

    removeName() {
        this.name = null;
    }

    setName(name) {
        this.name = name;
    }

    getName() {
        return this.name
    }

    addComponent( component ) {
        this.components.push(component)
        this.componentCount+= 1;
    } 

    removeComponent( compName ) {
        for (let i=0; this.componentCount; i++) {
            if (this.components[i].getName() == compName ){
                this.components.splice(i, 1);
                this.componentCount -= 1;
                return 
            }
        }
        throw new Error(`component ${compName} cannot be found in list of ${this.name}'s components`);
    }

    print() {
        console.log(JSON.stringify(this, null, 4));
        return this;
    }

    hasComponent( compName ) {
        for (let i = 0; i < this.componentCount; i++) {
            if (components[i].getName() == "model"){
                return true;
            }
        } 
        return false;
    }

    getComponent( compName ) {
        for (let i =0; i < this.componentCount; i++) {
            if (this.components[i].getName() == compName){
                return this.components[i];
            }
        }   

        throw new Error(`${this.getName()} does not contain a component with the name ${compName}`);
    } 


}

class Entity_Scene extends Entity {
    constructor() {
        super()
        super.setName('scene');
        super.setLoadedModel(new THREE.Scene());
    }
}