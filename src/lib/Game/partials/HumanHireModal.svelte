<script>
    import { setActiveHumanHire, game, system, takeAction, playerCanTakeAction } from '../../../stores/game.store';
    import { actions, itemIconMap } from '../../../stores/gameData';
    import Modal from '../../../components/Modal.svelte';
    import Button from '../../../components/Button.svelte';

    let activePlayer;
    let lifespan = 0;
    $: {
        activePlayer = $game.players[$game.turn];
        lifespan = $system.activeHumanHire.lifespan - $system.activeHumanHire.hiredLifespan;
    }

    const onCloseModal = () => {
        setActiveHumanHire(null);
    }

    const onTakeAction = () => {
        if ($game.canEndRound) {
            alert('The round has ended.');
            return;
        }

        if (activePlayer.hasTakenAction) {
            alert('You have already taken an action!\nTake a Crown Action or end your turn.');
            return;
        }

        let hireCoreActionIndex = -1;
        for (let a=0; a<actions.length; ++a) {
            if (actions[a].type.includes('human')) {
                hireCoreActionIndex = a;
                break;
            }
        }
        const error = playerCanTakeAction(activePlayer, hireCoreActionIndex, $system.activeHumanHire.actionIndex);
        if (error) {
            alert(error);
            return;
        }

        takeAction(hireCoreActionIndex, $system.activeHumanHire.actionIndex);
        onCloseModal();
    }
</script>

<Modal 
    modalClass="relative"
    canClose={$system.activeHumanHire.actionIndex < 0}
    on:close={onCloseModal}
>
    <div class="modal-human-hire bg-yellow-700 rounded-md text-white flex flex-col justify-between items-center text-center px-3 py-3">
        <div class="flex flex-col items-center">
            <div class="w-16 mb-3">
                <svelte:component this={$system.activeHumanHire.icon} />
            </div>
            <h1 class="text-2xl font-semibold">{$system.activeHumanHire.name}</h1>
            <p class="text-sm">{$system.activeHumanHire.hint}</p>
            <p class="text-sm bg-red-500 text-white px-2 py-1 rounded-md mt-1">
                Lasts {$system.activeHumanHire.lifespan} round{$system.activeHumanHire.lifespan > 1 ? 's' : ''}
            </p>
        </div>
        <div class="h-2/5 rounded-md px-3 py-2 bg-yellow-300 w-full">
            <h1 class="font-semibold mb-1 text-black">Costs</h1>
            <div class="grid grid-cols-2 gap-2">
                {#each $system.activeHumanHire.conditions as cond}
                <div class="col-span-1 p-2 flex justify-between items-center bg-white rounded-md">
                    <div class={`w-6 h-5 ${itemIconMap[cond.key].iconColor}`}>
                        <svelte:component this={itemIconMap[cond.key].icon} />
                    </div>
                    <p class="text-black">x {cond.quantity}</p>
                </div>
                {/each}
            </div>
        </div>
    </div>

    <br />

    {#if $system.activeHumanHire.actionIndex >= 0}
    <div class="flex items-center justify-center gap-2">
        <Button 
            label="Cancel"
            color="white"
            hoverColor="white"
            textColor="black"
            on:click={onCloseModal}
        />
        <Button 
            label={`Hire ${$system.activeHumanHire.name}`}
            on:click={onTakeAction}
        />
    </div>
    {:else}
    <p class="modal-hired-label p-2 text-sm bg-white rounded-md shadow text-center">
        {lifespan > 0 ? 
        `Hired, and will be staying for another ${lifespan} round${lifespan > 1 ? 's' : ''}.` : 
        'Hired, and will leave after this round.'}
    </p>
    {/if}
</Modal>

<style>
    .modal-human-hire {
        width: 20vw;
        height: 30vw;
    }

    .modal-hired-label {
        width: 20vw;
    }
</style>