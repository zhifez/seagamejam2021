<script>
    import { createEventDispatcher } from 'svelte';
    import { game } from '../../../stores/game.store';
    import { crownActions, dungeonSize, dungeonLayers } from '../../../stores/gameData.store';
    import Tooltip from '../../../components/Tooltip.svelte';
    
    export let x = 0;
    export let y = 0;
    
    let layerIndex;
    let tile;
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
        let layer = $dungeonLayers[layerIndex];
        tile = $crownActions[layer[(x + y) % layer.length]];
        disabled = $game.layer < layerIndex;
    }

    const dispatch = createEventDispatcher();

    const onClick = () => {
        if (disabled) {
            return;
        }
        console.log(tile.name);
        dispatch('click');
    }
</script>

<Tooltip
    title={tile.name}
    subtitle={`VP: ${tile.vp}`}
    disabled={disabled}
>
    <div 
        class={`w-9 h-9 2xl:w-10 2xl:h-10 p-1 rounded-md shadow bg-yellow-300
        ${disabled ? 'opacity-20' : 'cursor-pointer hover:bg-yellow-200'}
        `}
        on:click={onClick}
    >
        <svelte:component this={tile.icon} />
    </div>
</Tooltip>