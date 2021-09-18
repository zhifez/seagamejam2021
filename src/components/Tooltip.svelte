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

<div 
    on:mouseover={onMouseOver}
    on:mouseleave={onMouseLeave}
    on:focus={onFocus}
>
    <slot />
</div>

{#if isHovered && !disabled}
<div class="rounded-md shadow px-2 py-1 bg-white absolute z-10">
    <p class="text-sm font-semibold">{title}</p>
    <p class="text-xs">{subtitle}</p>
</div>
{/if}