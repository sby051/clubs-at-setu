<script lang="ts">
	import { page } from "$app/stores";
	import { Icon, NavigationLink } from "@components";
	import type { NavigationLink as NavigationLinkType } from "@types";
	import { getDocuments } from "@fb/fsdb";
	import user from "@stores/user";
	import type { Club } from "@types";
	import Avatar from "./Avatar.svelte";

	let createDrawerOpen = false;
	let open = false;

	let clubs: Club[] = [];

	const SECTION_CLASSES = "px-2 flex gap-1 flex-col w-full";

	let links: NavigationLinkType[] = [
		{ title: "Home", icon: "home", href: "/"},
		{ title: "Clubs", icon: "join", href: "/clubs" },
	];

	if($user.admin) links = [...links, { title: "Admin", icon: "admin_panel_settings", href: "/admin" }];

	user.subscribe(async (u) => clubs = await getDocuments<Club>("clubs", u.clubs))

	const toggleOpen = () => (open = !open);
</script>

<aside
	on:dblclick={toggleOpen}
	style="grid-area: sidebar"
	class="transition-width flex h-full w-[3.8rem] flex-col gap-2 border-r-[1px] border-gray-300 py-2 duration-75"
	class:open
	aria-label="Sidebar"
>
	<section class={SECTION_CLASSES}>
		<NavigationLink title="Toggle sidebar" icon={open ? "menu_open" : "menu"} on:click={toggleOpen} />
	</section>

	<span class="separator-h" />

	<section class={SECTION_CLASSES} aria-label="Page links">
		{#each links as link}
			{@const active = $page.url.pathname.split("/")[1] === link.href.split("/")[1]}
			<NavigationLink {...link} {active} sidebarOpen={open} />
		{/each}
	</section>

	<span class="separator-h" />

	{#if clubs.length > 0}
		<section class={SECTION_CLASSES} aria-label="Club links">
			{#if open}
				<span class="text-gray-500 text-xs p-1 font-medium text-overflow">My clubs</span>
			{/if}

			{#each clubs as club}
				{@const active = $page.url.pathname.startsWith(`/clubs/${club.id}`)}
				<NavigationLink
					title={club.name}
					href={`/clubs/${club.id}`}
					{active}
					sidebarOpen={open}
					shadowActive
				>
					<Avatar src={club.photo} size="20px"/>
				</NavigationLink>
			{/each}
		</section>
	{:else}
		{#if open}
			<div class="h-full flex-center-column gap-1">
				<Icon name="group_remove" customSize="2.5rem" color="gray-400" />
				<span class="text-gray-500 text-xs p-1 font-medium text-overflow">You are not in any clubs</span>
			</div>
		{/if}
	{/if}
</aside>

<style>
	.open {
		width: 15rem;
	}
</style>