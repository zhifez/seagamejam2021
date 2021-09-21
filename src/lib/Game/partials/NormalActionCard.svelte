<script>
    import { humanHires, itemIconMap } from '../../../stores/gameData';
    import { game, canTakeAction, takeAction, refreshTradableItems } from '../../../stores/game.store';
    import Tooltip from '../../../components/Tooltip.svelte';
    import FaCrow from 'svelte-icons/fa/FaCrow.svelte';
    import IoMdRefresh from 'svelte-icons/io/IoMdRefresh.svelte';
    import HumanHireCard from './HumanHireCard.svelte';
    import { failure } from '../../../common/toastTheme';
    import TradeItemCard from './TradeItemCard.svelte';

    export let index = -1;
    export let name = '';
    export let hint = '';
    export let note = '';
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

    const onTakeAction = (selectedActionIndex) => {
        const error = canTakeAction(index, selectedActionIndex);
        if (error) {
            failure(error);
            return;
        }

        takeAction(index, selectedActionIndex);
    }

    const onRefreshItems = () => {
        // TODO: Check whether can refresh items

        refreshTradableItems();
    }
</script>

<div class={`col-span-1 row-span-${rows}`}>
    <div 
        class={`rounded-md bg-yellow-300 shadow-md h-full p-2 pb-3
        flex flex-col justify-between
        `}
    >
        <section class="mb-2 text-center">
            <h1 class="font-semibold text-md xl:text-2xl">{name}</h1>
            {#if hint}<p class="text-xs xl:text-base">{hint}</p>{/if}
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
                    class={`w-full h-12 xl:h-20 rounded-md p-1 cursor-pointer relative
                    ${(action.conditions && action.conditions.length > 0
                    && (!action.rewards || action.rewards.length <= 0)) ? 'rounded-full bg-yellow-500' : 'bg-white'}
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

                    {#if index in $game.roundActions && (a + s) in $game.roundActions[index]}
                    <div 
                        class={`absolute top-4 w-full h-full text-${$game.roundActions[index][a + s][0]}
                        ${type.includes('reproduce') ? 'opacity-80' : ''}
                        `}
                    >
                        <FaCrow />
                    </div>
                    {#if type.includes('reproduce')}
                    <div class={`absolute top-6 left-4 z-10 w-full h-full text-${$game.roundActions[index][a + s][0]}`}>
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

        {#if type.includes('trade') || type.includes('human')}
        <div class="flex flex-col justify-between h-full">
            <!-- TRADE -->
            {#if type.includes('trade')}
            <div class="grid grid-cols-4 gap-2">
                {#each $game.tradableItems as item}
                <div class="col-span-1">
                    <TradeItemCard data={item} />
                </div>
                {/each}
            </div>
            
            <div class="flex justify-center">
                <Tooltip
                    title="Costs 2 Gems"
                >
                    <button 
                        class="text-sm mt-2"
                        on:click={onRefreshItems}
                    >
                        <div class="flex item-center justify-center">
                            <div class="h-5 mr-2">
                                <IoMdRefresh />
                            </div>
                            <span>Refresh Items</span>
                        </div>
                    </button>
                </Tooltip>
            </div>
            {/if}

            <!-- HUMAN HIRE -->
            {#if type.includes('human')}
            <div class="grid grid-cols-4 xl:grid-cols-4 gap-2">
                {#each Object.keys(humanHires) as key, k}
                <Tooltip
                    title={humanHires[key].name}
                    subtitle="Click to view card details."
                >
                    <HumanHireCard 
                        actionIndex={k}
                        data={humanHires[key]} 
                    />
                </Tooltip>
                {/each}
            </div>
            {/if}

            <div class="relative h-10 bg-yellow-500 rounded-md">
                {#if index in $game.roundActions}
                {#each Object.keys($game.roundActions[index]) as key, k}
                {#each $game.roundActions[index][key] as action, a}
                <div 
                    class={`absolute bottom-${6 - a * 2} w-10 h-10
                    text-${action}
                    `}
                    style={`left: ${parseInt(key) * 25 + (a % 2) * 5}%;`}
                >
                    <FaCrow />
                </div>
                {/each}
                {/each}
                {/if}
            </div>
        </div>
        {/if}

        {#if note}
        <p class="text-xs xl:text-base mt-2">
            <b>Note:</b> {note}
        </p>
        {:else}
        <span></span>
        {/if}
    </div>
</div>