<script>
    import { game, setActiveCrownAction } from '../../../stores/game.store';
    import { crownActions, dungeonSize, dungeonLayers } from '../../../stores/gameData';
    import Tooltip from '../../../components/Tooltip.svelte';
    import GiSkullCrossedBones from 'svelte-icons/gi/GiSkullCrossedBones.svelte';
    
    export let x = 0;
    export let y = 0;
    
    let crownActionKey;
    let completedRecord;
    let layerIndex;
    let action;
    let disabled = false;
    $: {
        if (y === 0 || y === dungeonSize - 1 || x === 0 || x === dungeonSize - 1) {
            layerIndex = 0;
        }
        else if (y === 1 || y === dungeonSize - 2 || x === 1 || x === dungeonSize - 2) {
            layerIndex = 1;
        }
        else if (y === 2 || y === dungeonSize - 3 || x === 2 || x === dungeonSize - 3) {
            layerIndex = 2;
        }
        else {
            layerIndex = 3;
        }
        let layer = dungeonLayers[layerIndex];
        action = crownActions[layer[(x + y) % layer.length]];
        if (import.meta.env.VITE_SHOW_ALL_CROWN_ACTION !== 'true') {
            disabled = $game.crownActionLayer < layerIndex;
        }

        crownActionKey = `${x}-${y}`;
        if (layerIndex in $game.completedCrownActions
            && crownActionKey in $game.completedCrownActions[layerIndex]) {
            completedRecord = $game.completedCrownActions[layerIndex][crownActionKey];
        }
        else {
            completedRecord = null;
        }
    }

    const onClick = () => {
        if (disabled) {
            return;
        }
        
        setActiveCrownAction({
            ...action,
            x, y,
            layer: layerIndex
        });
    }
</script>

<Tooltip
    title={action.name}
    subtitle={completedRecord ? `Completed by: ${completedRecord.playerName}` : 'Click to view card details.'}
    disabled={disabled}
>
    {#if completedRecord}
    <div class={`w-12 h-12 2xl:w-16 2xl:h-16 p-2 text-${completedRecord.playerColor}`}>
        <GiSkullCrossedBones />
    </div>
    {:else}
    <div 
        class={`w-12 h-12 2xl:w-16 2xl:h-16 p-1 rounded-md shadow bg-yellow-300
        ${disabled ? 'opacity-50' : 'cursor-pointer hover:bg-yellow-200'}
        `}
        on:click={onClick}
    >
        <svelte:component this={action.icon} />
    </div>
    {/if}
</Tooltip>