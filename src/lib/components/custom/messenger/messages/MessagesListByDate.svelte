<script>
    import MessageItem from "./MessageItem.svelte";
    import {formatDate} from '/src/lib/helpers/formatDate.js'
    import cloneDeep from "lodash.clonedeep";

    export let messagesArray;
    export let date

    // $:{messagesArray ; cloneDeep(messagesArray.reverse()) }


</script>


{#if messagesArray.length}
    <div>
    <span class="kc-messenger__message-date">{formatDate(date, 'dddd, MMMM DD')}</span>
    {#each messagesArray as message}
        <MessageItem
                ids={message.event_id}
                img={'/images/dev/userpic-kc.png'}
                name={message.sender}
                msg={message.content.formatted_body}
                time={formatDate(message.origin_server_ts, 'HH:mm')}
        />
    {/each}
    </div>
{/if}