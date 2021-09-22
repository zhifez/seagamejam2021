<script>
    import { endRound, game, setShowEndRound } from '../../../stores/game.store';
    import Modal from '../../../components/Modal.svelte';
    import Button from '../../../components/Button.svelte';
    import FaCrow from 'svelte-icons/fa/FaCrow.svelte';

    const onEndRound = () => {
        setShowEndRound(false);
        setTimeout(() => {
            endRound();
        }, 500);
    }
</script>

<Modal 
    modalClass="relative flex flex-col items-center"
    canClose={false}
>
    <div class="modal-end-round bg-yellow-300 rounded-md text-black p-5">
        <h1 class="text-2xl font-semibold">
            End of Round {$game.round + 1}
            {#if $game.isFeedingPhase}
             - Feeding Phase
            {/if}
        </h1>
        {#if !$game.isFeedingPhase}
        <p>{2 - $game.round % 3} more round{2 - $game.round % 3 > 1 ? 's' : ''} to Feeding Phase.</p>
        {/if}
        {#if $game.isFeedingPhase}
        <hr class="my-3 border-black" />
        <div class="grid grid-cols-4 gap-3">
            {#each $game.players as player, p}
            <div class="col-span-1 flex flex-col items-center gap-2">
                <p class="font-semibold">{player.name} ({player.vp}VP)</p>

                <div class="flex items-center">
                    <div class={`w-10 h-10 text-${player.color}`}>
                        <FaCrow />
                    </div>
                    <p class="ml-2">x {player.crows} {player.isReproducing ? '(+1)' : ''}</p>
                </div>

                <div class="text-sm">
                    <p>Requires {player.crows} food to feed. </p>
                    {#if player.crows > $game.endRoundResults[p].food}
                    {#if $game.endRoundResults[p].food <= 0}
                    <p>There's not enough food in storage.</p>
                    {:else}
                    <p>There's only enough food in storage for {$game.endRoundResults[p].food} crow{$game.endRoundResults[p].food > 1 ? 's' : ''}.</p>
                    {/if}
                    {/if}
                    {#if $game.endRoundResults[p].minusVP > 0}
                    <p>Minus {$game.endRoundResults[p].minusVP} VP.</p>
                    <p class="mt-3"><b>Total VP:</b> {player.vp - $game.endRoundResults[p].minusVP}</p>
                    {:else}
                    <p>Crows are all fed up!</p>
                    <p class="mt-3"><b>Total VP:</b> {player.vp}</p>
                    {/if}
                </div>
            </div>
            {/each}
        </div>
        {/if}
        <hr class="my-3 border-black" />
        <div class="flex justify-end gap-2">
            <Button 
                label="End Round"
                textClass={'text-lg'}
                on:click={onEndRound}
            />
        </div>
    </div>
</Modal>

<style>
    .modal-end-round {
        min-width: 50vw;
        max-width: 70vw;
    }
</style>