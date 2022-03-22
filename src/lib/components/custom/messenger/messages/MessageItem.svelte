<div class="kc-messenger__message" id={ids} >
  <div class="kc-messenger__message-avatar">
    <img src="{img}" alt="">
  </div>
  <div class="kc-messenger__message-info">
    <span class="kc-messenger__message-name">
      {name}
      <span class="kc-messenger__message-time">{time}</span>
    </span>
    <span class="kc-messenger__message-msg">{@html msg}</span>
  </div>
</div>

<script lang="ts">
  // Props
  export let img:string;
  export let name:string;
  export let msg:string;
  export let time:string;
  export let ids:string;

</script>