<script>
    import { humanHires, itemIconMap } from '../../../stores/gameData';
    import Tooltip from '../../../components/Tooltip.svelte';

    export let key = '';
    export let orKeys = [];
    export let quantity = 0;

    let title = key;
    let icon;
    let iconColor = 'text-black';
    $: {
        if (key in itemIconMap) {
            title = key;
            icon = itemIconMap[key].icon;
            iconColor = itemIconMap[key].iconColor;
        }
        if (key in humanHires) {
            title = humanHires[key].name;
            icon = humanHires[key].icon;
        }
    }
</script>

<Tooltip
    title={title}
>
    <div class="px-2 py-1 flex justify-between items-center bg-white rounded-md">
        {#if key in itemIconMap}
        <div class={`w-6 h-5 ${iconColor}`}>
            <svelte:component this={icon} />
        </div>
        {:else if key in humanHires}
        <div class={`w-6 h-5 text-black`}>
            <svelte:component this={icon} />
        </div>
        {:else}
        <p>{key}</p>
        {/if}
        <p class="text-black">x {quantity}</p>
    </div>
</Tooltip>