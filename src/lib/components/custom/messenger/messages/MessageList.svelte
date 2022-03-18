<script>
    import MessageItem from "./MessageItem.svelte";
    import MessagesListByDate from "./MessagesListByDate.svelte";
    import {get} from 'svelte/store'
    import cloneDeep from "lodash.clonedeep";
    import * as dayjs from 'dayjs'

    //props
    export let chatRoomsData

    //store
    import {selected_chat, roomsMessages, matrix_since} from '/src/store.js'
    import {Matrix} from "/src/services/Matrix.js";

    let messagesData ={}

    $:{$roomsMessages; computingMessages(get(roomsMessages))}


    let start
const getMoreMessages = async() =>{
        console.log('get More')

    let since = $roomsMessages?.[$selected_chat]?.prev_batch
    if(start){
        since = start
    }
    const res_mess = await Matrix.room_messages($selected_chat, 20, since)

    if(res_mess){
        start = res_mess.end
    }

    if(res_mess?.chunk?.length){

        let resultsMessages = [...res_mess.chunk.reverse(), ...$roomsMessages?.[$selected_chat].messages]
        $roomsMessages[$selected_chat].messages = resultsMessages

    }

    console.log(res_mess);
}
    // selected_chat, roomsMessages
    const computingMessages =(messagesObj)=>{
        let result
        for (let roomId in messagesObj){
            let room =  messagesObj[roomId]

            if(!room.hasOwnProperty('sorted_messages')){
            }
            room.sorted_messages ={}

           room.messages.forEach((message)=>{
                message['date'] = dayjs(message.origin_server_ts).format('DD/MM/YYYY')

                if(!room.sorted_messages.hasOwnProperty(message.date)){
                    room.sorted_messages[message.date] = [message]
                }else{
                    room.sorted_messages[message.date].push(message)
                }
            })
        }
        result = messagesObj
    }
</script>

<div class="kc-messenger__messages">
    <button
            on:click={getMoreMessages}>
        More messages
    </button>
<!--    <span class="kc-messenger__message-new">"new"</span>-->
    {#if Object.keys($roomsMessages?.[$selected_chat]?.sorted_messages || {}).length}
        {#each Object.keys($roomsMessages[$selected_chat]?.sorted_messages) as dateArrayMessages}
            <MessagesListByDate
            messagesArray={$roomsMessages[$selected_chat]?.sorted_messages[dateArrayMessages]}
            date={$roomsMessages[$selected_chat]?.sorted_messages[dateArrayMessages][0].origin_server_ts}
            />
        {/each}
    {/if}

</div>