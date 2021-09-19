<script>
    import { setHasStarted } from '../../../stores/game.store';
    import Button from '../../../components/Button.svelte';
    import Modal from '../../../components/Modal.svelte';
</script>

<Modal
    modalBgColor={'bg-yellow-500'}
    canClose={false}
>
    <div class="modal-start-menu flex flex-col justify-between p-3">
        <div class="flex justify-between">
            <div>
                <p class="uppercase text-sm">SEA Game Jam 2021</p>
                <h1 class="text-4xl font-semibold">A Crown for Crows</h1>
                <p>A worket placement about crows and crown.</p>
            </div>

            <p class="text-sm">Developed by: zhifez</p>
        </div>

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

        <Button
            label="Start"
            on:click={setHasStarted}
        />
    </div>
</Modal>

<style>
    .modal-start-menu {
        min-width: 50vw;
        min-height: 50vh;
    }
</style>