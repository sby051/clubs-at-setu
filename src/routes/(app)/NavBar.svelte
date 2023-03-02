<script lang="ts">
    import logo from "@assets/logo.png";
	import { page } from "$app/stores";
	import { Avatar } from "@components";
	import UserMenu from "./UserMenu.svelte";

	$: pathSegments = $page.url.pathname.split("/").filter((segment) => segment !== "");
</script>

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
					<Avatar src={club.photo} size="20px" />
					{club.name}
				{:else}
					{segment}
				{/if}
			</a>
		{/each}
	</section>

	<UserMenu/>
</nav>
