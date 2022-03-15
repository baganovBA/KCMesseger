
export default class Http{

    baseUrl='';
    fetchController = new window.AbortController()

    constructor(options) {
        if(options?.baseUrl){
            this.baseUrl = options.baseUrl
        }
    }
    async fetchConstructor(url, options){
        if(typeof url !== 'string'){
            return console.error('URL not provided!')
        }

        if(options?.params){
            url = Object.entries(options.params)
                .reduce((acc,[key, value])=>{
                    acc += `&${key}=${value}`
                    return acc
                },url).replace('&', '?')

            url = window.decodeURI(url)

            delete options.params
        }

        if(options.baseUrl){
            this.baseUrl = options.baseUrl
        }

        if(options?.authorization){
            options.headers.authorization = `Bearer ${options?.authorization}`

            delete options.authorization
        }

        let baseOptions={
            method: 'GET',
            headers: {
                "Accept": "application/json",
                // "Content-Type": "application/json",
            },
            signal:this.fetchController.signal
        }

        try{
            let res = await fetch(`${this.baseUrl}${url}`,{...baseOptions})

            return await res.json()

        }catch (e){
            throw e
        }

    }

    async getUrl (url, options){

        if(options?.params){
            url = Object.entries(options.params)
                .reduce((acc,[key, value])=>{
                    acc += `&${key}=${value}`
                    return acc
                },url).replace('&', '?')

            url = window.encodeURI(url)

            delete options.params
        }

        if(options.baseUrl){
            this.baseUrl = options.baseUrl
        }

        if(options?.authorization){
            options.headers.authorization = `Bearer ${options?.authorization}`

            delete options.authorization
        }


        let baseOptions={
            method: 'GET',
            headers: {
                "Accept": "application/json",
                // "Content-Type": "application/json",
            },
            signal:this.fetchController.signal
        }

        baseOptions = {...baseOptions, ...options}

        try{
            let res = await fetch(`${this.baseUrl}${url}`,{...baseOptions})

            return await res.json()

        }catch (e){
            throw e
        }
    }

    async postUrl (url, options) {

        let baseOptions={
            method: 'POST',
            headers: {
                "Accept": "application/json",
                // "Content-Type": "application/json",
            },
            signal:this.fetchController.signal
        }

        if(options.baseUrl){
            this.baseUrl = options.baseUrl
        }

        if(options.body){

            options.body = JSON.stringify(options.body)
            options.headers = {...baseOptions.headers, "Content-Type": "application/json"}
        }

        baseOptions = {...baseOptions, ...options}

        try{
            let res = await fetch(`${this.baseUrl}${url}`,{...baseOptions})

            return await res.json()

        }catch (e){
            throw e
        }
    }
    async putUrl (url, options) {

        let baseOptions={
            method: 'PUT',
            headers: {
                "Accept": "application/json",
                // "Content-Type": "application/json",
            }
        }

        if(options.baseUrl){
            this.baseUrl = options.baseUrl
        }

        if(options.body){

            options.body = JSON.stringify(options.body)
            options.headers = {...baseOptions.headers,...options.headers ,"Content-Type": "application/json"}
        }

        baseOptions = {...baseOptions, ...options}

        try{
            let res = await fetch(`${this.baseUrl}${url}`,{...baseOptions})

            return await res.json()

        }catch (e){
            throw e
        }
    }

    cancel(){
        this.fetchController.abort()
        this.fetchController = new window.AbortController()
    }
}
