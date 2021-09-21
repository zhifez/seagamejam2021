<script>
    import { dungeonSize } from '../../../stores/gameData';
    import CrownActionTile from './CrownActionTile.svelte';

    export let index = -1;
    export let name = '';
    export let hint = '';
    export let type = 'action';
</script>

<div class="col-span-2 row-span-4">
    <div class="rounded-md bg-yellow-400 shadow-md h-full px-3 py-2 flex flex-col justify-between">
        <section class="text-center">
            <h1 class="font-semibold text-md xl:text-2xl">{name}</h1>
            {#if hint}<p class="text-xs xl:text-base">{hint}</p>{/if}
        </section>
        <div class="m-auto">
            <div class={`grid grid-cols-${dungeonSize} gap-2`}>
                {#each Array(dungeonSize) as _, y}
                    {#each Array(dungeonSize) as _, x}
                    <div class="col-span-1">
                        <CrownActionTile 
                            x={x} 
                            y={y}
                        />
                    </div>
                    {/each}
                {/each}
            </div>
        </div>
        <p class="text-xs xl:text-base">
            <b>Rule:</b> The next layer of Crown challenges will be unlocked after two third of the current layer's challenges are solved.
        </p>
    </div>
</div>