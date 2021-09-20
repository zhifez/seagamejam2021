<script>
    import { actions } from '../../stores/gameData';
    import { game, system } from '../../stores/game.store';
    import PlayersSidebar from './partials/PlayersSidebar.svelte';
    import ActionCard from './partials/ActionCard.svelte';
    import StartMenuModal from './partials/StartMenuModal.svelte';
    import EndRoundModal from './partials/EndRoundModal.svelte';
    import HumanHireModal from './partials/HumanHireModal.svelte';
    import CrownActionModal from './partials/CrownActionModal.svelte';
    import EndGameModal from './partials/EndGameModal.svelte';
</script>

{#if !$system.hasStarted}
<StartMenuModal />
{/if}
{#if $game.canEndRound}
<EndRoundModal />
{/if}
{#if $system.showActiveHumanHire}
<HumanHireModal />
{/if}
{#if $system.showActiveCrownAction}
<CrownActionModal />
{/if}
{#if $system.canEndGame}
<EndGameModal />
{/if}

<div class="grid grid-cols-5 overflow-hidden">
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