<script>
    import { setActiveTradeItem, system, takeAction, canTakeAction } from '../../../stores/game.store';
    import { actions } from '../../../stores/gameData';
    import { failure } from '../../../common/toastTheme';
    import ActionCardModal from '../../../components/ActionCardModal.svelte';

    let activeTradeItem;
    $: {
        activeTradeItem = $system.activeTradeItem;
    }

    const onCloseModal = () => {
        setActiveTradeItem(null);
    }

    const onTakeAction = () => {
        let coreActionIndex = -1;
        for (let a=0; a<actions.length; ++a) {
            if (actions[a].type.includes('trade')) {
                coreActionIndex = a;
                break;
            }
        }
        
        const error = canTakeAction(coreActionIndex, activeTradeItem.actionIndex);
        if (error) {
            failure(error);
            return;
        }

        takeAction(coreActionIndex, activeTradeItem.actionIndex);
        onCloseModal();
    }
</script>

<ActionCardModal 
    activeData={activeTradeItem}
    conditionLabel="Costs"
    takeActionLabel={`Get ${activeTradeItem.name}`}
    onCloseModal={onCloseModal}
    onTakeAction={onTakeAction}
/>