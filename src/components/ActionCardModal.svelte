<script>
    import Modal from './Modal.svelte';
    import Button from './Button.svelte';
    import ConditionBox from '../lib/Game/partials/ConditionBox.svelte';

    export let activeData;
    export let conditionLabel = 'Conditions';
    export let takeActionLabel = 'Get';
    export let onCloseModal;
    export let onTakeAction;
    export let bgColor = 'bg-yellow-400';
</script>

<Modal 
    modalClass="relative"
    canClose={activeData.actionIndex < 0}
    on:close={onCloseModal}
>
    <div class="flex flex-col items-center">
        <div 
            class={`modal-wrapper ${bgColor} rounded-lg text-black p-5
            flex flex-col justify-between items-center text-center`}
        >
            <div class="flex flex-col items-center pb-2">
                <div class="w-16 mb-2">
                    <svelte:component this={activeData.icon} />
                </div>
                <h1 class="text-xl font-semibold">{activeData.name}</h1>
                {#if activeData.hint}
                <p class="text-xs">{activeData.hint}</p>
                {/if}
            </div>
            <div class="border-t-2 border-black w-full"></div>
            <div class="h-1/2 w-full flex flex-col justify-between">
                <div>
                    <h1 class="font-semibold mb-1">{conditionLabel}</h1>
                    {#if activeData.conditions}
                    <div class="grid grid-cols-4 gap-2">
                        {#each activeData.conditions as cond}
                        <div class={`${activeData.conditions.length <= 1 ? 'col-start-2' : ''} col-span-2`}>
                            <ConditionBox {...cond} />
                        </div>
                        {/each}
                    </div>
                    {/if}
                </div>

                <div>
                    <h1 class="font-semibold mb-1 text-black">Rewards</h1>
                    {#if activeData.rewards}
                    <div class="grid grid-cols-4 gap-2">
                        {#each activeData.rewards as reward}
                        <div class={`${activeData.rewards.length <= 1 ? 'col-start-2' : ''} col-span-2`}>
                            <ConditionBox {...reward} />
                        </div>
                        {/each}
                    </div>
                    {/if}
                </div>
            </div>
        </div>

        <br />

        {#if activeData.actionIndex >= 0}
        <div class="flex items-center justify-center gap-2">
            <Button 
                label="Cancel"
                color="white"
                hoverColor="white"
                textColor="black"
                on:click={onCloseModal}
            />
            <Button 
                label={takeActionLabel}
                on:click={onTakeAction}
            />
        </div>
        {/if}
    </div>
</Modal>

<style>
    .modal-wrapper {
        width: 250px;
        height: 400px;
    }
</style>