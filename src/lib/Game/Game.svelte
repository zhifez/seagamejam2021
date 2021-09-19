<script>
    import { actions } from '../../stores/gameData';
    import { endRound, game } from '../../stores/game.store';
    import PlayersSidebar from './partials/PlayersSidebar.svelte';
    import ActionCard from './partials/ActionCard.svelte';
    import EndRoundModal from './partials/EndRoundModal.svelte';

</script>

{#if $game.canEndRound}
<EndRoundModal />
{/if}
<div class="grid grid-cols-5">
    <div class="col-span-1">
        <PlayersSidebar />
    </div>
    <div class="col-span-4 bg-yellow-600">
        <div class="grid grid-cols-4 grid-rows-5 gap-3 h-screen p-3">
            {#each actions as action, i}
            <ActionCard index={i} action={action} />
            {/each}
        </div>
    </div>
</div>