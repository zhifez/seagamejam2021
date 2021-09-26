<script>
    import { game } from '../../../stores/game.store';
    import { currentCrownChallengeCount, dungeonSize } from '../../../stores/gameData';
    import CrownActionTile from './CrownActionTile.svelte';

    export let index = -1;
    export let name = '';
    export let hint = '';
    export let note = '';
    export let type = 'action';

    let totalInLayer;
    let completedInLayer;
    $: {
        let layer = $game.crownActionLayer;
        totalInLayer = currentCrownChallengeCount(layer);
        if ($game.players.length <= 1) {
            totalInLayer = Math.round(totalInLayer * 1/4);
        }
        else {
            totalInLayer = Math.round(totalInLayer * 2/3);
        }

        completedInLayer = 0;
        let completedActions = $game.completedCrownActions;
        if (completedActions && Object.keys(completedActions).length > 0) {
            Object.keys(completedActions).forEach(key => {
                Object.keys(completedActions[key]).forEach(subKey => {
                    if (completedActions[key][subKey].layer === layer) {
                        ++completedInLayer;
                    }
                });
            });
        }
    }
</script>

<div class="col-span-2 row-span-4">
    <div class="rounded-md bg-yellow-400 shadow-md h-full px-3 py-2 flex flex-col justify-between">
        <section class="text-center">
            <h1 class="font-semibold text-md 2xl:text-2xl">{name}</h1>
            <p class="text-xs flex items-center justify-center">
                Complete {totalInLayer} challenges to unlock the next layer (Current: {completedInLayer}/{totalInLayer}).
            </p>
            <!-- {#if hint}<p class="text-xs 2xl:text-base">{hint}</p>{/if} -->
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
        {#if note}
        <p class="text-xs 2xl:text-base">
            <b>Note:</b> {note}
        </p>
        {/if}
    </div>
</div>