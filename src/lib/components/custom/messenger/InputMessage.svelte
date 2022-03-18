<script>
    //ui
    import {IconSend} from "/src/lib/components/icons/icon-pack";
    //services
    import {Matrix} from "/src/services/Matrix.js";

    //Data
    export let is_active;

    //store
    import {selected_chat} from "/src/store.js";

    const body = document.querySelector('body');
    let messageText = '';
    let sendTextButton = false;

    // Computed
    $: messageText.length >= 1 ? sendTextButton = false : sendTextButton = true;
    $: is_active ? body.classList.add('no-scroll') : body.classList.remove('no-scroll')

    const sendMessage = async() =>{
        sendTextButton = false

        if(!messageText){
            return false
        }
        await Matrix.send_message($selected_chat, messageText)
        messageText = '';
    }

</script>


<div class="kc-messenger__message-field">
    <textarea
            placeholder="Message to Someone"
            bind:value={messageText}
    ></textarea>
    <button
            on:click={sendMessage}
            class="kc-btn kc-btn-action messenger-send-btn {sendTextButton ? 'is-disabled' : ''}"
            disabled={sendTextButton}>
        <IconSend/>
        <!--{$_('app.messenger.send_message', {default: "Send messsage"})}-->
        Send messsage
    </button>
</div>