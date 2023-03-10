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
			},
		},
		{
			key: "Escape",
			ctrlKey: false,
			shiftKey: false,
			altKey: false,
			action: () => {
				searchQuery = "";
				searchInput.blur();
			},
		},
	];

	let searchQuery = "";
	let searchInput: HTMLInputElement;

	$: pathSegments = $page.url.pathname.split("/").filter((segment) => segment !== "");
</script>

<svelte:window on:keydown={(e) => handleKeydown(e, SHORTCUTS)} />

<nav
	aria-label="Navbar"
	class="absolute top-0 left-0 z-20 flex h-[3.81rem] w-full items-center justify-between border-b-[1px] border-gray-300 bg-offwhite/60 px-4 backdrop-blur-md"
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
				{#if pathSegments[0]}
					{@const club = $page.data.club}
					<img src={club.photo} class="circle w-[20px]" alt={club.name} />
					{club.name}
				{:else}
					{segment}
				{/if}
			</a>
		{/each}
	</section>

	<div class="relative w-1/2" use:clickoutside on:clickoutside={() => (searchQuery = "")}>
		<div
			class="z-10 flex h-fit w-full items-center gap-2 rounded-md bg-gray-200 px-3 py-2.5 transition-all focus-within:bg-white focus-within:shadow-md"
		>
			<Icon name="search" size="xl" color="gray-500" />
			<input
				bind:value={searchQuery}
				bind:this={searchInput}
				type="text"
				class="text-overflow w-full bg-transparent text-sm focus:outline-none"
				placeholder="Find a club.."
			/>
			{#if searchQuery}
				<button on:click={() => (searchQuery = "")}>
					<Icon name="close" size="xl" color="gray-500" />
				</button>
			{/if}
		</div>

		{#if searchQuery}
			<div
				out:fly={{ y: -5, duration: 200 }}
				in:fly={{ y: -10, duration: 300 }}
				class="scroll-y absolute top-12 flex w-full flex-col gap-2 rounded-md bg-white p-4 shadow-xl"
			>
				<div
					class="group flex h-12 w-full items-center gap-2 rounded-md px-3 py-2 transition hover:bg-gray-100 hover:shadow-sm"
				>
					<Icon name="search" color="gray-400" />
					<span class="text-sm text-gray-800 transition group-hover:text-black">{searchQuery}</span>
				</div>
				<div
					role="status"
					class="w-full animate-pulse space-y-4 divide-y divide-gray-200 rounded p-4 shadow md:p-6"
				>
					<div class="flex items-center justify-between">
						<div>
							<div class="mb-2.5 h-2.5 w-24 rounded-full bg-gray-300" />
							<div class="h-2 w-32 rounded-full bg-gray-200" />
						</div>
						<div class="h-2.5 w-12 rounded-full bg-gray-300" />
					</div>
					<div class="flex items-center justify-between pt-4">
						<div>
							<div class="mb-2.5 h-2.5 w-24 rounded-full bg-gray-300" />
							<div class="h-2 w-32 rounded-full bg-gray-200" />
						</div>
						<div class="h-2.5 w-12 rounded-full bg-gray-300" />
					</div>
					<div class="flex items-center justify-between pt-4">
						<div>
							<div class="mb-2.5 h-2.5 w-24 rounded-full bg-gray-300" />
							<div class="h-2 w-32 rounded-full bg-gray-200" />
						</div>
						<div class="h-2.5 w-12 rounded-full bg-gray-300" />
					</div>
					<div class="flex items-center justify-between pt-4">
						<div>
							<div class="mb-2.5 h-2.5 w-24 rounded-full bg-gray-300" />
							<div class="h-2 w-32 rounded-full bg-gray-200 " />
						</div>
						<div class="h-2.5 w-12 rounded-full bg-gray-300" />
					</div>
					<div class="flex items-center justify-between pt-4">
						<div>
							<div class="mb-2.5 h-2.5 w-24 rounded-full bg-gray-300" />
							<div class="h-2 w-32 rounded-full bg-gray-200 " />
						</div>
						<div class="h-2.5 w-12 rounded-full bg-gray-300" />
					</div>
					<span class="sr-only">Loading...</span>
				</div>
			</div>
		{/if}
	</div>

	<UserMenu />
</nav>
