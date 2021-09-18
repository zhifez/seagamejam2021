<script>
    import NormalActionCard from './NormalActionCard.svelte';
    import CrownActionCard from './CrownActionCard.svelte';

    export let action;

    let component = NormalActionCard;
    $: {
        switch (action.type) {
        case 'crown-action':
            component = CrownActionCard;
            break;
        
        default:
            break;
        }
    }
</script>

<svelte:component this={component} {...action} />