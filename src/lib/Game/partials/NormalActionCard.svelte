<script>
    import { onMount } from 'svelte';
    import { humanHires, itemIconMap, nestCapacityPerLevel, storageCapacityPerLevel } from '../../../stores/gameData';
    import { game, playerCanTakeAction, takeAction } from '../../../stores/game.store';
    import Tooltip from '../../../components/Tooltip.svelte';
    import FaCrow from 'svelte-icons/fa/FaCrow.svelte';
    import IoMdRefresh from 'svelte-icons/io/IoMdRefresh.svelte';
    import HumanHireCard from './HumanHireCard.svelte';

    export let index = -1;
    export let name = '';
    export let hint = '';
    export let type = 'action';
    export let actions = [];
    export let rows = 1;

    let activePlayer;
    $: {
        activePlayer = $game.players[$game.turn];
        if (type.includes('upgrade')) {
            if (actions[0].conditions
                && actions[0].conditions.length > 0) {
                hint = 'Requires';
                actions[0].conditions.forEach((cond, index) => {
                    let quantity = cond.quantity;
                    if (type.includes('nest')) {
                        quantity += cond.additionPerLevel * (activePlayer.nestLevel - 1);
                    }
                    else if (type.includes('storage')) {
                        quantity += cond.additionPerLevel * (activePlayer.storageLevel - 1);
                    }
                    if (quantity > 0) {
                        if (index > 0) {
                            hint += ' and';
                        }
                        
                        hint += ` ${quantity} ${cond.key}${quantity > 1 ? 's' : ''}`;
                    }
                });
                hint += '.';
            }
        }
    }

    onMount(() => {
        onRefreshTradeActions();
    });

    let tradeActions = [];
    const onRefreshTradeActions = () => {
        tradeActions = [];
    }

    const onTakeAction = (selectedActionIndex) => {
        if ($game.canEndRound) {
            alert('The round has ended.');
            return;
        }

        if (activePlayer.hasTakenAction) {
            alert('You have already taken an action!\nTake a Crown Action or end your turn.');
            return;
        }

        if (index in $game.actions) {
            if (selectedActionIndex in $game.actions[index]) {
                alert('Action has already been taken.');
                return;
            }
        }
        
        const error = playerCanTakeAction(activePlayer, index, selectedActionIndex);
        if (error) {
            alert(error);
            return;
        }

        takeAction(index, selectedActionIndex);
    }
</script>

<div class={`col-span-1 row-span-${rows}`}>
    <div 
        class={`rounded-md bg-yellow-300 shadow-md h-full p-2 pb-3
        flex flex-col
        `}
    >
        <section class="mb-2 text-center">
            <h1 class="font-semibold">{name}</h1>
            {#if hint}<p class="text-xs 2xl:text-sm">{hint}</p>{/if}
        </section>
        
        {#if actions}
        <div class="grid grid-cols-4 gap-2">
            {#each actions as action, a}
            {#each Array(action.space <= 0 ? ($game.players.length + action.space) : action.space) as _, s}
            <Tooltip
                title={action.name}
                subtitle={action.hint}
            >
                <div 
                    class={`w-full h-12 rounded-md bg-white p-1 cursor-pointer relative
                    ${(action.conditions && action.conditions.length > 0
                    && (!action.rewards || action.rewards.length <= 0)) ? 'rounded-full' : ''}
                    `}
                    on:click={() => onTakeAction(a + s)}
                >
                    {#if action.rewards}
                    <div class="grid grid-cols-2 gap-1">
                        {#each action.rewards as reward, r}
                        {#if reward.key in itemIconMap}
                        {#each Array(reward.quantity) as _, i}
                        {#if reward.key in itemIconMap}
                        <div class={`col-span-1 ${itemIconMap[reward.key].iconColor}`}>
                            <svelte:component this={itemIconMap[reward.key].icon} />
                        </div>
                        {:else}
                        <div class="col-span-1">
                            <p>reward.key</p>
                        </div>
                        {/if}
                        {/each}
                        {/if}
                        {/each}
                    </div>
                    {/if}

                    {#if index in $game.actions && (a + s) in $game.actions[index]}
                    <div 
                        class={`absolute top-4 w-full h-full text-${$game.actions[index][a + s]}
                        ${type.includes('reproduce') ? 'opacity-80' : ''}
                        `}
                    >
                        <FaCrow />
                    </div>
                    {#if type.includes('reproduce')}
                    <div class={`absolute top-6 left-4 z-10 w-full h-full text-${$game.actions[index][a + s]}`}>
                        <FaCrow />
                    </div>
                    {/if}
                    {/if}
                </div>
            </Tooltip>
            {/each}
            {/each}
        </div>
        {/if}

        <!-- TRADE -->
        {#if type.includes('trade')}
        <!-- {#each tradeActions as action}

        {/each} -->

        <button 
            class="text-sm mt-2"
            on:click={onRefreshTradeActions}
        >
            <div class="flex item-center justify-center">
                <div class="h-5 mr-2">
                    <IoMdRefresh />
                </div>
                <span>Refresh Items</span>
            </div>
        </button>
        {/if}

        <!-- HUMAN HIRE -->
        {#if type.includes('human')}
        <div class="grid grid-cols-3 gap-2">
            {#each Object.keys(humanHires) as key, k}
            <Tooltip
                title={humanHires[key].name}
                subtitle="Click to learn more."
            >
                <HumanHireCard 
                    actionIndex={k}
                    data={humanHires[key]} 
                />
            </Tooltip>
            {/each}
        </div>
        {/if}
    </div>
</div>