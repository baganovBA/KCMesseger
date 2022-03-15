import {apiGet} from '../config/KcHttp.js'
import {kc_token, account_guid} from "../store.js";
import {get} from "svelte/store";

let kcToken=''
kc_token.subscribe(value=> kcToken = value)

export const KcApi ={
    getMatrixConfig: async()=>{
        const res = await apiGet('/matrix/config', {params:{
                token:kcToken
            }
        })
        return res
    },

    getMatrixToken: async()=>{
        const res = await apiGet('/matrix/token', {params:{
                token:kcToken
            }
        })
        return res
    },

    getMatrixTokenParams: async(kcToken)=>{
        const res = await apiGet('/matrix/token', {params:{
                token:kcToken
            }
        })
        return res
    },

    getUserListByName: async(name, start = 0, limit =20)=>{
       const account_id =  get(account_guid)
        const url =`/accounts/${account_id}/students`

            const options ={
                params:{
                    search:name,
                    _start: start,
                    _limit:limit,
                    _extend:'license,limit',
                    token:kcToken
                }
            }
        const res = await apiGet(url, options)

        return res
    }

}