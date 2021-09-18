<script>
    import GiImperialCrown from 'svelte-icons/gi/GiImperialCrown.svelte';

    export const name = '';
    export const type = 'action';
</script>

<div class="col-span-2 row-span-2">
    <div 
        class={`rounded-md bg-white shadow-md min-h-1/4 h-full p-3 
        border-2 border-white hover:border-gray-500 cursor-pointer
        `}
    >
        <div class="w-full h-full flex flex-col justify-center">
            <div class="w-16 h-16 m-auto">
                <GiImperialCrown />
            </div>
        </div>
    </div>
</div>