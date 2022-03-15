<script>
    import MessageItem from "./MessageItem.svelte";

    //props
    export let chatRoomsData

    //store

    import {selected_chat} from '/src/store.js'
</script>

<div class="kc-messenger__messages">
    <span class="kc-messenger__message-new">"new"</span>

    <span class="kc-messenger__message-date">Thursday, November 16th</span>
    {#if chatRoomsData?.[$selected_chat]?.['m.room.message'].length}
        {#each chatRoomsData?.[$selected_chat]?.['m.room.message'] as message}
            <MessageItem
                    img={'/images/dev/userpic-kc.png'}
                    name={message.sender}
                    msg={message.content.formatted_body}
                    time={new Date(message.origin_server_ts)}
            />

        {/each}
    {/if}


    <!--            <span class="kc-messenger__message-new">{$_('app.messenger.new', {default: "new"})}</span>-->
</div>