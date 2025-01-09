import Experience from '../Experience.js'
import Environment from './Environment.js'
import Background from './Background.js'
import DarkBackground from './DarkBackground.js'
import Heart1 from './Heart1.js'
import Floor from './Floor.js'
import Fox from './Fox.js'
import ShaderTest from './ShaderTest.js'

export default class World
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources

        // Wait for resources
        this.resources.on('ready', () =>
        {
            // Setup
            this.background = new Background()
            this.darkBackground = new DarkBackground()
            this.mainHeart = new Heart1()
            
            this.environment = new Environment()
            // this.floor = new Floor()
            // this.fox = new Fox()
            // this.shaderTest = new ShaderTest()
        })
    }

    update()
    {
        if (this.mainHeart) this.mainHeart.update()
    }
}