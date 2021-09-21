<script>
    export let title = '';
    export let subtitle = '';
    export let disabled = false;

    let isHovered = false;
    const onMouseOver = () => {
        isHovered = true;
    }

    const onMouseLeave = () => {
        isHovered = false;
    }

    const onFocus = () => {}
</script>

<div class="relative">
    <div 
        on:mouseover={onMouseOver}
        on:mouseleave={onMouseLeave}
        on:focus={onFocus}
    >
        <slot />
    </div>

    {#if isHovered && !disabled}
    <div class="rounded-md shadow px-2 py-1 bg-white text-black absolute z-10 min-w-32 text-center">
        {#if title}<p class="text-sm font-semibold capitalize">{title}</p>{/if}
        {#if subtitle}<p class="text-xs">{subtitle}</p>{/if}
    </div>
    {/if}
</div>