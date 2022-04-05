import { writable } from 'svelte/store';

export const kc_token = writable('')
export const api_user_guid = writable('')
export const account_guid = writable('')


export const matrix_token = writable('')
export const matrix_url = writable('')
export const matrix_server = writable('')
export const matrix_user_guid = writable('')
export const matrix_since = writable('')
export const time_zone = writable('')
export const user_type = writable('')
export const timeout = writable(60000)
export const messages_is_changed = writable(false)

export const selected_chat =writable('')

export const roomsMessages = writable({})

export const chats = writable([]);
export const joined_chats_rooms = syncJoinedRooms()


function syncJoinedRooms(){
    const { subscribe, set, update } = writable([]);

    return {
        subscribe,
        set: (i) => set(i),
        decrement: () => {},
        reset: () => {}
    }
}


function syncChats() {
    const { subscribe, set, update } = writable({});

    return {
        subscribe,
        set: () => {},
        decrement: () => {},
        reset: () => {}
   };
}


