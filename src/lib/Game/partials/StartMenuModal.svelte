<script>
    import { instructions } from '../../../stores/gameData';
    import { setHasStarted, initGame, formatInstruction } from '../../../stores/game.store';
    import Button from '../../../components/Button.svelte';
    import Modal from '../../../components/Modal.svelte';

    const version = 'v1.0.0';

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
                
                <div class="mt-2">
                    <p><b>Developed by:</b> <a class="underline" target="_blank" href="https://zhifez.com/">zhifez</a></p>
                    
                    <p>
                        <b>Icons by:</b>
                        <a class="underline" target="_blank" href="https://fontawesome.com/">FontAwesome</a>,
                        <a class="underline" target="_blank" href="https://game-icons.net/">GameIcons</a>,
                        <a class="underline" target="_blank" href="https://ionic.io/ionicons">Ionicons</a>,
                        <a class="underline" target="_blank" href="https://primer.style/octicons/">GitHub Octicons</a>.
                    </p>
                </div>
            </div>
            <div class="col-span-1 text-sm text-right font-semibold">
                <p>Version: {version}</p>
            </div>
        </div>
        
        <hr class="my-4 border-black" />

        <div>
            <p class="font-bold">Instructions:</p>
            <ul class="list-outside text-sm">
                {#each instructions as instruct, i}
                <li>{i + 1}. {@html formatInstruction(instruct)}</li>
                {/each}
            </ul>
        </div>

        <br class="my-3" />

        <div>
            <p class="font-bold">Release Notes ({version}):</p>
            <ul class="list-outside text-sm">
                <li>- Fixed some game breaking bugs.</li>
                <li>- Added Bank action for items exchange.</li>
                <li>- Tested the game for a solo (1 Player) experience.</li>
            </ul>
        </div>

        <hr class="my-4 border-black" />

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