<script>
    import { humanHires, itemIconMap, tradeItems } from '../../../stores/gameData';
    import Tooltip from '../../../components/Tooltip.svelte';

    export let key = '';
    export let orKeys = [];
    export let quantity = 0;

    let title = key.toUpperCase();
    let icon;
    let iconColor = 'text-black';
    $: {
        if (key in itemIconMap) {
            title = itemIconMap[key].name;
            icon = itemIconMap[key].icon;
            iconColor = itemIconMap[key].iconColor;
        }
        else if (key in tradeItems) {
            title = tradeItems[key].name;
            icon = tradeItems[key].icon;
            iconColor = tradeItems[key].iconColor;
        }
        else if (key in humanHires) {
            title = humanHires[key].name;
            icon = humanHires[key].icon;
        }
        else if (key === 'vp') {
            title = 'Victory Points'
        }
    }
</script>

<Tooltip
    title={title}
>
    <div class="px-2 py-1 flex justify-between items-center bg-white rounded-md">
        {#if icon}
        <div class={`w-6 h-5 ${iconColor ?? 'text-black'}`}>
            <svelte:component this={icon} />
        </div>
        {:else}
        <p class="p-1 rounded-md text-xs text-white bg-black uppercase cursor-default">
            {key}
        </p>
        {/if}
        <p class="text-black">x {quantity}</p>
    </div>
</Tooltip>