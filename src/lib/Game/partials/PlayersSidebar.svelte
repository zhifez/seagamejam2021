<script>
    import { endRound, game, nextTurn } from '../../../stores/game.store';
    import { itemIconMap } from '../../../stores/gameData.store';
    import FaCrow from 'svelte-icons/fa/FaCrow.svelte';
    import Tooltip from '../../../components/Tooltip.svelte';
    import Button from '../../../components/Button.svelte';

    let activePlayer;
    $: {
        activePlayer = $game.players[$game.turn];
    }

    const onBtnPass = () => {
        nextTurn(true);
    }

    const onBtnNextTurn = () => {
        nextTurn();
    }

    const onBtnEndRound = () => {
        endRound();
    }
</script>

<div class="w-full h-screen bg-yellow-300 flex flex-col border-r-2 border-yellow-800">
    <div class="flex items-center p-3 text-lg">
        <h1 class="font-semibold">Round {$game.round + 1}:</h1>
        <p class="ml-2">{activePlayer.name}</p>
    </div>

    <div class={`grid grid-cols-${Math.max(2, $game.players.length)}`}>
        {#each $game.players as player, i}
        <div 
            class={`col-span-1 text-${player.color} p-2
            ${$game.turn === i ? '' : 'bg-yellow-800'}
            `}
        >
            <div class="w-full h-6">
                <FaCrow />
            </div>
        </div>
        {/each}
    </div>
    <div class="h-full p-3 flex flex-col justify-between">
        <div>
            <div class="flex justify-between items-center mb-1">
                <h5 class="font-semibold">Nest</h5>
                <p class="text-sm">Lvl. {activePlayer.nestLevel}</p>
            </div>
            <div class="flex flex-wrap gap-2">
                {#each Array(activePlayer.crows) as _, i}
                <div 
                    class={`h-6
                    text-${i < activePlayer.utilizedCrows ? 'gray-100' : activePlayer.color} 
                    `}
                >
                    <FaCrow />
                </div>
                {/each}
            </div>
            <br />
            <div class="flex justify-between items-center mb-1">
                <h5 class="font-semibold mb-1">Storage</h5>
                <p class="text-sm">Lvl. {activePlayer.storageLevel}</p>
            </div>
            <div class="flex flex-wrap gap-2">
                {#each activePlayer.storedItems as item}
                <div class="relative">
                    <Tooltip
                        title={$itemIconMap[item].name}
                        subtitle={$itemIconMap[item].hint}
                    >
                        <div class="h-6">
                            <svelte:component this={$itemIconMap[item].icon} />
                        </div>
                    </Tooltip>
                </div>
                {/each}
            </div>
        </div>
        {#if $game.canEndRound}
        <Button 
            label="End Round"
            textClass={'text-lg'}
            color={'yellow-800'}
            on:click={onBtnEndRound}
        />
        {:else}
        <div class="flex flex-col gap-3">
            {#if !activePlayer.hasTakenAction}
            <Button 
                label="Pass"
                textClass={'text-lg'}
                hint="Will utilize a Crow"
                on:click={onBtnPass}
            />
            {/if}
            <Button 
                label="Next Turn"
                textClass={'text-lg'}
                on:click={onBtnNextTurn}
                disabled={!activePlayer.hasTakenAction}
            />
        </div>
        {/if}
    </div>
</div>