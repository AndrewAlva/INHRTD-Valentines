import * as THREE from 'three'
import Experience from '../../Experience.js'
import testVertexShader from '../../shaders/test/vertex.glsl'
import testFragmentShader from '../../shaders/test/fragment.glsl'

export default class BaseCandy
{
    constructor(params = {})
    {
        this.experience = new Experience()
        this.device = this.experience.device
        this.appState = this.experience.appState
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.time = this.experience.time
        this.debug = this.experience.debug

        // Debug
        if(this.debug.active)
        {
            this.debugFolder = this.debug.ui.addFolder(params.name || 'Candy')
            this.debugFolder.close()
        }

        this.initModel(params);
        // this.initMesh(params);
        this.addHandlers();
    }

    initModel(params) {
        this.group = new THREE.Group();

        this.model = this.resources.items.candyModel.clone();
        this.model.children.pop();
        this.model.position.set(0.175, -0.45, 1.05);
        this.model.scale.setScalar(0.185);

        this.material = new THREE.MeshStandardMaterial({
            color: params.color || '#FFA5C2',
            roughness: 0.362,
            metalness: 0.071,
            transparent: true,
            // flatShading: true,
        });

        this.pbrMaterial = new THREE.MeshStandardMaterial({
            color: params.color || '#FFA5C2',
            // map: this.resources.items.candyDiffuseMap,
            // normalMap: this.resources.items.candyNormalsMap,

            roughnessMap: this.resources.items.candyRoughnessMap,
            metalnessMap: this.resources.items.candyRoughnessMap,
            // roughness: 0.362,
            // metalness: 0.071,
            transparent: true,
        });


        this.shaderMaterial = new THREE.ShaderMaterial({
            vertexShader: testVertexShader,
            fragmentShader: testFragmentShader,
            side: THREE.DoubleSide
        })


        this.mesh = this.model.children[0];
        this.mesh.material = this.pbrMaterial;
        this.mesh.receiveShadow = true
        

        this.rotationGroup = new THREE.Group();
        this.rotationGroup.rotation.x = -Math.PI / 24;
        this.rotationGroup.rotation.z = -Math.PI / 50;
        this.rotationGroup.add(this.model);

        this.group.add(this.rotationGroup);
        if (params.inactive) this.model.visible = false
    }

    initMesh(params)
    {
        this.geometry = new THREE.BoxGeometry(1.5, 1.5, 1.5)
        // this.geometry = new THREE.TorusKnotGeometry(0.8, 0.25, 128)
        // this.geometry = new THREE.SphereGeometry(1.1, 32, 32)

        this.shaderMaterial = new THREE.ShaderMaterial({
            vertexShader: testVertexShader,
            fragmentShader: testFragmentShader,
            side: THREE.DoubleSide
        })
        
        this.material = new THREE.MeshStandardMaterial({
            color: '#FFA5C2',
            roughness: 0.362,
            metalness: 0.071,
            transparent: true,
            // flatShading: true,
        });

        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.mesh.position.y = 0
        this.mesh.rotation.x = -0.5
        this.mesh.rotation.z = 0.25
        this.mesh.receiveShadow = true

        if (params.inactive) this.mesh.visible = false
    }

    addHandlers() {
        // 
    }


    update()
    {
        // update uniforms or something
    }
}