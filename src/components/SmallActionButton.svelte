<script>
    import { createEventDispatcher } from 'svelte';

    export let textClass = 'text-sm';
    export let block = false;
    export let disabled = false;

    const dispatch = createEventDispatcher();

    const onClick = () => {
        dispatch('click');
    }
</script>

<button 
    class={`${textClass} mt-2 px-2 py-1 rounded-md bg-yellow-800 text-white
    ${disabled ? 'opacity-50' : 'hover:bg-yellow-700'}
    ${block ? 'w-full' : ''}
    `}
    on:click={onClick}
    disabled={disabled}
>
    <slot />
</button>