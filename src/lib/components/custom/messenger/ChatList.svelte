<script>
    import ChatItem from "./ChatItem.svelte";

    //props
    export let chatRoomsData

    //store
    import {selected_chat} from "/src/store.js";



</script>

<div class="kc-messenger__contacts">
    {#if Object.keys(chatRoomsData).length > 0}

        {#each Object.keys(chatRoomsData).sort((a,b)=>chatRoomsData[b]['m.room.message'][chatRoomsData[b]['m.room.message'].length-1].origin_server_ts - chatRoomsData[a]['m.room.message'][chatRoomsData[a]['m.room.message'].length-1].origin_server_ts) as room }
            <ChatItem
                    img={'/images/dev/userpic-kc.png'}
                    is_active={room === $selected_chat}
                    name={chatRoomsData[room]?.['m.room.name']?.[0]?.['content']?.["name"]}
                    msg={chatRoomsData[room]?.['m.room.message']?.[(chatRoomsData[room]?.['m.room.message'].length - 1)].content.body}
                    time={`${new Date(chatRoomsData[room]?.['m.room.message']?.[(chatRoomsData[room]?.['m.room.message'].length - 1)].origin_server_ts).getHours()}:${new Date(chatRoomsData[room]?.['m.room.message']?.[(chatRoomsData[room]?.['m.room.message'].length - 1)].origin_server_ts).getMinutes()}`}
                    msg_count={chatRoomsData[room]?.new_messages}
                    on:click={selected_chat.set(room)}
            />
        {/each}

    {/if}

    <!--            <ChatItem-->
    <!--                    img={'/images/dev/userpic-james.png'}-->
    <!--                    is_active={false}-->
    <!--                    name={'James Morris'}-->
    <!--                    msg={'You’ve beeh granted the access to the course ADA Compliance: Providing Reason...'}-->
    <!--                    time={'12:00'}-->
    <!--                    msg_count={4}-->
    <!--                    on:click={() => { showChat = true }}-->
    <!--            />-->

</div>

