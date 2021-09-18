<script>
    import { dungeonSize } from '../../../stores/gameData.store';
    import CrownActionTile from './CrownActionTile.svelte';

    export let name = '';
    export let hint = '';
    export const type = 'action';
</script>

<div class="col-span-2 row-span-3">
    <div class="rounded-md bg-yellow-400 shadow-md h-full px-3 py-2 flex flex-col justify-between">
        <section>
            <h1 class="font-semibold">{name}</h1>
            {#if hint}<p class="text-xs 2xl:text-sm">{hint}</p>{/if}
        </section>
        <div class="m-auto">
            <div class={`grid grid-cols-${dungeonSize} gap-2`}>
                {#each Array(dungeonSize) as _, y}
                    {#each Array(dungeonSize) as _, x}
                    <div class="col-span-1">
                        <CrownActionTile x={x} y={y} />
                    </div>
                    {/each}
                {/each}
            </div>
        </div>
    </div>
</div>