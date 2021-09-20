<script>
    import { setActiveHumanHire, system, takeAction, canTakeAction } from '../../../stores/game.store';
    import { actions } from '../../../stores/gameData';
    import { failure } from '../../../common/toastTheme';
    import Modal from '../../../components/Modal.svelte';
    import Button from '../../../components/Button.svelte';
    import ConditionBox from './ConditionBox.svelte';

    let lifespan = 0;
    $: {
        lifespan = $system.activeHumanHire.lifespan - $system.activeHumanHire.hiredLifespan;
    }

    const onCloseModal = () => {
        setActiveHumanHire(null);
    }

    const onTakeAction = () => {
        let hireCoreActionIndex = -1;
        for (let a=0; a<actions.length; ++a) {
            if (actions[a].type.includes('human')) {
                hireCoreActionIndex = a;
                break;
            }
        }
        const error = canTakeAction(hireCoreActionIndex, $system.activeHumanHire.actionIndex);
        if (error) {
            failure(error);
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
    <div class="modal-human-hire bg-yellow-700 rounded-md text-white flex flex-col justify-between items-center text-center">
        <div class="flex flex-col items-center p-5 pb-2">
            <div class="w-16 mb-2">
                <svelte:component this={$system.activeHumanHire.icon} />
            </div>
            <h1 class="text-xl font-semibold">{$system.activeHumanHire.name}</h1>
            <p class="text-xs">{$system.activeHumanHire.hint}</p>
            <p class="text-xs bg-red-500 text-white px-2 py-1 rounded-md mt-1">
                Lasts {$system.activeHumanHire.lifespan} round{$system.activeHumanHire.lifespan > 1 ? 's' : ''}
            </p>
        </div>
        <div class="h-1/2 px-3 py-2 w-full">
            <h1 class="font-semibold mb-1">Costs</h1>
            <div class="grid grid-cols-2 gap-2">
                {#each $system.activeHumanHire.conditions as cond}
                <div class="col-span-1">
                    <ConditionBox {...cond} />
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
        `Hired, and will be staying for another ${lifespan > 1 ? lifespan : ''} round${lifespan > 1 ? 's' : ''}.` : 
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