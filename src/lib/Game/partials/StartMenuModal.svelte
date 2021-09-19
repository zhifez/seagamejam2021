<script>
    import { setHasStarted, setupPlayers } from '../../../stores/game.store';
    import Button from '../../../components/Button.svelte';
    import Modal from '../../../components/Modal.svelte';

    const onPlayerAmount = (amount) => {
        setupPlayers(amount);
        setHasStarted();
    }
</script>

<Modal
    modalBgColor={'bg-yellow-400'}
    canClose={false}
>
    <div class="modal-start-menu flex flex-col justify-between p-3">
        <div class="flex justify-between">
            <div>
                <p class="uppercase text-sm">SEA Game Jam 2021</p>
                <h1 class="text-4xl font-semibold">A Crown for Crows</h1>
                <p>A worker placement game about managing crows to steal a crown, in the long run.</p>
            </div>

            <p class="text-sm">
                Developed by: <a class="underline" target="_blank" href="https://zhifez.com/">zhifez</a>
            </p>
        </div>
        
        <br class="my-5" />

        <div class="text-sm">
            <p class="font-semibold">Instructions:</p>
            <ul class="list-outside">
                <li>1. Click on an action slot to take the action.</li>
                <li>2. Remember to click "End Turn" once you've taken an action.</li>
            </ul>
            <br />
            <p class="font-semibold">Version 1.0</p>
            <ul class="list-outside">
                <li>This is a rushed release, so the gameplay isn't balanced yet, play it at your own inconvenience.</li>
            </ul>
        </div>

        <br class="my-5" />

        <div>
            <p class="font-semibold mb-2">Select number of players:</p>
            <div class="grid grid-cols-4 gap-2">
                {#each Array(4) as _, i}
                <Button
                    label={`${i + 1} Player${i > 0 ? 's' : ''}`}
                    block={true}
                    on:click={() => onPlayerAmount(i + 1)}
                />
                {/each}
            </div>
        </div>
    </div>
</Modal>

<style>
    .modal-start-menu {
        min-width: 60vw;
        max-width: 60vw;
        min-height: 50vh;
    }
</style>