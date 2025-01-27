import * as THREE from 'three'
import Experience from '../../Experience.js'
import testVertexShader from '../../shaders/test/vertex.glsl'
import testFragmentShader from '../../shaders/test/fragment.glsl'

export default class Candy2
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
            this.debugFolder = this.debug.ui.addFolder('Candy1')
            this.debugFolder.close()
        }

        this.initModel(params);
        this.addHandlers();
    }

    initModel(params) {
        this.group = new THREE.Group();

        this.model = this.resources.items.candyModel.clone();
        this.model.position.set(0.175, -0.45, 1.05);
        this.model.scale.setScalar(0.185);

        this.material = new THREE.MeshStandardMaterial({
            color: '#A0CDE9',
            roughness: 0.362,
            metalness: 0.071,
            transparent: true,
            // flatShading: true,
        });

        this.pbrMaterial = new THREE.MeshStandardMaterial({
            color: '#A0CDE9',
            // map: this.resources.items.candyDiffuseMap,
            normalMap: this.resources.items.candyNormalsMap,

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
        this.rotationGroup.rotation.y = Math.PI / 7;
        this.rotationGroup.rotation.x = -Math.PI / 20;
        this.rotationGroup.add(this.model);

        this.group.add(this.rotationGroup);
        if (params.inactive) this.model.visible = false
    }

    addHandlers() {
        this.appState.on('stepChange', (newStep) => {
            // TODO: improve animate in/out of the candy
            if (newStep == 1) {
                this.mesh.material.opacity = 0;
            } else {
                this.mesh.material.opacity = 1;
            }
        });
    }


    update()
    {
        // update uniforms or something
        if (this.mesh && this.shaderMaterial) {
            if (this.experience.appState.currentStep == 0 && !this.device.mobile) {
                this.mesh.material.opacity = 1 - this.appState.tapHoldAlpha;
            }
        }
    }
}