import {apiCancel, apiGet, apiPost, apiPut} from '../config/matrixHttp.js'
import { get } from 'svelte/store'
import {matrix_url,matrix_since,timeout,matrix_token} from "../store.js";

let matrixUrl = '';
let matrixToken = '';
let _since;
matrix_url.subscribe(value => matrixUrl = value);
matrix_token.subscribe(value => matrixToken = value);
matrix_since.subscribe(value => _since = value);


export const Matrix ={

    sync: async ()=>{
        let url = '/_matrix/client/v3/sync'
        _since = get(matrix_since)

        const options ={
            baseUrl: matrixUrl,
            params:{
                timeout:60000
            },
            headers: {
                'authorization': `Bearer ${matrixToken}`,
                'Content-Type': 'application/json'
            }
        }
        if(_since){
            options.params.since = _since
        }

        return await apiGet(url,options)
    },

    joined_rooms: async ()=>{
        let url = `/_matrix/client/v3/joined_rooms`

        const options ={
            baseUrl: matrixUrl,
            headers: {
                'authorization': `Bearer ${matrixToken}`,
                'Content-Type': 'application/json'
            }
        }
        return await apiGet(url, options)
    },

    join_room: async (room_id)=>{
        let url = `/_matrix/client/v3/rooms/${room_id}/join`;

        const options ={
            baseUrl: matrixUrl,
            headers: {
                'authorization': `Bearer ${matrixToken}`,
                'Content-Type': 'application/json'
            }
        }

        return await apiPost(url, options)
    },

    room_members: async (room_id)=>{
        let url = `/_matrix/client/r0/rooms/${room_id}/members`;

        const options ={
            baseUrl: matrixUrl,
            headers: {
                'authorization': `Bearer ${matrixToken}`,
                'Content-Type': 'application/json'
            }
        }

        return await apiGet(url, options)
    },

    room_messages: async(room_id, limit = 100, from = '' )=>{
        let url = `/_matrix/client/v3/rooms/${room_id}/messages`

        _since = get(matrix_since)
        // 's0_0_0_0_0_0_0_0_0'
        let options ={
            params:{
                dir:'b',
                limit:limit,
                from: from,
                filter:JSON.stringify({"types": ["m.room.message"]})
            },
            baseUrl: matrixUrl,
            headers: {
                'authorization': `Bearer ${matrixToken}`,
                'Content-Type': 'application/json'
            }
        }

        return await apiGet(url,options)
    },

    send_message: async(room_id, message)=>{

        const uuid = Math.floor(Math.random() * 10000000000000) + 1;
        let url = `/_matrix/client/v3/rooms/${room_id}/send/m.room.message/${uuid}`

        const body={
            msgtype: "m.text",
            format: "org.matrix.custom.html",
            formatted_body: message,
            body: message,
        }

        const options ={
            baseUrl: matrixUrl,
            headers: {
                'authorization': `Bearer ${matrixToken}`,
                'Content-Type': 'application/json'
            },
            body: body
        }

        return await apiPut(url, options)
    },

    //only for server admin
    get_user_by_id: async(user_id)=>{
        let url= `/_synapse/admin/v2/users/${user_id}`

        const options ={
            baseUrl: matrixUrl,
            headers: {
                'authorization': `Bearer ${matrixToken}`,
                'Content-Type': 'application/json'
            }
        }

        return await apiGet(url,options)
    },

    get_user_profile: async(user_id)=>{
        let url= `/_matrix/client/r0/profile/${user_id}`

        const options ={
            baseUrl: matrixUrl,
            headers: {
                'authorization': `Bearer ${matrixToken}`,
                'Content-Type': 'application/json'
            }
        }

        return await apiGet(url,options)
    },

    user_presence: async(user_id)=>{
        let url= `/_matrix/client/v3/presence/${user_id}/status`

        const options ={
            baseUrl: matrixUrl,
            headers: {
                'authorization': `Bearer ${matrixToken}`,
                'Content-Type': 'application/json'
            }
        }

        return await apiGet(url,options)
    },

    logout: async()=>{
        let url = `/_matrix/client/r0/logout`;

        const options ={
            baseUrl: matrixUrl,
            headers: {
                'authorization': `Bearer ${matrixToken}`,
                'Content-Type': 'application/json'
            }
        }

        return await apiPost(url,options)
    },

    cancel: ()=>{
        apiCancel()
    }
}