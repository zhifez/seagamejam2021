<script>
import FaCrow from 'svelte-icons/fa/FaCrow.svelte';

    import { humanHires, itemIconMap, tradeItems } from '../stores/gameData';
    import Tooltip from './Tooltip.svelte';

    export let key = '';
    export let orKeys = [];
    export let quantity = 0;
    export let colSpace = 2;
    export let colStart = 0;

    let allKeys = [
        key,
        ...(orKeys ?? [])
    ];
    let title = '';
    let items = [];
    $: {
        items = [];
        for (let a=0; a<allKeys.length; ++a) {
            let key = allKeys[a];
            if (key in itemIconMap) {
                items.push({
                    name: itemIconMap[key].name,
                    icon: itemIconMap[key].icon,
                    iconColor: itemIconMap[key].iconColor
                });
            }
            else if (key in tradeItems) {
                items.push({
                    name: tradeItems[key].name,
                    icon: tradeItems[key].icon,
                    iconColor: tradeItems[key].iconColor
                });
            }
            else if (key in humanHires) {
                items.push({
                    name: humanHires[key].name,
                    icon: humanHires[key].icon,
                });
            }
            else if (key === 'vp') {
                items.push({
                    name: 'Victory Points',
                });
            }
            else {
                items.push({
                    name: key,
                    icon: FaCrow,
                });
            }

            if (a > 0) {
                title += '/';
            }
            title += items[items.length - 1].name;
        }
    }
</script>

<div class={`${colStart > 0 ? `col-start-${colStart}` : ''} col-span-${colSpace}`}>
    <Tooltip
        title={title}
    >
        <div class="p-1 pr-2 flex justify-between items-center bg-white rounded-md">
            <div class="flex items-center">
                {#each items as item, i}
                {#if i > 0}/{/if}
                {#if item.icon}
                <div class={`w-5 h-5 ${item.iconColor ?? 'text-black'}`}>
                    <svelte:component this={item.icon} />
                </div>
                {:else}
                <p class="p-1 rounded-md text-xs text-white bg-black uppercase cursor-default">
                    {key}
                </p>
                {/if}
                {/each}
            </div>
            <p class="text-black">x {quantity}</p>
        </div>
    </Tooltip>
</div>