import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc'
import timezone from "dayjs/plugin/timezone";
import {get} from "svelte/store";
import {time_zone} from '/src/store.js'

dayjs.extend(utc)
dayjs.extend(timezone)

export const formatDate = (timestamp, format = 'DD/MM/YYYY') =>{
    let timeZone = get(time_zone)

    console.log(timeZone)
    return  dayjs(timestamp).tz(timeZone).format(format)
}