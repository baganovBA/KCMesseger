<script>
import {selected_chat} from "./store.js";
import {beforeUpdate,afterUpdate, tick} from 'svelte'
export let joinEventsResult

import {Matrix} from "./services/Matrix.js";
import {onMount} from "svelte";

let messageText;


const sendMessage = async ()=>{
    // for (let i = 0; i < 120; i++) {
    //     await new Promise(async(resolve)=>{
    //         await Matrix.send_message($selected_chat, `${i}`)
    //         resolve()
    //     })
    // }
    await Matrix.send_message($selected_chat, messageText)
    messageText = ''
}
let last_message_id;
let limit = 0
let onceWorking = true
const getRoomMessages = async (entry) => {
    // if(entry[0].isIntersecting === joinEventsResult[$selected_chat]['m.room.message'][0].event_id){
    if(entry[0].isIntersecting && onceWorking){
        onceWorking = false
        limit +=20
        const res_mess = await Matrix.room_messages($selected_chat, limit)
        console.log('res_mess',res_mess)
        console.log('joinEventsResult[$selected_chat]',joinEventsResult[$selected_chat])
        last_message_id = joinEventsResult[$selected_chat]['m.room.message'][0].event_id
        console.log('last_message_id BODY',joinEventsResult[$selected_chat]['m.room.message'][0].content.body);
        if(res_mess?.chunk?.length > 0){
            res_mess['chunk'].reverse()
            joinEventsResult[$selected_chat]['m.room.message'] = [...res_mess['chunk']]
        }
        onceWorking = true
    }
}
const virtualScroll =async ()=>{
    await tick();
    const observer = new IntersectionObserver(entry=> {
        getRoomMessages(entry)

    },{
        threshold: 1.0
    })
    const message_container = document.querySelectorAll('.message_container')
    observer.observe(message_container[0])
}
let messages_window
let autoscroll
beforeUpdate(() => {
    autoscroll = messages_window && (messages_window.offsetHeight + messages_window.scrollTop) > (messages_window.scrollHeight - 20);

});

afterUpdate(()=>{

    if(last_message_id){
        let last_message = document.getElementById(last_message_id)
        console.log('last_message',last_message.offsetHeight, last_message.offsetTop);
        messages_window.scrollTo(0,last_message.offsetTop - (last_message.offsetHeight-20))
        last_message_id = false
    }
})

// $: {$selected_chat,virtualScroll()}

</script>

<div class="chat_container" >
    <div class="messages" bind:this={messages_window} on:scroll={()=>virtualScroll()}>
        {#if $selected_chat && joinEventsResult[$selected_chat]?.['m.room.message']}
            {#each joinEventsResult[$selected_chat]['m.room.message']  as message}
                <div class="message_container" id={message.event_id}>
                    <span>From</span> <b>{message.sender}</b>
                    <p>{message.content.body}</p>
                </div>
            {/each}
        {/if}
    </div>
    <div class="input_message_container">
        <input type="text"  bind:value={messageText} on:keypress={(e)=>{ if (e.code === 'Enter') sendMessage() }}>
        <button on:click={sendMessage}>Send</button>
    </div>
</div>

<style>
    .chat_container{
        width: 400px;
        height: 100vh;
        border: 1px solid black;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }
    .input_message_container{
        width: 100%;
        height: min-content;
        border-top: 1px solid black;
    }
    .message_container{
        vertical-align: bottom;
    }
    .messages{
        height:calc(100% - 40px);
        overflow: scroll;
    }
</style>


