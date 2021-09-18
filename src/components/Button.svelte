<script>
    import { createEventDispatcher } from 'svelte';

    export let label = '';
    export let hint = '';
    export let color = 'blue-500';
    export let hoverColor = 'blue-400';
    export let textColor = 'white';
    export let textClass = 'text-md';
    export let disabled = false;

    const dispatch = createEventDispatcher();

    const onClick = () => {
        if (disabled) {
            return;
        }

        dispatch('click');
    }
</script>

<button 
    class={`rounded-md shadow p-3 
    bg-${color} 
    text-${textColor}
    ${disabled ? 'opacity-50 cursor-default' : `hover:bg-${hoverColor}`}
    `}
    on:click={onClick}
>
    <span class="flex flex-col">
        <span class={textClass}>{label}</span>
        {#if hint}<span class="text-xs font-light">{hint}</span>{/if}
    </span>
</button>