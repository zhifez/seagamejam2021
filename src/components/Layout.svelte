<script>
    import Footer from './Footer.svelte';

    export let title;
</script>

<div class="flex flex-col h-screen justify-between">
    <div class="p-5">
        {#if title}<h1 class="text-4xl mb-3">{title}</h1>{/if}
        <slot />
    </div>

    <Footer />
</div>