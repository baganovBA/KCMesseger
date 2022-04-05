<script>
    import MessageItem from "./MessageItem.svelte";
    import MessagesListByDate from "./MessagesListByDate.svelte";
    import {get} from 'svelte/store'
    import cloneDeep from "lodash.clonedeep";

    //props
    export let chatRoomsData

    //store
    import {selected_chat, roomsMessages, matrix_since,messages_is_changed} from '/src/store.js'
    import {Matrix} from "/src/services/Matrix.js";
    import {formatDate} from "../../../../helpers/formatDate.js";
    import {afterUpdate, beforeUpdate} from "svelte";

    let roomsMessagesData ={}
    let onceIntersectionWorking = true
    let roomsMessagesState

    let loading_new_messages = false
    
    let messages_window
    let last_mess_before_update_id
    let lat_mess_before_update_text

    // $:{$roomsMessages; roomsMessagesData = cloneDeep(get(roomsMessages)); console.log("пересчет всего всего")}

    $:{$messages_is_changed; computingMessages(cloneDeep(get(roomsMessages))); console.log('messages_is_changed') }
    $:{$selected_chat; computingMessages(cloneDeep(get(roomsMessages))); console.log('ololol')}
    $:{$selected_chat; observer = null}
    $: loading_new_messages ? messages_window?.classList?.add('no-scroll') :  messages_window?.classList?.remove('no-scroll')


    const intersectionCallback = async entry=> {
        // console.log(entry[0].target.textContent);
        let select_chat = get(selected_chat)
        let roomMess = get(roomsMessages)
        // entry[0].isIntersecting && console.log(entry[0].isIntersecting,entry[0].target.id);
        if(entry[0].isIntersecting){
            $roomsMessages[select_chat].scroll_to_element = entry[0].target.id
            // console.log($roomsMessages[$selected_chat].scroll_to_element);
        }
        if(entry[0].target.id === roomMess?.[$selected_chat]?.messages[0].event_id){
            console.log('intersectionCallback',entry[0].target.textContent);
            // getMoreMessages()
        }
        // console.log('kc-messenger__top',document.querySelector('.kc-messenger__top').clientHeight);
        // console.log('boundingClientRect','top:',entry[0].boundingClientRect.top,'bottom:',entry[0].boundingClientRect.bottom);
        // console.log('intersectionRect','top:',entry[0].intersectionRect.top,'bottom:',entry[0].intersectionRect.bottom);
        // if(entry[0].isIntersecting && onceIntersectionWorking){
        //     if(!$roomsMessages[$selected_chat]?.fullData){
        //         onceIntersectionWorking = false
        //         console.log('textContent',entry[0].target.textContent);
        //         observer.unobserve(entry[0].target)
        //         last_mess_before_update_id = entry[0].target.id;
        //         loading_new_messages = true
        //         await getMoreMessages()
        //         onceIntersectionWorking = true
        //         observer = null;
        //     }
        // }
    }






