<script>
    export let name = '';
    export const type = 'action';
</script>

<div class="col-span-1">
    <div 
        class={`rounded-md bg-white shadow-md min-h-1/4 h-full p-3 
        border-2 border-white hover:border-gray-500 cursor-pointer
        `}
    >
        <h1 class="font-semibold">{name}</h1>
    </div>
</div>