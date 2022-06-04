class Entity {
    constructor() { 
        this.name = null; 
        this.parent = null;
        this.components = {
            object: null,
            appearance: null,
            position: null, 
            camera: null,
            animations: null
        }
        this.componentCount= 0;
        this.children = [];
        return this;
    }

    // loadComponents() {
    //     let camera = null;
    //     let child;
    //     let prevChild;
    //     for (let i =0; i < this.componentCount; i++) {
    //         console.log(this.components[i])
    //         try{
    //             console.log(this.components[i].getName())
    //             if (this.components[i].getName() == "animation") {
    //                 console.log("[revious child for animation")
    //                 console.log(prevChild);
    //                 this.components[i].setMesh(prevChild);
    //                 continue;
    //             }

    //             child = this.components[i].getTarget();
    //             if (this.components[i].getName() == 'object'){
    //                 console.log("found the object component")
    //                 prevChild = child 
    //                 continue;
    //             }
    //             if (this.components[i].getName()== 'appearance') {
    //                 console.log("prevChild is:")
    //                 console.log(prevChild);
    //                 let object = new THREE.Mesh(prevChild, child);
    //                 child = object
    //                 prevChild = child;
    //             }
    //             if (this.components[i].getName() == 'position') {
    //                 this.loadedModel.position.x = child.x;
    //                 this.loadedModel.position.y = child.y;
    //                 this.loadedModel.position.z = child.z;
    //                 continue;
    //             }

                

    //             this.addChild(child)
    //             // prevChild = 
    //             if (this.components[i].getName() == 'camera') {
    //                 camera = child;
    //             }
    //         } catch (error) {
    //             console.warn(error);
    //         }
    //     }
    //     return camera;
    // }

    addChild( child ) {
        this.children.push(child)
        return this;
    }

    addToScene( object ) {
        try {
            let group = this.getComponent("object").getTarget();
            group.add(object);
        } catch (error) {
            console.warn(error);
        }
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
        entity.addChild(this)
        return this
    }

    removeParent() {
        this.parent = null;
        return this;
    }

    removeName() {
        this.name = null;
        return this;
    }

    setName(name) {
        this.name = name;
        return this;
    }

    getName() {
        return this.name
    }

    addComponent( component ) {
        this.components[component.getName()] = component;
        this.componentCount+= 1;
        return this;
    } 

    removeComponent( compName ) {
        for (let i=0; this.componentCount; i++) {
            if (this.components[i].getName() == compName ){
                this.components.splice(i, 1);
                this.componentCount -= 1;
                return this
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
        let component;
        try{
            component = this.components[compName]; 
        } catch (error) {
            console.warn(error);
        } finally {
            return component
        }
    } 


}

class Entity_Scene extends Entity {
    constructor() {
        super()
        super.setName('scene').addComponent(new Component_Object(this).setObject({type: 'geometry', object: new THREE.Scene()}));
    }
}