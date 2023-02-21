<script lang="ts">
	import { Icon, Tag } from "@components";
    import type { Club } from "@types";

    export let club: Club;
</script>

<a href="/clubs/{club.id}" class="h-[25rem] active:scale-[0.99] border-1 border-gray-300 max-w-96 transition cursor-pointer p-4 flex flex-col gap-4 hover:bg-white rounded-md">
    <img src={club.photo} class="w-96 aspect-video shadow-md rounded-lg" alt={club.name}/>
    
    <div class="flex flex-col gap-2">
        <div class="flex gap-2 items-center">
            <span class="text text-lg font-bold">{club.name}</span>
            {#each club.categories as category}
                <Tag outlined>
                    {category}
                </Tag>
            {/each}
        </div>
        <span class="text text-sm">
            {club.description}
        </span>
    </div>

    <div class="mt-auto w-full flex items-center gap-1 justify-end">
        <Tag color="gray-200">
            <Icon name="people" outlined />
            {club.members.length}
        </Tag>
        <Tag color="green-400">
            <Icon name="payments" />
            €{club.fee}/year
        </Tag>
    </div>
</a>