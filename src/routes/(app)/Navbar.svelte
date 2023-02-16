<script lang="ts">
	import UserPopOut from "./UserPopOut.svelte";
	import Avatar from "./Avatar.svelte";
	import { page } from "$app/stores";
	import user from "@stores/user";
	import logo from "@assets/logo.png";
	import { clickoutside } from "sveltils/actions";

	let name = "";
	let userMenuOpen = false;

	$: pathSegments = $page.url.pathname.split("/").filter((segment) => segment !== "");

	const toggleUserMenu = () => (userMenuOpen = !userMenuOpen);
</script>

<nav class="flex w-full items-center justify-between border-b-[1px] border-gray-300 px-3 py-[9px]" aria-label="Navbar">
	<section class="flex items-center gap-2" aria-label="Breadcrumbs">
		<a href="/">
			<img src={logo} alt="logo" class="w-9" />
		</a>

		{#each pathSegments as segment, i}
			<span class="h-7 w-0.5 rotate-12 bg-gray-400" />
			<a
				class="text rounded-md items-center gap-2 flex px-2 py-1 font-semibold capitalize transition hover:shadow-md active:bg-gray-200 "
				class:font-bold={i === pathSegments.length - 1}
				class:text-gray-500={i !== pathSegments.length - 1}
				href={`/${pathSegments.slice(0, i + 1).join("/")}`}
			>
				{#if pathSegments[0] === "clubs" && i === 1}
					{@const club = $page.data.club}
					<Avatar src={club.photo} size="20px"/>
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
			<div class="absolute right-0 top-10" use:clickoutside on:clickoutside={() => userMenuOpen = false}>
				<UserPopOut on:click={toggleUserMenu} />
			</div>
		{/if}
	</section>
</nav>