const getMoreMessages = async() =>{
        console.log('get More')
    const limit = 20
    let select_chat = get(selected_chat)
    let since = $roomsMessages?.[select_chat]?.prev_batch


    observer = null;
    if($roomsMessages?.[select_chat]?.start_next_batch){
        since = $roomsMessages?.[select_chat]?.start_next_batch
    }

    const res_mess = await Matrix.room_messages(select_chat, limit, since)

    loading_new_messages = false

    if(res_mess){
        $roomsMessages[select_chat].start_next_batch = res_mess.end
    }

    if(res_mess?.chunk?.length){
        let resultsMessages = [...res_mess.chunk.reverse(), ...$roomsMessages?.[select_chat].messages]
        if(res_mess?.chunk?.length < limit){
            $roomsMessages[select_chat].fullData = true
        }
        $roomsMessages[select_chat].messages = resultsMessages
    }

    $messages_is_changed = !$messages_is_changed
}
    // selected_chat, roomsMessages
    const computingMessages =(messagesObj)=>{
        let sortedMessages ={}
        console.log('computingMessages messagesObj',messagesObj);
        for (let roomId in messagesObj){
            let room =  messagesObj[roomId]

            if(!room.hasOwnProperty('sorted_messages')){
            }
            // room.sorted_messages ={}
            sortedMessages[roomId] ={}

           room.messages.forEach((message)=>{
                message['date'] = formatDate(message.origin_server_ts,'DD/MM/YYYY')

                let date = formatDate(message.origin_server_ts,'DD/MM/YYYY')

                if(!sortedMessages[roomId].hasOwnProperty(date)){
                    sortedMessages[roomId][date] = [message]
                }else{
                    sortedMessages[roomId][date].push(message)
                }
            })
        }

        console.log('computingMessages messagesObj 23',messagesObj );
        console.log('computingMessages sortedMessages 23',sortedMessages );

        $roomsMessages = messagesObj

        roomsMessagesData = sortedMessages
        // console.log('roomsMessages',$roomsMessages)
    }

    let last_message
    let observer = null
    const viewScroll = async () =>{
        // console.log(messages_window.scrollHeight, (messages_window.clientHeight + messages_window.scrollTop));
        if(messages_window.scrollHeight === (messages_window.clientHeight + messages_window.scrollTop)){
            console.log('Обнулдение скрола')
            $roomsMessages[$selected_chat].scroll_to_element = ''
        }

        if(!observer){
            console.log('NEW OBSERVER!')
            let messages_container = document.querySelector('.kc-messenger__messages')
            let marginBottom = messages_container.clientHeight - 40
            console.log(marginBottom, messages_container.clientHeight)
            const optionsIntersection = {
                root: messages_container,
                rootMargin:`0px 0px -${marginBottom}px 0px`,
                threshold: 0
            }
            observer = new IntersectionObserver( intersectionCallback, optionsIntersection)

            last_message = messages_window.querySelector('.kc-messenger__message')
            // console.log('childNodes',messages_window.childNodes);
            // console.log('textContent',last_message.textContent);
            Array.from(messages_window.querySelectorAll('.kc-messenger__message')).forEach((message)=>{
                observer.observe(message)
            })
            // observer.observe(last_message)
        }
    }

    afterUpdate(()=>{
        console.log('selected_chat',$selected_chat)
        console.log('roomsMessagesData selected_chat',$roomsMessages[$selected_chat])
        console.log($roomsMessages[$selected_chat]?.scroll_to_element);
        if($roomsMessages?.[$selected_chat]?.scroll_to_element){
            let last_message = document.getElementById($roomsMessages[$selected_chat].scroll_to_element)
            last_message.scrollIntoView(true)
        }else{
            messages_window.scrollTo(0,messages_window.scrollHeight)
        }
        // if(firstOpen && messages_window){
        //     messages_window.scrollTo(0,messages_window.scrollHeight)
        // }
       // if(last_mess_before_update_id){
       //     let last_message1 = document.getElementById(last_mess_before_update_id)
       //     last_message1.scrollIntoView(true)
       //     last_mess_before_update_id = false
       // }
    })
</script>

<div class="kc-messenger__messages" bind:this={messages_window} on:scroll={viewScroll}>
    <button
            on:click={getMoreMessages}>
        More messages
    </button>
    {#if loading_new_messages}
        <div class="loading"></div>
    {/if}
<!--    <span class="kc-messenger__message-new">"new"</span>-->
    {#if Object.keys(roomsMessagesData?.[$selected_chat] || {}).length}
        {#each Object.keys(roomsMessagesData[$selected_chat]) as dateArrayMessages}
            <MessagesListByDate
            messagesArray={roomsMessagesData[$selected_chat][dateArrayMessages]}
            date={roomsMessagesData[$selected_chat]?.[dateArrayMessages][0].origin_server_ts}
            />
        {/each}
    {/if}

</div>