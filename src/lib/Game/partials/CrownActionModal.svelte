<script>
    import { canTakeCrownAction, setActiveCrownAction, system, takeCrownAction } from '../../../stores/game.store';
    import Button from '../../../components/Button.svelte';
    import Modal from '../../../components/Modal.svelte';
    import { failure } from '../../../common/toastTheme';
    import ConditionBox from './ConditionBox.svelte';

    let action;
    $: {
        action = $system.activeCrownAction;
    }

    const onCloseModal = () => {
        setActiveCrownAction(null);
    }

    const onTakeCrownAction = () => {
        const error = canTakeCrownAction(action);
        if (error) {
            failure(error);
            return;
        }

        takeCrownAction(action);
        setActiveCrownAction(null);
    }
</script>

<Modal
    modalClass="relative flex flex-col items-center"
    on:close={onCloseModal}
    canClose={false}
>
    <div class="modal-crown-action bg-yellow-300 rounded-md text-black p-5 flex flex-col justify-between items-center text-center">
        <div class="flex flex-col items-center">
            <div class="w-16 mb-3">
                <svelte:component this={action.icon} />
            </div>
            <h1 class="text-2xl font-semibold">{action.name}</h1>
        </div>
        <div class="border-t-2 border-black w-full"></div>
        <div class="h-1/2 w-full flex flex-col justify-between">
            <div>
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

            <div>
                <h1 class="font-semibold mb-1 text-black">Rewards</h1>
                {#if action.rewards}
                <div class="grid grid-cols-2 gap-2">
                    {#each action.rewards as reward}
                    <div class="col-span-1">
                        <ConditionBox {...reward} />
                    </div>
                    {/each}
                </div>
                {/if}
            </div>
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
            label={`Take Challenge`}
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