import Http from '../assets/http.js'


const apiUrl = import.meta.env.VITE_API_URL
const apiVersion = import.meta.env.VITE_API_VERSION

const KcHttp = new Http({baseUrl: `${apiUrl}/${apiVersion}`})

const {getUrl, postUrl} = KcHttp


const apiGet = getUrl.bind(KcHttp)
const apiPost = postUrl.bind(KcHttp)

export {apiGet,apiPost}