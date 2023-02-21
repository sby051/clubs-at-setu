<script lang="ts">
    import type { Category } from "@types";
    import { IconButton, NavigationLink, TextInput } from "@components";

    export let categories: Category[];
    export let title: string;
    export let currentCategory = 0;
    export let searchBar = false;
    export let searchQuery = "";

    let searchVisible = false;
</script>

<div class="flex flex-col gap-0.5 w-64 flex-shrink-0 p-6 h-full scroll-y border-r-[1px] border-gray-300">
    <div class="flex w-full justify-between items-center mb-4">
        <span class="text text-2xl font-bold">{title}</span>
        {#if searchBar}
            <IconButton icon="search" on:click={() => searchVisible = !searchVisible}/>
        {/if}
    </div>
    {#if searchVisible}
        <TextInput placeholder="Search.." className="mb-4" bind:value={searchQuery}/>
    {/if}
    {#each categories as category, i}
        <NavigationLink {...category} active={i === currentCategory} sidebarOpen on:click={() => currentCategory = i}/>
    {/each}
</div>