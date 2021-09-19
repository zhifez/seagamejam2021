<script>
    import { setActiveCrownAction, system } from 'src/stores/game.store';
    import Modal from '../../../components/Modal.svelte';

    const onCloseModal = () => {
        setActiveCrownAction(null);
    }
</script>

<Modal
    modalClass="relative"
    on:close={onCloseModal}
>

</Modal>