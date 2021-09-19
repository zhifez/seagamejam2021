<script>
    import { setActiveHumanHire } from '../../../stores/game.store';

    export let actionIndex = -1;
    export let data;

    const onClick = () => {
        setActiveHumanHire({...data, actionIndex});
    }
</script>

<div 
    class="col-span-1 h-20 rounded-md shadow bg-yellow-700 flex flex-col justify-center cursor-pointer"
    on:click={onClick}
>
    <div class="mx-auto w-14 text-white">
        <svelte:component this={data.icon} />
    </div>
</div>