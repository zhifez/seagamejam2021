<script>
    import { setActiveHumanHire } from '../../../stores/game.store';

    export let actionIndex = -1;
    export let data;

    const onClick = () => {
        setActiveHumanHire({...data, actionIndex});
    }
</script>

<div 
    class="relative col-span-1 p-1 py-2 rounded-md shadow bg-yellow-700 flex flex-col justify-center cursor-pointer"
    on:click={onClick}
>
    <div class="mx-auto w-full text-white">
        <svelte:component this={data.icon} />
    </div>
    {#if actionIndex < 0}
    <div class="absolute bottom-0 right-0 p-1 py-0.5 bg-red-500 rounded-md w-5">
        <p class="text-xs text-center text-white">{data.lifespan - data.hiredLifespan}</p>
    </div>
    {/if}
</div>