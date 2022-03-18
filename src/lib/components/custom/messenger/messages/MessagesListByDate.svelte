<script>
    import MessageItem from "./MessageItem.svelte";
    import * as dayjs from 'dayjs'
    import cloneDeep from "lodash.clonedeep";

    export let messagesArray;
    export let date

    // $:{messagesArray ; cloneDeep(messagesArray.reverse()) }


</script>


{#if messagesArray.length}
    <span class="kc-messenger__message-date">{dayjs(date).format('dddd, MMMM DD')}</span>
    {#each messagesArray as message}
        <MessageItem
                img={'/images/dev/userpic-kc.png'}
                name={message.sender}
                msg={message.content.formatted_body}
                time={dayjs(message.origin_server_ts).format('HH:mm')}
        />
    {/each}
{/if}