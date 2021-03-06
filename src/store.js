import { writable } from 'svelte/store';

export const kc_token = writable('')
export const api_user_guid = writable('')
export const account_guid = writable('')


export const matrix_token = writable('')
export const matrix_url = writable('')
export const matrix_server = writable('')
export const matrix_user_guid = writable('')
export const matrix_since = writable('')
export const timeout = writable(60000)

export const selected_chat =writable('')

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


export const chats = writable([]);
export const joined_chats_rooms = syncJoinedRooms()