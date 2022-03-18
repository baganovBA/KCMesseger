<script context="module">
	export const prerender = false;
</script>

<script>
  // import { _ } from '$lib/services/i18n';
  import { fade } from "svelte/transition";

  // Directives
  import { clickOutside } from '../../../directives/clickOutside.ts';

  // Components
  import { IconSend, IconArrowLeft } from '../../icons/icon-pack';
	import Button from '../../ui/Button.svelte';
  import ChatList from "./ChatList.svelte";
  import InputMessage from "./InputMessage.svelte";
  import MessageList from "./messages/MessageList.svelte";

  //styles
  import '../../../../assets/scss/messenger/messenger.scss'

  // Data
  const body = document.querySelector('body');
  let messageText = '';
  let sendTextButton = false;
  let showChat = false;

  // Props
  export let is_active = false;
  export let chatRoomsData;

  // Computed
  $: messageText.length >= 1 ? sendTextButton = false : sendTextButton = true;
  $: is_active ? body.classList.add('no-scroll') : body.classList.remove('no-scroll')
</script>

{#if is_active}
  <div class="kc-messenger__background" transition:fade>

    <div class="kc-messenger__content-wrap"
         use:clickOutside
         on:click_outside={() => is_active = false}
         transition:fade>
      <div class="kc-messenger__top">
        <span class="bottom-modal-menu__title">
          <!--{$_('app.messenger.title', {default: "Messenger"})}-->
              Messenger
        </span>
        <Button
                on:click={() => is_active = false}
                class="kc-btn__close">
          <!--{$_('app.actions.close', {default: "Close"})}-->
          Close
        </Button>
      </div>

      <div class="kc-messenger__wrap {showChat ? 'active': ''}">

        <div class="kc-messenger__contacts-list">
          <ChatList chatRoomsData={chatRoomsData}/>
        </div>

        <div class="kc-messenger__message-wrap">

          <button class="kc-messenger__back-btn kc-btn kc-btn-default"
                  on:click={() => { showChat = false }}>
            <IconArrowLeft/>Back to contacts
          </button>

          <MessageList chatRoomsData={chatRoomsData} />

          <InputMessage is_active={is_active}/>


        </div>

      </div>

    </div>

  </div>
{/if}