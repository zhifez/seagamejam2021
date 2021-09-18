<script>
    import { dungeonSize } from '../../../stores/playerActions.store';
    import CrownActionTile from './CrownActionTile.svelte';

    export const name = '';
    export const hint = '';
    export const type = 'action';
</script>

<div class="col-span-2 row-span-2">
    <div class="rounded-md bg-yellow-400 shadow-md h-full p-3">
        <div class="w-full h-full flex flex-col justify-center">
            <div class="m-auto">
                <div class={`grid grid-cols-${dungeonSize} gap-2`}>
                    {#each Array(dungeonSize) as _, y}
                        {#each Array(dungeonSize) as _, x}
                        <div class="col-span-1">
                            <CrownActionTile x={x} y={y} />
                        </div>
                        {/each}
                    {/each}
                </div>
            </div>
        </div>
    </div>
</div>