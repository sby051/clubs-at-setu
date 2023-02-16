<script lang="ts">
    import type { PageData } from "./$types";
	import { CategorySidebar, Icon, IconButton, TextInput } from "@components";
    import type { Category } from "@types";
    import ClubCard from "./ClubCard.svelte";

    const CATEGORIES: Category[] = [
        {
            title: "all",
            icon: "explore",
        },
        {
            title: "sports",
            icon: "sports",
        },
        {
            title: "academic",
            icon: "school",
        },
        {
            title: "community",
            icon: "group",
        },
        {
            title: "culture",
            icon: "language",
        },
        {
            title: "faith",
            icon: "favorite",
        },
        {
            title: "gaming",
            icon: "videogame_asset",
        },
        {
            title: "hobbies",
            icon: "build",
        },
        {
            title: "media",
            icon: "movie",
        },
        {
            title: "music",
            icon: "music_note",
        },
        {
            title: "politics",
            icon: "gavel",
        },
        {
            title: "professional",
            icon: "work",
        },
        {
            title: "science",
            icon: "science",
        },
        {
            title: "service",
            icon: "local_hospital",
        },
        {
            title: "technology",
            icon: "computer",
        }
    ].sort((a, b) => a.title.localeCompare(b.title));

    CATEGORIES.unshift(CATEGORIES.splice(CATEGORIES.findIndex(category => category.title === "all"), 1)[0]);

    let currentCategory = 0;

    export let data: PageData;

    let searchQuery = "";
</script>

<div class="flex h-full">        
    <CategorySidebar title="Clubs" categories={CATEGORIES} bind:currentCategory searchBar bind:searchQuery/>

    <div class="flex flex-wrap p-12 gap-4 scroll-y">
        {#each data.clubs as club}
            {#if currentCategory === 0 || club.categories.includes(CATEGORIES[currentCategory].title)}
                {#if searchQuery === "" || (club.name + club.description).toLowerCase().includes(searchQuery.toLowerCase())}
                    <ClubCard club={club}/>
                {/if}
            {/if}
        {/each}
    </div>
</div>
