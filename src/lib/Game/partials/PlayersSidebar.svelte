<script>
    import { endRound, endTurn, game } from '../../../stores/game.store';
    import { getNestCapacity, getStorageCapacity, itemIconMap } from '../../../stores/gameData';
    import FaCrow from 'svelte-icons/fa/FaCrow.svelte';
    import Tooltip from '../../../components/Tooltip.svelte';
    import Button from '../../../components/Button.svelte';
    import HumanHireCard from './HumanHireCard.svelte';

    let activePlayer;
    $: {
        activePlayer = $game.players[$game.turn];
    }

    const onBtnPass = () => {
        endTurn(true);
    }

    const onBtnEndTurn = () => {
        endTurn();
    }

    const onBtnEndRound = () => {
        endRound();
    }
</script>

<div class="w-full h-screen bg-yellow-300 flex flex-col border-r-2 border-yellow-800">
    <div class="flex items-center p-4 text-lg">
        <h1 class="font-semibold">Round {$game.round + 1}:</h1>
        <p class="ml-2">{activePlayer.name}</p>
    </div>

    <div class={`grid grid-cols-${Math.max(2, $game.players.length)}`}>
        {#each $game.players as player, i}
        <div 
            class={`col-span-1 text-${player.color} p-2
            border-b-4 mx-2
            ${$game.turn === i ? 'border-yellow-800' : 'border-transparent'}
            `}
        >
            <div class="w-full h-6">
                <FaCrow />
            </div>
        </div>
        {/each}
    </div>
    <div class="h-full p-4 flex flex-col justify-between">
        <div>
            <div class="flex items-center mb-1">
                <h5 class="font-semibold">VP:</h5>
                <p class="ml-2">{activePlayer.vp}</p>
            </div>
            <!-- NEST -->
            <div class="flex justify-between items-center mb-1">
                <h5 class="font-semibold">Nest</h5>
                <p class="text-sm">Lvl. {activePlayer.nestLevel}</p>
            </div>
            <div class="flex flex-wrap gap-1">
                {#each Array(getNestCapacity(activePlayer.nestLevel)) as _, i}
                <div class="w-6 h-6 border-b-2 border-black">
                    {#if i < activePlayer.crows}
                    <div 
                        class={`h-full
                        text-${i < activePlayer.utilizedCrows ? 'gray-100' : activePlayer.color} 
                        `}
                    >
                        <FaCrow />
                    </div>
                    {/if}
                </div>
                {/each}
            </div>
            <br />
            <!-- STORAGE -->
            <div class="flex justify-between items-center mb-1">
                <h5 class="font-semibold">Storage</h5>
                <p class="text-sm">Lvl. {activePlayer.storageLevel}</p>
            </div>
            <div class="flex flex-wrap gap-1">
                {#each Array(getStorageCapacity(activePlayer.storageLevel)) as _, i}
                <div 
                    class={`w-6 h-6 border-b-2 border-black
                    ${i < activePlayer.storedItems.length ? 'bg-white' : ''}
                    `}
                >
                    {#if i < activePlayer.storedItems.length}
                    <Tooltip
                        title={itemIconMap[activePlayer.storedItems[i]].name}
                        subtitle={itemIconMap[activePlayer.storedItems[i]].hint}
                    >
                        <div class={`w-full h-full ${itemIconMap[activePlayer.storedItems[i]].iconColor} p-1`}>
                            <svelte:component this={itemIconMap[activePlayer.storedItems[i]].icon} />
                        </div>
                    </Tooltip>
                    {/if}
                </div>
                {/each}
            </div>
            <br />
            <!-- HUMAN -->
            <div class="flex justify-between items-center mb-1">
                <h5 class="font-semibold">Human Hire</h5>
            </div>
            <div class="grid grid-cols-4 gap-2">
                {#each activePlayer.humanHires as human, h}
                <Tooltip
                    title={human.name}
                    subtitle={human.hiredLifespan + 1 >= human.lifespan ? 
                        'Will leave after this round.' : 
                        `Will be staying for another ${human.lifespan - human.hiredLifespan} round${human.lifespan - human.hiredLifespan > 1 ? 's' : ''}.`}
                >
                    <HumanHireCard 
                        data={human}
                    />
                </Tooltip>
                {/each}
            </div>            
        </div>
        <div class="flex flex-col gap-3">
            <Button 
                label="End Turn"
                textClass={'text-lg'}
                on:click={onBtnEndTurn}
                disabled={!activePlayer.hasTakenAction || $game.canEndRound}
            />
            {#if !activePlayer.hasTakenAction}
            <Button 
                label="Pass"
                color="red-500"
                hoverColor="red-400"
                textClass={'text-lg'}
                hint="Will utilizes a Crow"
                on:click={onBtnPass}
                disabled={$game.canEndRound}
            />
            {/if}
        </div>
    </div>
</div>