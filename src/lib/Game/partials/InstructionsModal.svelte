<script>
    import { instructions } from '../../../stores/gameData';
    import { formatInstruction, setShowInstructions } from '../../../stores/game.store';
    import Modal from '../../../components/Modal.svelte';

    const onClose = () => {
        setShowInstructions(false);
    }
</script>

<Modal
    modalBgColor={'bg-yellow-400'}
    on:close={onClose}
>
    <div class="modal-start-menu p-3">
        <div>
            <p class="uppercase text-sm">SEA Game Jam 2021</p>
            <h1 class="text-4xl font-semibold">A Crown for Crows</h1>
            <p>A worker placement game about managing crows to steal a crown, in the long run.</p>
        </div>
        
        <hr class="my-3 border-black" />

        <div>
            <p class="font-bold text-lg">Instructions:</p>
            <ul class="list-outside text-sm">
                {#each instructions as instruct, i}
                <li>{i + 1}. {@html formatInstruction(instruct)}</li>
                {/each}
            </ul>
        </div>
    </div>
</Modal>

<style>
    .modal-start-menu {
        min-width: 60vw;
        max-width: 60vw;
    }
</style>