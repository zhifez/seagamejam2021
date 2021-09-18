<script>
    import { crownActions, dungeonSize, dungeonLayers } from '../../../stores/playerActions.store';
    
    export let x = 0;
    export let y = 0;
    
    let layerIndex;
    let tile;
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
    }
</script>

<!-- <svelte:component this={icon} /> -->
<div class={`w-12 h-12 p-1 rounded-md shadow cursor-pointer hover:bg-yellow-200`}>
    <svelte:component this={tile.icon} />
</div>