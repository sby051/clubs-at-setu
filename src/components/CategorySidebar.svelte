<script lang="ts">
	import type { Category } from "@types";
	import { slide } from "svelte/transition";
	import { Icon, IconButton, NavigationLink, TextInput } from "@components";
	import { cubicInOut } from "svelte/easing";

	export let categories: Category[];
	export let title: string;
	export let currentCategory = 0;
	export let searchBar = false;
	export let searchQuery = "";

	let searchVisible = false;
</script>

<div class="scroll-y flex h-full w-64 flex-shrink-0 flex-col gap-0.5 border-r-[1px] border-gray-300 p-6">
	<div class="mb-4 flex w-full items-center justify-between">
		<span class="text text-2xl font-bold">{title}</span>
		{#if searchBar}
			<IconButton icon="search" on:click={() => (searchVisible = !searchVisible)} />
		{/if}
	</div>
	{#if searchVisible}
		<TextInput placeholder="Search.." className="mb-4" bind:value={searchQuery}/>
	{/if}
	{#each categories as category, i}
		<NavigationLink
			{...category}
			active={i === currentCategory}
			sidebarOpen
			on:click={() => (currentCategory = i)}
		/>
	{/each}
</div>
