import EventEmitter from './EventEmitter.js'

let instance = null

export default class GlobalEvents extends EventEmitter
{
    constructor() {
        super()

        // Singleton
        if(instance)
        {
            return instance
        }
        instance = this
        
        // Global access
        window.globalEvents = this


        // Example setup, replace their content as needed
        this.addHandlers();
        this.tester = 'ready!'
    }

    addHandlers() {}
}