<script>
    import { game } from '../../../stores/game.store';
    import Modal from '../../../components/Modal.svelte';
    import FaCrow from 'svelte-icons/fa/FaCrow.svelte';
</script>

<Modal
    modalBgColor={'bg-yellow-400'}
    canClose={false}
>
    <div class="modal-start-menu flex flex-col justify-between p-3">
        <h1 class="text-4xl font-semibold">Game Over</h1>

        <br class="my-5" />

        <div class={`grid grid-cols-4 gap-2`}>
            {#each $game.players as player}
            <div class={`col-span-1 rounded-md border-2 border-${player.color} text-${player.color} p-2 pt-3 flex flex-col items-center gap-1`}>
                <div class="h-10">
                    <FaCrow />
                </div>
                <h5>{player.name}</h5>
                <div class="text-xs text-black w-full my-3">
                    <div class="flex items-center justify-between">
                        <p class="font-semibold">VP:</p>
                        <p>{player.vp}</p>
                    </div>
                    <div class="flex items-center justify-between">
                        <p class="font-semibold">Crows:</p>
                        <p>+{player.crows}</p>
                    </div>
                    <div class="flex items-center justify-between">
                        <p class="font-semibold">Nest Lv.:</p>
                        <p>+{player.nestLevel}</p>
                    </div>
                    <div class="flex items-center justify-between">
                        <p class="font-semibold">Storage Lv.:</p>
                        <p>+{player.storageLevel}</p>
                    </div>
                    <div class="flex items-center justify-between">
                        <p class="font-semibold">Crown Challenges:</p>
                        <p>+{player.crownChallenges}</p>
                    </div>
                    <div class="flex items-center justify-between text-lg">
                        <p class="font-semibold">Total VP:</p>
                        <p>{$game.endGameResults[player.name].total}</p>
                    </div>
                </div>
                {#if $game.endGameResults[player.name].winner}
                <p class="px-3 py-1 text-white bg-green-500 rounded-md">Winner</p>
                {:else}
                <p class="px-3 py-1 text-white bg-red-500 rounded-md">Loser</p>
                {/if}
            </div>
            {/each}
        </div>
        
        <br class="my-5" />

        <div>
            <p class="text-2xl">Thank you for playing</p>
            <h1 class="text-4xl font-semibold mb-2">A Crown for Crows</h1>
            <p>
                <span>If you find the game fun/mediocre/heavily imbalance, feel free to contact the developer at </span>
                <a class="text-blue-600 hover:underline" href="mailto:hello@zhifez.com?subject=Your game is shit, and here's why">
                    hello@zhifez.com
                </a>
            </p>
        </div>
    </div>
</Modal>

<style>
    .modal-start-menu {
        min-width: 60vw;
        max-width: 60vw;
        min-height: 50vh;
        max-height: 90vh;
    }
</style>