<script>
    import { createGame, mainState, setImageSrc } from '../../stores/main.store';
    import GameCreatedModal from './partials/GameCreatedModal.svelte';
    import ImageModal from '../../components/ImageModal.svelte';
    import MainHeader from './partials/MainHeader.svelte';
    import Button from '../../components/Button.svelte';

    const onCreateGame = () => {
        createGame();
    }
</script>

{#if $mainState.showGameId}
<GameCreatedModal />
{/if}

<ImageModal />

<div class="w-screen min-h-screen p-10 bg-yellow-400 flex justify-center gap-3">
    <div class="w-full md:w-1/2 flex flex-col gap-3">
        <MainHeader />

        <div>
            <Button 
                label={$mainState.isLoading ? 'Creating Session' : 'Play Now'}
                textClass="text-xl"
                on:click={onCreateGame}
                disabled={$mainState.isLoading}
            />
        </div>

        <hr class="border-black my-3 w-full" />

        <h1 class="text-lg font-semibold">Screenshots</h1>
        <div class="grid grid-cols-2 gap-3">
            {#each Array(4) as _, i}
            <div class="col-span-1 cursor-pointer">
                <img 
                    src={`/images/screenshot_${i}.jpeg`} 
                    alt={`screenshot_${i}`} 
                    on:click={() => setImageSrc(`/images/screenshot_${i}.jpeg`)}
                />
            </div>
            {/each}
        </div>
    </div>
</div>

<style global>
    .border-1 {
        border-width: 1px !important;
    }

    .flip {
        -webkit-transform: scaleX(-1);
        transform: scaleX(-1);
    }
</style>