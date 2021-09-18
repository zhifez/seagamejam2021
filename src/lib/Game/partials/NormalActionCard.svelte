<script>
    export let name = '';
    export let hint = '';
    export const type = 'action';
</script>

<div class="col-span-1 row-span-1">
    <div 
        class={`rounded-md bg-yellow-300 shadow-md h-full px-2 py-1 
        border-4 border-yellow-300 hover:border-yellow-800 cursor-pointer
        flex flex-col justify-between
        `}
    >
        <section>
            <h1 class="font-semibold">{name}</h1>
            {#if hint}<p class="text-sm">{hint}</p>{/if}
        </section>
        
    </div>
</div>