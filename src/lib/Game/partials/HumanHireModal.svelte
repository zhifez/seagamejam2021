<script>
    import { setActiveHumanHire, system, takeAction, canTakeAction } from '../../../stores/game.store';
    import { actions } from '../../../stores/gameData';
    import { failure } from '../../../common/toastTheme';
    import ActionCardModal from '../../../components/ActionCardModal.svelte';

    let activeHumanHire;
    let lifespan = 0;
    $: {
        activeHumanHire = $system.activeHumanHire;
        lifespan = activeHumanHire.lifespan - activeHumanHire.hiredLifespan;
    }

    const onCloseModal = () => {
        setActiveHumanHire(null);
    }

    const onTakeAction = () => {
        let hireCoreActionIndex = -1;
        for (let a=0; a<actions.length; ++a) {
            if (actions[a].type.includes('human')) {
                hireCoreActionIndex = a;
                break;
            }
        }
        const error = canTakeAction(hireCoreActionIndex, activeHumanHire.actionIndex);
        if (error) {
            failure(error);
            return;
        }

        takeAction(hireCoreActionIndex, activeHumanHire.actionIndex);
        onCloseModal();
    }
</script>

<ActionCardModal 
    activeData={activeHumanHire}
    contentWidget={`<p class="text-xs bg-red-500 text-white px-2 py-1 rounded-md mt-1">
        Lasts ${activeHumanHire.lifespan} round${activeHumanHire.lifespan > 1 ? 's' : ''}
    </p>`}
    takeActionLabel={`Hire ${activeHumanHire.name}`}
    onCloseModal={onCloseModal}
    onTakeAction={onTakeAction}
    bottomContent={activeHumanHire.actionIndex < 0 ?
        (lifespan > 0 ? 
        `Hired, and will be staying for ${lifespan > 1 ? lifespan : ''} more round${lifespan > 1 ? 's' : ''}.` : 
        'Hired, and will leave after this round.') : null}
/>