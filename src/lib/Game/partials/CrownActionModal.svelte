<script>
    import { setActiveCrownAction, system } from '../../../stores/game.store';
    import { humanHires, itemIconMap } from '../../../stores/gameData';
    import Button from '../../../components/Button.svelte';
    import Modal from '../../../components/Modal.svelte';
import ConditionBox from './ConditionBox.svelte';

    let action;
    $: {
        action = $system.activeCrownAction;
    }

    const onCloseModal = () => {
        setActiveCrownAction(null);
    }

    const onTakeCrownAction = () => {

    }
</script>

<Modal
    modalClass="relative flex flex-col items-center"
    on:close={onCloseModal}
    canClose={false}
>
    <div class="modal-crown-action bg-yellow-300 rounded-md text-black flex flex-col justify-between items-center text-center p-5">
        <div class="flex flex-col items-center">
            <div class="w-16 mb-3">
                <svelte:component this={action.icon} />
            </div>
            <h1 class="text-2xl font-semibold">{action.name}</h1>
        </div>
        <div class="border-t-2 border-black w-full"></div>
        <div class="h-1/2 bg-yellow-300 w-full">
            <h1 class="font-semibold mb-1 text-black">Conditions</h1>
            {#if action.conditions}
            <div class="grid grid-cols-2 gap-2">
                {#each action.conditions as cond}
                <div class="col-span-1">
                    <ConditionBox {...cond} />
                </div>
                {/each}
            </div>
            {/if}
        </div>
    </div>

    <br />

    <div class="flex items-center justify-center gap-2">
        <Button
            label="Cancel"
            color="white"
            hoverColor="white"
            textColor="black"
            on:click={onCloseModal}
        />
        <Button 
            label={`Take Crown Action`}
            on:click={onTakeCrownAction}
        />
    </div>
</Modal>

<style>
    .modal-crown-action {
        width: 20vw;
        height: 30vw;
    }
</style>