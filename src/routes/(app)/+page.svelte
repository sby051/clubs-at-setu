<script lang="ts">
	import type { PageData } from "./$types";
	import { CategorySidebar, Icon } from "@components";
	import type { Category } from "@types";
	import ClubCard from "./ClubCard.svelte";
	import { fly } from "svelte/transition";
	import { windowTitle } from "@stores/globals";

	export let data: PageData;

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
		},
	];

	const scrollToTop = () => {
		document.getElementById("clubs-div")?.scrollTo({
			top: 0,
			behavior: "smooth",
		});
	};

	const handleScroll = (e: any) => scrolled = e.target.scrollTop > 100;
	
	const performSearch = (name: string) => {
		if (searchQuery === "") return true;
		return name.trim().toLowerCase().includes(searchQuery.trim().toLowerCase());
	};

	let scrolled = false;
	let currentCategory = 0;
	let searchQuery = "";
	$: sortedClubs = clubs.sort((a, b) => a.name.localeCompare(b.name));
</script>

<main class="flex h-full" aria-label="Clubs">
	<div class="sticky top-0">
		<CategorySidebar title="Clubs" categories={CATEGORIES} bind:currentCategory searchBar bind:searchQuery />
	</div>

	{#if clubs.length > 0}
		<div on:scroll={handleScroll} id="clubs-div" class="scroll-y p-8 flex flex-col gap-3 w-full">
			{#each sortedClubs as club}
				{#if currentCategory === 0 || club.categories.includes(CATEGORIES[currentCategory].title)}
					{#if performSearch(club.name)}
						<ClubCard {club} />
					{/if}
				{/if}
			{/each}
			<div class="w-full h-48 gap-2 flex-center-column border border-gray-300 rounded-lg">
				<Icon name="check_circle" size="6xl" className="text-green-500" outlined/>
				<p class="text-gray-400 text-sm">You've reached the end!</p>
			</div>
			{#if scrolled}
				<button transition:fly={{y: 400}} on:click={scrollToTop} class="z-50 text-white hover:scale-125 focus:scale-100 transition bg-violet-500/80 backdrop-blur-sm bottom-8 right-8 fixed shadow-lg w-12 h-12 rounded-full flex-center-column">
					<Icon name="arrow_upward"/>
				</button>
			{/if}
		</div>
	{:else}
		<div class="flex-center-column w-full h-full gap-2">
			<Icon name="search" size="6xl" className="text-gray-400"/>
			<p class="text-gray-400 text-sm">No clubs found</p>
		</div>
	{/if}
</main>
