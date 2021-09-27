<script>
    import { mainState, setShowGameId } from '../../../stores/main.store';
    import Modal from '../../../components/Modal.svelte';
    import FaRegCopy from 'svelte-icons/fa/FaRegCopy.svelte';

    let url = window.location.host;
    $: {
        if ($mainState.gameId) {
            url += `/#/game/${$mainState.gameId}`;
        }
    }

    const onCloseModal = () => {
        setShowGameId(false);
    }

    let linkCopied = false;
    const onClickUrl = async () => {
        if (!navigator.clipboard) {
            return;
        }

        await navigator.clipboard.writeText(url);
        linkCopied = true;
        setTimeout(() => {
            linkCopied = false;
        }, 2000);
    }
</script>

<Modal
    modalClass=""
    on:close={onCloseModal}
>
    <div class="modal-wrapper bg-yellow-400 rounded-md p-5">
        <div class="flex flex-col gap-3">
            <h1 class="font-semibold text-2xl">New Game Created</h1>
            <p>Here's the link to your session:</p>
            <div 
                class="w-full p-2 rounded-md bg-gray-100 cursor-pointer text-sm relative"
                on:click={onClickUrl}
            >
                <button class="absolute top-2 right-2 h-5 text-gray-400">
                    <FaRegCopy />
                </button>
                <p class="overflow-ellipsis">{url}</p>
            </div>
            {#if linkCopied}
            <p class="text-sm">Link copied!</p>
            {:else}
            <p class="text-gray-500 text-sm">Copy this link and send to other players.</p>
            {/if}
        </div>
    </div>
</Modal>

<style>
    .modal-wrapper {
        width: 400px;
    }
</style>