<script>
    import { createGame, mainState } from '../../stores/main.store';
    import FaCrow from 'svelte-icons/fa/FaCrow.svelte';
    import GiImperialCrown from 'svelte-icons/gi/GiImperialCrown.svelte';
    import Button from '../../components/Button.svelte';
    import { Circle } from 'svelte-loading-spinners';
    import GameCreatedModal from './partials/GameCreatedModal.svelte';

    let numberOfPlayers = 0;
    const onSelectPlayerCount = (count) => {
        numberOfPlayers = count;
    }

    let willCreateGame = false;
    const onCreateGame = () => {
        if (!willCreateGame) {
            willCreateGame = true;
            return;
        }

        createGame(numberOfPlayers);
    }
</script>

{#if $mainState.showGameId}
<GameCreatedModal />
{/if}

<div class="w-screen h-screen p-10 bg-yellow-400 flex flex-col items-center justify-center">
    <div class="mx-auto flex flex-col items-center">
        <div class="flex flex-col items-center gap-3">
            <p class="uppercase text-sm">SEA Game Jam 2021</p>
            <div class="flex items-center gap-2">
                <div class="h-6">
                    <FaCrow />
                </div>
                <div class="h-8">
                    <GiImperialCrown />
                </div>
                <div class="h-6 flip">
                    <FaCrow />
                </div>
            </div>
            <h1 class="text-4xl font-semibold">A Crown for Crows</h1>
            <p>A worker placement game about managing crows to steal a crown, in the long run.</p>

            <div class="text-center">
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

        <hr class="border-black my-6 w-full" />

        <div class="w-1/2">
            <div class="flex flex-col items-center gap-4 relative">
                {#if $mainState.isLoading}
                <div class="absolute top-0 left-0 w-full h-full flex flex-col justify-center items-center">
                    <Circle size={32} color="rgba(59, 130, 246)" unit="px" />
                </div>
                {/if}

                {#if willCreateGame}
                <p class="font-semibold text-xl">Select number of players:</p>
                <div class="flex items-center gap-3">
                    {#each Array(4) as _, i}
                    <button 
                        class={`w-10 h-10 col-span-1 border-yellow-500 rounded-md 
                        flex flex-col justify-center cursor-pointer
                        ${numberOfPlayers === (i + 1) ? 'border-0 bg-yellow-700 text-white' : 'border-2'}
                        `}
                        on:click={() => onSelectPlayerCount(i + 1)}
                        disabled={$mainState.isLoading}
                    >
                        <span class="w-full text-center">{i + 1}</span>
                    </button>
                    {/each}
                </div>
                <Button 
                    label={numberOfPlayers > 0 ? 
                        `Create a ${numberOfPlayers} player${numberOfPlayers > 1 ? 's' : ''} game` : 
                        'Create Game'}
                    on:click={onCreateGame}
                    disabled={numberOfPlayers <= 0 || $mainState.isLoading}
                />
                {:else}
                <Button 
                    label="Play Now"
                    textClass="text-xl"
                    on:click={onCreateGame}
                />
                {/if}
            </div>
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