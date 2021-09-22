<script>
    import { setActiveTradeItem, system, takeAction, canTakeAction } from '../../../stores/game.store';
    import { actions } from '../../../stores/gameData';
    import { failure } from '../../../common/toastTheme';
    import ActionCardModal from '../../../components/ActionCardModal.svelte';

    const onCloseModal = () => {
        setActiveTradeItem(null);
    }

    const onTakeAction = () => {
        // let hireCoreActionIndex = -1;
        // for (let a=0; a<actions.length; ++a) {
        //     if (actions[a].type.includes('human')) {
        //         hireCoreActionIndex = a;
        //         break;
        //     }
        // }
        // const error = canTakeAction(hireCoreActionIndex, $system.activeTradeItem.actionIndex);
        // if (error) {
        //     failure(error);
        //     return;
        // }

        // takeAction(hireCoreActionIndex, $system.activeTradeItem.actionIndex);
        // onCloseModal();
    }
</script>

<ActionCardModal 
    activeData={$system.activeTradeItem}
    conditionLabel="Costs"
    takeActionLabel={`Get ${$system.activeTradeItem.name}`}
    onCloseModal={onCloseModal}
    onTakeAction={onTakeAction}
/>