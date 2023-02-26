<script lang="ts">
	import { authed } from "@stores/user";
	import UserPopOut from "./UserPopOut.svelte";
	import user from "@stores/user";
	import logo from "@assets/logo.png";
	import { clickoutside } from "sveltils/actions";
	import { Icon, NavigationLink } from "@components";
	import type { NavigationLink as NavigationLinkType } from "@types";
	import { Avatar } from "@components";
	import { page } from "$app/stores";
	import { subscribeToRealtimeDatabase } from "@fb/rtdb";
	import { onDestroy, onMount } from "svelte";
	import { onDestroy } from "svelte/types/runtime/internal/lifecycle";

	const SIDEBAR_LINKS: NavigationLinkType[] = [
		{ title: "Home", icon: "home", href: "/" },
		{ title: "Clubs", icon: "join", href: "/clubs" },
	];

	let userMenuOpen = false;
	let sidebarOpen = false;

	const toggleUserMenu = () => (userMenuOpen = !userMenuOpen);
	const toggleSidebar = () => (sidebarOpen = !sidebarOpen);
	const SIDEBAR_SECTION_CATEGORY = "px-2 flex gap-1 flex-col w-full";

	$: if ($authed === false) window.location.href = "/login";
	$: pathSegments = $page.url.pathname.split("/").filter((segment) => segment !== "");
</script>

<div class="flex h-[100dvh] w-[100dvw] overflow-hidden" aria-label="App layout">
	<aside
		on:dblclick={toggleSidebar}
		class="transition-width w-{sidebarOpen ? '64' : '18'} flex h-full flex-col gap-2 border-r-[1px] border-gray-300 py-2 duration-75"
		aria-label="Sidebar"
	>
		<section class={SIDEBAR_SECTION_CATEGORY}>
			<NavigationLink title="Toggle sidebar" icon={sidebarOpen ? "menu_open" : "menu"} on:click={toggleSidebar} />
		</section>

		<span class="separator-h" />

		<section class={SIDEBAR_SECTION_CATEGORY} aria-label="Page links">
			{#each SIDEBAR_LINKS as link}
				{@const active = $page.url.pathname.split("/")[1] === link.href.split("/")[1]}
				<NavigationLink {...link} {active} {sidebarOpen} />
			{/each}
		</section>

		<span class="separator-h" />

		{#if $user?.clubs.length > 0}
			<section class={SIDEBAR_SECTION_CATEGORY} aria-label="Club links">
				{#if sidebarOpen}
					<span class="text-overflow p-1 text-xs font-medium text-gray-500">My clubs</span>
				{/if}

				{#each $user?.clubs as club}
					{@const href = `/clubs/${club.id}`}
					{@const active = $page.url.pathname.startsWith(href)}
					<NavigationLink title={club.name} {href} {active} {sidebarOpen} shadowActive>
						<Avatar src={club.photo} size="20px" />
					</NavigationLink>
				{/each}
			</section>
		{:else if sidebarOpen}
			<div class="flex-center-column h-full gap-1">
				<Icon name="group_remove" customSize="2.5rem" color="gray-400" />
				<span class="text-overflow p-1 text-xs font-medium text-gray-500">You are not in any clubs</span>
			</div>
		{/if}
	</aside>

	<div class="relative w-full">
		<nav
			aria-label="Navbar"
			class="absolute top-0 left-0 flex h-[3.81rem] w-full items-center justify-between border-b-[1px] border-gray-300 bg-offwhite px-4"
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
							<Avatar src={club.photo} size="20px" />
							{club.name}
						{:else}
							{segment}
						{/if}
					</a>
				{/each}
			</section>

			<section class="relative" aria-label="User area">
				<Avatar src={$user?.photo} on:click={toggleUserMenu} />
				{#if userMenuOpen}
					<div class="absolute right-0 top-10" use:clickoutside on:clickoutside={toggleUserMenu}>
						<UserPopOut on:click={toggleUserMenu} />
					</div>
				{/if}
			</section>
		</nav>

		{#key $page}
			<div aria-label="App Content" class="scroll-y relative mt-16 h-full pb-16">
				<slot />
			</div>
		{/key}
	</div>
</div>
