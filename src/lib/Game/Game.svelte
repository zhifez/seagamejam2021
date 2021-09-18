<script>
    import { actions } from '../../stores/playerActions.store';
    import PlayersSidebar from './partials/PlayersSidebar.svelte';
    import ActionCard from './partials/ActionCard.svelte';

</script>
<div class="grid grid-cols-5">
    <div class="col-span-1">
        <PlayersSidebar />
    </div>
    <div class="col-span-4">
        <div class="grid grid-cols-4 gap-3 h-screen p-3">
            {#each $actions as action}
            <ActionCard action={action} />
            {/each}
        </div>
    </div>
</div>