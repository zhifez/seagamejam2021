<script>
    import Tooltip from '../../../components/Tooltip.svelte';
    import GiTrade from 'svelte-icons/gi/GiTrade.svelte';
    
    export let data;
</script>

<Tooltip
    title={data.name}
    subtitle="Click to learn more."
>
    <div class="h-16 xl:h-24 rounded-md bg-yellow-700 text-white flex item-center p-2 cursor-pointer">
        {#if data.icon}
        <svelte:component this={data.icon} />
        {:else}
        <GiTrade />
        {/if}
    </div>
</Tooltip>