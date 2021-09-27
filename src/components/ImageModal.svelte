<script>
    import { mainState, setImageSrc } from '../stores/main.store';
    import Modal from './Modal.svelte';

    let key = 'image_modal_src';
    
    const onCloseModal = () => {
        setImageSrc(null);
    }
</script>

{#if $mainState.imageSrc}
<Modal
    on:close={onCloseModal}
>
    <img class="image" src={$mainState.imageSrc} alt={key} />
</Modal>
{/if}

<style>
    .image {
        max-width: 90vw;
        max-height: 90vh;
    }
</style>