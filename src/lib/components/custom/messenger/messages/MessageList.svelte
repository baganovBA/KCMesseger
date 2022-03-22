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
    import {formatDate} from "../../../../helpers/formatDate.js";
    import {afterUpdate, beforeUpdate} from "svelte";

    let messagesData ={}
    let onceIntersectionWorking = true

    let firstOpen

    let loading
    
    let messages_window
    let last_mess_before_update_id
    let lat_mess_before_update_text

    const optionsIntersection = {
        root: messages_window,
        threshold: 1.0
    }

    const intersectionCallback = async entry=> {
        if(entry[0].isIntersecting && onceIntersectionWorking){
            onceIntersectionWorking = false
            console.log('textContent',entry[0].target.textContent);
            observer.unobserve(entry[0].target)
            last_mess_before_update_id = entry[0].target.id;
            await getMoreMessages()
            onceIntersectionWorking = true
            observer = null;
        }
    }


    $:{$roomsMessages; computingMessages(get(roomsMessages))}
    $:{$selected_chat; last_mess_before_update_id = $selected_chat && get(roomsMessages)[$selected_chat].messages[0].event_id}
    $:{$selected_chat; observer = null}
    $:{$selected_chat; firstOpen = true}



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
}
    // selected_chat, roomsMessages
    const computingMessages =(messagesObj)=>{
        for (let roomId in messagesObj){
            let room =  messagesObj[roomId]

            if(!room.hasOwnProperty('sorted_messages')){
            }
            room.sorted_messages ={}

           room.messages.forEach((message)=>{
                message['date'] = formatDate(message.origin_server_ts,'DD/MM/YYYY')

                if(!room.sorted_messages.hasOwnProperty(message.date)){
                    room.sorted_messages[message.date] = [message]
                }else{
                    room.sorted_messages[message.date].push(message)
                }
            })
        }
    }

    let last_message
    let observer = null
    const viewScroll = async () =>{

        firstOpen = false

        if(!observer){
            observer = new IntersectionObserver( intersectionCallback, optionsIntersection)
            last_message = messages_window.querySelector('.kc-messenger__message')
            console.log('textContent',last_message.textContent);
            observer.observe(last_message)
        }
    }

    afterUpdate(()=>{
        if(firstOpen && messages_window){
            messages_window.scrollTo(0,messages_window.scrollHeight)
        }
        if(last_mess_before_update_id){
            let last_message1 = document.getElementById(last_mess_before_update_id)
            last_message1.scrollIntoView(true)
            last_mess_before_update_id = false
        }
    })
</script>

<div class="kc-messenger__messages" bind:this={messages_window} on:scroll={viewScroll}>
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