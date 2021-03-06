<script>
    import { humanHires, itemIconMap } from '../../../stores/gameData';
    import { game, canTakeAction, takeAction, refreshTradableItems, hasEnoughItem, useItem, setExchangeItemsInfo } from '../../../stores/game.store';
    import Tooltip from '../../../components/Tooltip.svelte';
    import FaCrow from 'svelte-icons/fa/FaCrow.svelte';
    import HumanHireCard from './HumanHireCard.svelte';
    import SmallActionButton from '../../../components/SmallActionButton.svelte';
    import { failure } from '../../../common/toastTheme';
    import TradeItemCard from './TradeItemCard.svelte';
    import FaGem from 'svelte-icons/fa/FaGem.svelte';

    export let index = -1;
    export let name = '';
    export let hint = '';
    export let note = '';
    export let type = 'action';
    export let actions = [];
    export let rows = 1;

    let activePlayer;
    let refreshRequirements;
    $: {
        activePlayer = $game.players[$game.turn];
        if (type.includes('upgrade')) {
            if (actions[1].conditions
                && actions[1].conditions.length > 0) {
                hint = 'Next Upgrade:';
                actions[1].conditions.forEach((cond, index) => {
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

        refreshRequirements = 0;
        $game.tradableItems.forEach(item => {
            if (!item.sold) {
                ++refreshRequirements;
            }
        });
        if ($game.players.length <= 1) {
            refreshRequirements = Math.min(
                refreshRequirements > 2 ? 2 : 1, 
                refreshRequirements
            );
        }
    }

    const onTakeAction = (selectedActionIndex) => {
        if (type.includes('exchange')) {
            setExchangeItemsInfo(
                false,
                {
                    index,
                    actionIndex: selectedActionIndex,
                    min: actions[Math.min(actions.length - 1, selectedActionIndex)]
                    .conditions[0].quantity
                }
            );
        }

        const error = canTakeAction(index, selectedActionIndex);
        if (error) {
            failure(error);
            return;
        }

        if (type.includes('exchange')) {
            setExchangeItemsInfo(true);
            return;
        }

        takeAction(index, selectedActionIndex);
    }

    const onRefreshItems = () => {
        if (import.meta.env.VITE_BYPASS_TRADE_REFRESH_CONDITIONS !== 'true') {
            const error = hasEnoughItem('gem', refreshRequirements);
            if (error) {
                failure(error);
                return;
            }
        }

        useItem('gem', refreshRequirements);
        refreshTradableItems();
    }
</script>

<div class={`col-span-1 row-span-${rows}`}>
    <div 
        class={`rounded-md bg-yellow-300 shadow-md h-full p-2 py-1 2xl:py-2 pb-3
        flex flex-col justify-between
        `}
    >
        <section class="mb-2 text-center">
            <h1 class="font-semibold text-md 2xl:text-2xl">{name}</h1>
            {#if hint}<p class="text-xs 2xl:text-base">{hint}</p>{/if}
        </section>
        
        {#if actions}
        <div class="flex justify-center gap-2">
            {#each actions as action, a}
            {#each Array(action.space <= 0 ? ($game.players.length + action.space) : action.space) as _, s}
            <Tooltip
                title={action.name}
                subtitle={action.hint}
            >
                <div 
                    class={`w-12 h-12 2xl:w-16 2xl:h-16 rounded-md p-1 cursor-pointer relative
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
                    {:else if action.space === 1}
                    <div class="h-full flex flex-col justify-center text-center">
                        <p>-1</p>
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
            <div>
                <div class="grid grid-cols-4 gap-2">
                    {#each $game.tradableItems as item, i}
                    <div class="col-span-1">
                        <TradeItemCard 
                            actionIndex={i}
                            data={item} 
                        />
                    </div>
                    {/each}
                </div>
                
                <div class="flex justify-center mt-1">
                    <SmallActionButton
                        on:click={onRefreshItems}
                        disabled={refreshRequirements <= 0}
                    >
                        <div class="flex items-center justify-center">
                            <p>Refresh items for {refreshRequirements}</p>
                            <div class={`h-4 ml-1 ${itemIconMap['gem'].iconColor}`}>
                                <FaGem />
                            </div>
                        </div>
                    </SmallActionButton>
                </div>
            </div>
            {/if}

            <!-- HUMAN HIRE -->
            {#if type.includes('human')}
            <div class="grid grid-cols-4 gap-2">
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
        <p class="text-xs 2xl:text-base mt-2">
            <b>Note:</b> {note}
        </p>
        {:else}
        <span></span>
        {/if}
    </div>
</div>