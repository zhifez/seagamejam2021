<script>
    import { itemIconMap } from '../../../stores/gameData';
    import { game, storageCapacityPerLevel, takeAction } from '../../../stores/game.store';
    import Tooltip from '../../../components/Tooltip.svelte';
    import FaCrow from 'svelte-icons/fa/FaCrow.svelte';

    export let index = -1;
    export let name = '';
    export let hint = '';
    export let type = 'action';
    export let actions = [];
    export let rows = 1;

    let activePlayer;
    $: {
        activePlayer = $game.players[$game.turn];
    }

    const onTakeAction = (actionIndex) => {
        if (activePlayer.hasTakenAction) {
            alert('You have already taken an action!\nTake a Crown Action or end your turn.');
            return;
        }

        if (index in $game.actions) {
            if (actionIndex in $game.actions[index]) {
                alert('Action has already been taken.');
                return;
            }
        }

        if (type === 'take-action') {
            if (activePlayer.storedItems.length >= activePlayer.storageLevel * storageCapacityPerLevel) {
                alert('Your Storage is full.');
                return;
            }
        }

        takeAction(index, actionIndex);
    }
</script>

<div class={`col-span-1 row-span-${rows}`}>
    <div 
        class={`rounded-md bg-yellow-300 shadow-md h-full p-2 pb-3
        flex flex-col
        `}
    >
        <section class="mb-2">
            <h1 class="font-semibold">{name}</h1>
            {#if hint}<p class="text-xs 2xl:text-sm">{hint}</p>{/if}
        </section>
        
        {#if actions}
        <div class="grid grid-cols-4 gap-2">
            {#each actions as action, a}
            {#each Array(action.space <= 0 ? ($game.players.length + action.space) : action.space) as _, s}
            <Tooltip
                title={action.name}
            >
                <div 
                    class="w-full h-12 rounded-md bg-gray-100 p-1 cursor-pointer relative"
                    on:click={() => onTakeAction(a)}
                >
                    <div class="grid grid-cols-2 gap-1">
                        {#each action.rewards as reward, r}
                        {#if reward.key in itemIconMap}
                        {#each Array(reward.quantity) as _, i}
                        <div class={`col-span-1 ${itemIconMap[reward.key].iconColor}`}>
                            <svelte:component this={itemIconMap[reward.key].icon} />
                        </div>
                        {/each}
                        {/if}
                        {/each}
                    </div>

                    {#if index in $game.actions && a in $game.actions[index]}
                    <div class={`absolute w-full h-full text-${$game.actions[index][a]}`}>
                        <FaCrow />
                    </div>
                    {/if}
                </div>
            </Tooltip>
            {/each}
            {/each}
        </div>
        {/if}
    </div>
</div>