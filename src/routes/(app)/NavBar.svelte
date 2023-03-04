<script lang="ts">
    import logo from "@assets/logo.png";
	import { page } from "$app/stores";
	import { Avatar, Icon, IconButton, Loader } from "@components";
	import UserMenu from "./UserMenu.svelte";
	import { fly } from "svelte/transition";
	import { handleKeydown, type KeyboardShortcut } from "sveltils/handlers";
	import { clickoutside } from "sveltils/actions";

	const SHORTCUTS: KeyboardShortcut[] = [
		{
			key: "k",
			ctrlKey: true,
			shiftKey: false,
			altKey: false,
			action: () => {
				searchInput.focus();
			}
		},
		{
			key: "Escape",
			ctrlKey: false,
			shiftKey: false,
			altKey: false,
			action: () => {
				searchInput.blur();
			}
		}
	]

	let searchQuery = "";
	let searchInput: HTMLInputElement;

	$: pathSegments = $page.url.pathname.split("/").filter((segment) => segment !== "");
</script>

<svelte:window on:keydown={(e) => handleKeydown(e, SHORTCUTS)}/>

<nav
	aria-label="Navbar"
	class="z-20 absolute top-0 left-0 flex h-[3.81rem] w-full items-center justify-between border-b-[1px] border-gray-300 bg-offwhite/60 backdrop-blur-md px-4"
>
	<section class="flex items-center gap-2" aria-label="Breadcrumbs">
		<a href="/">
			<img src={logo} alt="logo" class="w-9" />
		</a>

		{#each pathSegments as segment, i}
			<span class="h-7 w-0.5 rotate-12 bg-gray-400" />
			<a
				class="text flex items-center gap-2 rounded-md px-2 py-1 font-semibold capitalize transition hover:shadow-md active:bg-gray-200 "
				class:font-bold={i === pathSegments.length - 1}
				class:text-gray-500={i !== pathSegments.length - 1}
				href={`/${pathSegments.slice(0, i + 1).join("/")}`}
			>
				{#if pathSegments[0] === "clubs" && i === 1}
					{@const club = $page.data.club}
					<img src={club.photo} class="w-[20px] circle" alt={club.name} />
					{club.name}
				{:else}
					{segment}
				{/if}
			</a>
		{/each}
	</section>

	<div class="relative w-1/2" use:clickoutside on:clickoutside={() => searchQuery = ""}>
		<div class="transition-all z-10 w-full h-fit flex gap-2 items-center px-3 py-2.5 rounded-md bg-gray-200 focus-within:bg-white focus-within:shadow-md">
			<Icon name="search" size="xl" color="gray-500"/>
			<input bind:value={searchQuery} bind:this={searchInput} type="text" class="text-overflow text-sm w-full bg-transparent focus:outline-none" placeholder="Find a club.." />
			{#if searchQuery}
				<button on:click={() => searchQuery = ""}>
					<Icon name="close" size="xl" color="gray-500"/>
				</button>
			{/if}
		</div>

		{#if searchQuery}
			<div out:fly={{y: -5, duration: 200}} in:fly={{y: -10, duration: 300}} class="overflow-hidden absolute top-12 rounded-md w-full p-4 h-64 bg-white shadow-xl">
				<!-- <div class="transition flex items-center gap-2 w-full px-3 py-2 rounded-md hover:bg-gray-200 h-12">
					<span class="text-sm">{searchQuery}</span>
				</div> -->

				<div in:fly={{y: 400, duration: 400, delay: 250}} out:fly={{y: -400, duration: 400}} class="w-full h-full flex-center-column gap-2">
					<Loader size="15"/>
					<span class="text-xs font-medium text-gray-400 uppercase">searching for "{searchQuery}"</span>
				</div>
			</div>
		{/if}
	</div>

	<UserMenu/>
</nav>
