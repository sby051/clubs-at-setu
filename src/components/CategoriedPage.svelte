<script lang="ts"></script>

<div class="flex">        
    <div class="flex flex-col gap-0.5 lg:w-64 flex-shrink-0 p-6 scroll-y h-full border-r-[1px] border-gray-300">
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

    <div class="flex flex-wrap p-8 gap-4">
        {#each sortedClubs as club}
            {#if currentCategory === 0 || club.categories.includes(CATEGORIES[currentCategory].title)}
                {#if searchQuery === "" || (club.name + club.description).toLowerCase().includes(searchQuery.toLowerCase())}
                    <ClubCard club={club}/>
                {/if}
            {/if}
        {/each}
    </div>
</div>