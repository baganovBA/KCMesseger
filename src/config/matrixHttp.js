import Http from '../assets/http.js'
import {matrix_url} from "../store.js";


const matrixHttp = new Http({baseUrl:matrix_url})

const {getUrl, postUrl, putUrl, cancel} = matrixHttp

const apiGet = getUrl.bind(matrixHttp)
const apiPost = postUrl.bind(matrixHttp)
const apiPut = putUrl.bind(matrixHttp)
const apiCancel = cancel.bind(matrixHttp)
// const createMethod = (method) => (...args) => matrixHttp.fetchConstructor(url, {method, ...args})
// const apiGet =  createMethod('GET')
// const apiPost = createMethod('POST')
// const apiPut = createMethod('PUT')

export {apiGet,apiPost,apiPut,apiCancel}