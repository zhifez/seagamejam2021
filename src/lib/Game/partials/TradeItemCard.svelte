<script>
    import { setActiveTradeItem } from '../../../stores/game.store';
    import Tooltip from '../../../components/Tooltip.svelte';
    import GiTrade from 'svelte-icons/gi/GiTrade.svelte';
    
    export let actionIndex = -1;
    export let data;

    const onClick = () => {
        setActiveTradeItem({...data, actionIndex});
    }
</script>

{#if data.sold}
<div 
    class={`h-16 xl:h-24 rounded-md border-2 border-yellow-700 border-dotted
    flex flex-col justify-center
    `}
>
    <p class="text-yellow-700 text-center text-xs">SOLD</p>
</div>
{:else}
<Tooltip
    title={data.name}
    subtitle="Click to view card details."
>
    <div 
        class="h-16 xl:h-24 rounded-md bg-yellow-700 text-white flex items-center p-2 cursor-pointer"
        on:click={onClick}    
    >
        {#if data.icon}
        <svelte:component this={data.icon} />
        {:else}
        <GiTrade />
        {/if}
    </div>
</Tooltip>
{/if}