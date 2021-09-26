<script>
    import { canTakeCrownAction, setActiveCrownAction, system, takeCrownAction } from '../../../stores/game.store';
    import { failure } from '../../../common/toastTheme';
    import ActionCardModal from '../../../components/ActionCardModal.svelte';

    let action;
    $: {
        action = $system.activeCrownAction;
    }

    const onCloseModal = () => {
        setActiveCrownAction(null);
    }

    const onTakeCrownAction = () => {
        const error = canTakeCrownAction(action);
        if (import.meta.env.VITE_BYPASS_CROWN_ACTION_CONDITIONS !== 'true') {
            if (error) {
                failure(error);
                return;
            }
        }

        takeCrownAction(action);
        setActiveCrownAction(null);
    }
</script>

<ActionCardModal 
    activeData={{...action, actionIndex: 0}}
    takeActionLabel="Take Challenge"
    onCloseModal={onCloseModal}
    onTakeAction={onTakeCrownAction}
/>