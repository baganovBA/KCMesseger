<div class="kc-messenger__contact {is_active ? 'active' : ''}"
  use:events>
  <div class="kc-messenger__contact-avatar">
    <img src="{img}" alt="">
  </div>
  <div class="kc-messenger__contact-info">
    <span class="kc-messenger__contact-name">{name}</span>
    <span class="kc-messenger__contact-msg">{@html msg}</span>
    <div class="kc-messenger__contact-time">{time}</div>
    {#if msg_count}
      <span class="kc-messenger__contact-msg-count">{msg_count}</span>
    {/if}
  </div>
</div>

<script lang="ts">
  import { getEventsAction } from "../../ui/utils";
  import { current_component } from "svelte/internal";

  // Props
  export let is_active = false;
  export let img:string;
  export let name:string;
  export let msg:string;
  export let time:string;
  export let msg_count:string;

  // Methods
  const events = getEventsAction(current_component);
</script>