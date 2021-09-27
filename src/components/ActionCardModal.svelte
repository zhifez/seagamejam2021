<script>
    import Modal from './Modal.svelte';
    import Button from './Button.svelte';
    import ConditionBox from './ConditionBox.svelte';

    export let activeData;
    export let contentWidget = null;
    export let bottomContent = null;
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
            class={`modal-wrapper ${bgColor} rounded-lg text-black px-4 py-6
            flex flex-col justify-between items-center text-center`}
        >
            <div class="h-2/5 flex flex-col items-center pb-2">
                <div class="w-16 mb-2">
                    <svelte:component this={activeData.icon} />
                </div>
                <h1 class="text-lg font-semibold">{activeData.name}</h1>
                {#if activeData.hint}
                <p class="text-xs">{activeData.hint}</p>
                {/if}
                {#if contentWidget}
                {@html contentWidget}
                {/if}
            </div>
            <hr class="border-t-2 border-black border-dotted w-full my-3" />
            <div class="h-3/5 w-full flex flex-col justify-between">
                <div>
                {#if activeData.conditions}
                    {#if 'key' in activeData.conditions[0]}
                        <h1 class="font-semibold mb-1">{conditionLabel}</h1>
                        <div class="grid grid-cols-4 gap-3">
                            {#each activeData.conditions as cond}
                            <ConditionBox 
                                {...cond} 
                                colSpace={2}
                                colStart={activeData.conditions.length <= 1 ? 2 : 0}
                            />
                            {/each}
                        </div>
                    {:else}
                        {#each activeData.conditions as condObj, co}
                        {#if co > 0}
                        <p class="text-xs font-semibold my-2">- OR -</p>
                        {/if}
                        {#if condObj.name}
                        <h1 class="font-semibold mb-1">{condObj.name}</h1>
                        {:else}
                        <h1 class="font-semibold mb-1">Condition #{co + 1}</h1>
                        {/if}
                        <div class="grid grid-cols-4 gap-3">
                            {#each condObj['conds'] as req}
                            <ConditionBox 
                                {...req} 
                                colSpace={2}
                                colStart={condObj['conds'].length <= 1 ? 2 : 0}
                            />
                            {/each}
                        </div>
                        {/each}
                    {/if}
                {/if}
                </div>

                {#if activeData.rewards}
                <div>
                    <hr class="border-t-2 border-black border-dotted w-full my-3" />
                    <h1 class="font-semibold mb-1 text-black">Rewards</h1>
                    <div class="grid grid-cols-4 gap-2">
                        {#each activeData.rewards as reward}
                        <div class={`${activeData.rewards.length <= 1 ? 'col-start-2' : ''} col-span-2`}>
                            <ConditionBox {...reward} />
                        </div>
                        {/each}
                    </div>
                </div>
                {/if}
            </div>
        </div>

        <br />

        {#if activeData.actionIndex >= 0}
        <div class="flex items-center justify-center gap-2">
            <Button 
                label="Cancel"
                color="white"
                textColor="black"
                on:click={onCloseModal}
            />
            <Button 
                label={takeActionLabel}
                on:click={onTakeAction}
            />
        </div>
        {/if}
        {#if bottomContent}
        <p class="modal-bottom-label p-2 text-sm bg-white rounded-md shadow text-center">
            {bottomContent}
        </p>
        {/if}
    </div>
</Modal>

<style>
    .modal-wrapper {
        width: 280px;
        height: 450px;
    }

    .modal-bottom-label {
        width: 280px;
    }
</style>