<script>
    import { fade } from 'svelte/transition';
    import IoIosClose from 'svelte-icons/io/IoIosClose.svelte';
    import { createEventDispatcher } from 'svelte';
    
    export let canClose = true;

    const dispatch = createEventDispatcher();

    const onClose = () => {
        dispatch('close');
    }
</script>

<div 
    class="fixed w-screen h-screen z-50"
    transition:fade
>
    <!-- Overlay -->
    <div class="w-full h-full bg-black opacity-50"></div>
    <!-- Content -->
    <div class="absolute top-0 left-0 w-screen h-screen flex flex-col justify-center">
        <div class="mx-auto">
            <div class="modal-inner relative p-3 rounded-md bg-white min-h-20">
                {#if canClose}
                <button 
                    class="absolute top-0 right-0 w-10 h-10"
                    on:click={onClose}
                >
                    <IoIosClose />
                </button>
                {/if}
                <slot />
            </div>
        </div>
    </div>
</div>

<style>
    .modal-inner {
        min-width: 25vw;
    }
</style>