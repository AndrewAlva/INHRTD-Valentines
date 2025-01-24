import Experience from '../Experience.js'
import Environment from './Environment.js'
import Background from './Background.js'
import DarkBackground from './DarkBackground.js'
import Candies from './candies/Candies.js'
import InstancedHearts from './InstancedHearts.js'
import QRCode from './QRCode.js'
import AxisHelper from './AxisHelper.js'
import Floor from './Floor.js'
import Fox from './Fox.js'
import ShaderTest from './ShaderTest.js'

export default class World
{
    constructor()
    {
        this.experience = new Experience()
        this.events = this.experience.events
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.device = this.experience.device

        // Wait for resources
        this.resources.on('ready', () =>
        {
            // Setup
            // this.axisHelper = new AxisHelper()
            this.background = new Background()
            this.darkBackground = new DarkBackground()
            this.bgElements = new InstancedHearts()
            if (!this.device.mobile) this.qrCode = new QRCode()

            this.candies = new Candies()
            
            this.environment = new Environment()
            // this.floor = new Floor()
            // this.fox = new Fox()
            // this.shaderTest = new ShaderTest()

            this.events.trigger('siteReady');
        })
    }

    update()
    {
        if (this.candies) this.candies.update()
        if (this.bgElements) this.bgElements.update()
        if (this.qrCode) this.qrCode.update()
        if (this.darkBackground) this.darkBackground.update()
    }
}