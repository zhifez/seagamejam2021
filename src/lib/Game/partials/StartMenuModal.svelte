<script>
    import { instructions } from '../../../stores/gameData';
    import { setHasStarted, initGame } from '../../../stores/game.store';
    import Button from '../../../components/Button.svelte';
    import Modal from '../../../components/Modal.svelte';

    const onPlayerAmount = (amount) => {
        initGame(amount);
        setHasStarted();
    }
</script>

<Modal
    modalBgColor={'bg-yellow-400'}
    canClose={false}
>
    <div class="modal-start-menu flex flex-col justify-between p-3">
        <div class="grid grid-cols-6 gap-3">
            <div class="col-span-5">
                <p class="uppercase text-sm">SEA Game Jam 2021</p>
                <h1 class="text-4xl font-semibold">A Crown for Crows</h1>
                <p>A worker placement game about managing crows to steal a crown, in the long run.</p>
                
                <div class="mt-2 text-sm">
                    <p><b>Developed by:</b> <a class="underline" target="_blank" href="https://zhifez.com/">zhifez</a></p>
                    
                    <p>
                        <b>Icons by:</b>
                        <a class="underline" target="_blank" href="https://fontawesome.com/">FontAwesome</a>,
                        <a class="underline" target="_blank" href="https://game-icons.net/">GameIcons</a>,
                        <a class="underline" target="_blank" href="https://ionic.io/ionicons">Ionicons</a>,
                        <a class="underline" target="_blank" href="https://fonts.google.com/icons">GoogleIcons</a>.
                    </p>
                </div>
            </div>
            <div class="col-span-1 text-sm text-right font-semibold">
                <p>Version: 1.0.0</p>
            </div>
        </div>
        
        <br class="my-5" />

        <div class="text-sm">
            <p class="font-bold">Instructions:</p>
            <ul class="list-outside">
                {#each instructions as instruct, i}
                <li>{i + 1}. {@html instruct}</li>
                {/each}
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
        max-height: 90vh;
    }
</style>