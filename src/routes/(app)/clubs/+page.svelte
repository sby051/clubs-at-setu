<script lang="ts">
    import type { PageData } from "./$types";
	import { CategorySidebar, Icon, IconButton, TextInput } from "@components";
    import type { Category } from "@types";
    import ClubCard from "./ClubCard.svelte";

    export let data: PageData;

    let currentCategory = 0;
    let searchQuery = "";

    const clubs = Object.values(data.clubs);

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
    ];

    $: sortedClubs = clubs.sort((a, b) => a.name.localeCompare(b.name));

</script>

<main class="flex min-h-full" aria-label="Clubs"> 
    <div class="sticky top-0 h-full">
        <CategorySidebar title="Clubs" categories={CATEGORIES} bind:currentCategory searchBar bind:searchQuery/>
    </div>

    <div class="flex flex-wrap p-8 gap-4 scroll-y">
        {#each sortedClubs as club}
            {#if currentCategory === 0 || club.categories.includes(CATEGORIES[currentCategory].title)}
                {#if searchQuery === "" || (club.name + club.description).toLowerCase().includes(searchQuery.toLowerCase())}
                    <ClubCard club={club}/>
                {/if}
            {/if}
        {/each}
    </div>
</main>
