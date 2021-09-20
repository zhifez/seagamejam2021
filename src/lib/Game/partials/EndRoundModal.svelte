<script>
    import { endRound, game } from '../../../stores/game.store';
    import Modal from '../../../components/Modal.svelte';
    import Button from '../../../components/Button.svelte';
    import FaCrow from 'svelte-icons/fa/FaCrow.svelte';
</script>

<Modal 
    modalClass="relative flex flex-col items-center"
    canClose={false}
>
    <div class="modal-end-round bg-yellow-300 rounded-md text-black p-5">
        <h1 class="text-2xl font-semibold">
            End of Round - Feeding Phase
        </h1>
        <hr class="my-3 border-black" />
        {#each $game.players as player, p}
        {#if p > 0}<hr class="my-3" />{/if}
        <div class="flex items-center justify-between font-semibold mb-2">
            <p>{player.name}</p>
            <p>{player.vp} VP</p>
        </div>

        <div class="flex items-center justify-between">
            <div class="flex items-center">
                <div class={`w-10 h-10 text-${player.color}`}>
                    <FaCrow />
                </div>
                <p class="ml-2">x {player.crows} {player.isReproducing ? '(+1)' : ''}</p>
            </div>

            <div class="text-sm w-1/2">
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
                <p><b>Total VP:</b> {player.vp - $game.endRoundResults[p].minusVP}</p>
                {:else}
                <p>Crows are all fed up!</p>
                {/if}
            </div>
        </div>
        {/each}
        <hr class="my-3 border-black" />
        <div class="flex justify-end gap-2">
            <Button 
                label="End Round"
                textClass={'text-lg'}
                on:click={endRound}
            />
        </div>
    </div>
</Modal>

<style>
    .modal-end-round {
        min-width: 50vw;
    }
</style>