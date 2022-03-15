<button
  type={ native_type_list.includes(nativeType) ? nativeType : native_type_list[0] }
  use:events
  disabled={disabled}
  class={`kc-btn ${`kc-btn-${type}`} ${block ? 'kc-btn-block' : ''} ${disabled ? 'is-disabled' : ''} ${loading ? 'is-loading' : ''} ${$$props.class || ''}`}
  style={$$props.style || ''}
>
  <slot />
</button>

<script>
  import { current_component } from "svelte/internal";
  import { getEventsAction } from "./utils";
  import '../../../assets/scss/ui/button.scss'

  // Props
  export let disabled   = false;
  export let loading    = false;
  export let type       = "default";
  export let block      = false;
  export let nativeType = "button";

  // Data
  const native_type_list = ["button", "reset", "submit"];

  // Methods
  const events = getEventsAction(current_component);
</script>
