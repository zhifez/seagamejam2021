<script>
    import { endTurn, game, setShowInstructions } from '../../../stores/game.store';
    import { getNestCapacity, getStorageCapacity, itemIconMap, tradeItems } from '../../../stores/gameData';
    import FaCrow from 'svelte-icons/fa/FaCrow.svelte';
    import Tooltip from '../../../components/Tooltip.svelte';
    import Button from '../../../components/Button.svelte';
    import HumanHireCard from './HumanHireCard.svelte';
    import IoIosClose from 'svelte-icons/io/IoIosClose.svelte';
    import GoHome from 'svelte-icons/go/GoHome.svelte';
    import GiLockedChest from 'svelte-icons/gi/GiLockedChest.svelte';
    import FaUser from 'svelte-icons/fa/FaUser.svelte'

    let activePlayer;
    let storedItems = [];
    $: {
        activePlayer = $game.players[$game.turn];
        if (storedItems.length !== activePlayer.storedItems.length) {
            storedItems = [];
            for (let a=0; a<activePlayer.storedItems.length; ++a) {
                let key = activePlayer.storedItems[a];
                if (key in itemIconMap) {
                    storedItems.push ({
                        ...itemIconMap[key]
                    });
                }
                else if (key in tradeItems) {
                    storedItems.push({
                        ...tradeItems[key]
                    });
                }
                else {
                    storedItems.push({
                        name: key
                    });
                }
            }
        }
    }

    const onBtnEndTurn = () => {
        endTurn();
    }

    const onBtnPass = () => {
        endTurn(true);
    }

    const onBtnInstruction = () => {
        setShowInstructions(true);
    }
</script>

<div class="w-full h-screen bg-yellow-300 flex flex-col border-r-2 border-yellow-800">
    <div class="flex items-center p-3">
        <h1 class="font-semibold">Round {$game.round + 1}:</h1>
        <p class="ml-2">{activePlayer.name}</p>
    </div>

    <div class={`grid grid-cols-${Math.max(2, $game.players.length)}`}>
        {#each $game.players as player, i}
        <div 
            class={`col-span-1 text-${player.color} p-1
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
    <div class="h-full p-3 flex flex-col justify-between">
        <div>
            <div class="flex items-center mb-1">
                <h5 class="font-semibold">VP:</h5>
                <p class="ml-2">{activePlayer.vp}</p>
            </div>
            <!-- NEST -->
            <div class="flex justify-between items-center mb-2">
                <div class="flex items-center">
                    <div class="h-5 mr-2">
                        <GoHome />
                    </div>
                    <h5 class="font-semibold">Nest</h5>
                </div>
                <p class="text-sm">Lvl. {activePlayer.nestLevel}</p>
            </div>
            <div class="flex flex-wrap gap-1">
                {#each Array(getNestCapacity(activePlayer.nestLevel)) as _, i}
                <div class="w-6 h-6 border-b-2 border-yellow-800">
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
            <hr class="mt-3 my-2 border-t-2 border-black" />
            <!-- STORAGE -->
            <div class="flex justify-between items-center mb-2">
                <div class="flex items-center">
                    <div class="h-5 mr-2">
                        <GiLockedChest />
                    </div>
                    <h5 class="font-semibold">Storage</h5>
                </div>
                <p class="text-sm">Lvl. {activePlayer.storageLevel}</p>
            </div>
            <div class="flex flex-wrap gap-1">
                {#each Array(getStorageCapacity(activePlayer.storageLevel)) as _, i}
                <div 
                    class={`w-8 h-8 border-b-2 border-yellow-800
                    ${i < storedItems.length ? 'bg-white' : ''}
                    `}
                >
                    {#if i < storedItems.length}
                    <Tooltip
                        title={storedItems[i].name}
                        subtitle={storedItems[i].hint}
                    >
                        {#if storedItems[i].icon}
                        <div class={`w-full h-full ${storedItems[i].iconColor} p-1`}>
                            <svelte:component this={storedItems[i].icon} />
                        </div>
                        {:else}
                        <div class="w-full h-full p-1">
                            <IoIosClose />
                        </div>
                        {/if}
                    </Tooltip>
                    {/if}
                </div>
                {/each}
            </div>
            <hr class="mt-3 my-2 border-t-2 border-black" />
            <!-- HUMAN -->
            <div class="flex justify-between items-center mb-2">
                <div class="flex items-center">
                    <div class="h-4 mr-2">
                        <FaUser />
                    </div>
                    <h5 class="font-semibold">Human Hire</h5>
                </div>
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
        <div class="flex flex-col gap-2">
            <Button 
                label="End Turn"
                on:click={onBtnEndTurn}
                disabled={!activePlayer.hasTakenAction || $game.canEndRound}
            />
            {#if !activePlayer.hasTakenAction}
            <Button 
                label="Pass"
                hint="Will utilizes a Crow"
                color="red-500"
                hoverColor="red-400"
                on:click={onBtnPass}
                disabled={$game.canEndRound}
            />
            {/if}
            <Button 
                label="Instructions"
                color="yellow-500"
                hoverColor="yellow-400"
                textClass="text-sm"
                on:click={onBtnInstruction}
            />
        </div>
    </div>
</div>