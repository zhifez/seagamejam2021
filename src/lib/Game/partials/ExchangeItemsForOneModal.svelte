<script>
    import { itemIconMap } from '../../../stores/gameData';
    import { exchangeItemsForOne, game, setExchangeItemsInfo, system, takeAction } from '../../../stores/game.store';
    import Modal from '../../../components/Modal.svelte';
    import Button from '../../../components/Button.svelte';
    import { get } from 'svelte/store';

    const exchangeSelections = [
        'stick', 'stone', 'food', 'gem'
    ];

    let exchangeInfo;
    let itemGroups;
    let fromItem;
    let toItem;
    $: {
        exchangeInfo = $system.exchangeItemsInfo;
        const activePlayer = $game.players[$game.turn];
        itemGroups = {};
        activePlayer.storedItems.forEach(item => {
            if (exchangeSelections.indexOf(item) >= 0) {
                if (!(item in itemGroups)) {
                    itemGroups[item] = 0;
                }
                if (itemGroups[item] < exchangeInfo.min) {
                    ++itemGroups[item];
                }
            }
        });
    }

    const onSelectFromItem = (key) => {
        fromItem = key;
    }

    const onSelectToItem = (key) => {
        toItem = key;
    }

    const onCloseModal = () => {
        setExchangeItemsInfo(null);
    }

    const onExchange = () => {
        exchangeItemsForOne(fromItem, toItem);
        const systemState = get(system);
        takeAction(
            systemState.exchangeItemsInfo.index,
            systemState.exchangeItemsInfo.actionIndex
        );
        onCloseModal();
    }
</script>

<Modal
    modalBgColor={'bg-yellow-400'}
    canClose={false}
>
    <div class="modal-exchange-three flex flex-col justify-between p-3">
        <div class="text-center">
            <h1 class="text-xl font-semibold">Exchange {exchangeInfo.min}:1</h1>
            <h1>Exchange {exchangeInfo.min} items of the same type with 1 new item.</h1>
        </div>
        
        <hr class="my-3 border-black" />

        <div class="grid grid-cols-2 gap-2">
            <div class="col-span-1 flex flex-col items-center">
                <h1 class="font-semibold mb-2">Select item group:</h1>
                <div class="flex flex-col gap-2">
                    {#each Object.keys(itemGroups) as key}
                    {#if itemGroups[key] >= exchangeInfo.min}
                    <div 
                        class={`grid grid-cols-${exchangeInfo.min} gap-2 
                        cursor-pointer rounded-md p-1
                        border-2 border-yellow-500 hover:border-yellow-700
                        ${fromItem === key ? 'bg-white' : ''}
                        `}
                        on:click={() => onSelectFromItem(key)}
                    >
                        {#each Array(exchangeInfo.min) as _}
                        <div class={`col-span-1 gap-2 h-8 ${itemIconMap[key].iconColor}`}>
                            <svelte:component this={itemIconMap[key].icon} />
                        </div>
                        {/each}
                    </div>
                    {/if}
                    {/each}
                </div>
            </div>

            <div class="col-span-1 flex flex-col items-center">
                <h1 class="font-semibold mb-2">Exchange for:</h1>
                <div class="grid grid-cols-2 gap-2">
                    {#each exchangeSelections as item, i}
                    <div class="col-span-1">
                        <div 
                            class={`${itemIconMap[item].iconColor} w-12 h-12 p-1 
                            cursor-pointer rounded-md
                            border-2 border-yellow-500 hover:border-yellow-700
                            ${item === toItem ? 'bg-white' : ''}
                            `}
                            on:click={() => onSelectToItem(item)}
                        >
                            <svelte:component this={itemIconMap[item].icon} />
                        </div>
                    </div>
                    {/each}
                </div>
            </div>
        </div>

        <hr class="my-3 border-black" />

        <div class="flex items-center justify-center gap-2">
            <Button 
                label="Cancel"
                color="white"
                hoverColor="white"
                textColor="black"
                on:click={onCloseModal}
            />
            <Button 
                label={`Exchange ${exchangeInfo.min}x ${fromItem ?? '???'} to 1x ${toItem ?? '???'}`}
                on:click={onExchange}
                disabled={!fromItem || !toItem}
            />
        </div>
    </div>
</Modal>

<style>
    .modal-exchange-three {
        width: 40vw;
    }
</style>