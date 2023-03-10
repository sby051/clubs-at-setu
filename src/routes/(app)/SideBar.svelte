<script lang="ts">
	import { page } from "$app/stores";
	import { Icon, NavigationLink } from "@components";
	import { getDocument } from "@fb/firestore";
	import user from "@stores/user";
	import type { NavigationLink as NavigationLinkType } from "@types";
	import { toggle } from "svelte-machinery";

	const LINKS: NavigationLinkType[] = [{ title: "Clubs", icon: "people", href: "/" }];

	const SECTION_CLASSLIST = "px-2 flex gap-1 flex-col w-full" as const;

	let open = toggle();
</script>

<aside
	on:dblclick={open.toggle}
	class="transition-width flex h-full flex-col gap-2 border-r-[1px] border-gray-300 py-2 duration-75"
	style="width: {$open ? '300px' : '61px'}"
	aria-label="Sidebar"
>
	<section class={SECTION_CLASSLIST}>
		<NavigationLink title="Toggle sidebar" icon={open ? "menu_open" : "menu"} on:click={open.toggle} />
	</section>

	<span class="separator-h" />

	<section class={SECTION_CLASSLIST} aria-label="Page links">
		{#each LINKS as link}
			{@const active = $page.url.pathname.split("/")[1] === link.href.split("/")[1]}
			<NavigationLink {...link} {active} sidebarOpen={$open} />
		{/each}
	</section>

	<span class="separator-h" />

	{#if $user.clubs.length > 0}
		<section class={SECTION_CLASSLIST} aria-label="Club links">
			{#if $open}
				<span class="text-overflow p-1 text-xs font-medium text-gray-500">My clubs</span>
			{/if}

			{#each $user.clubs as club}
				{#await getDocument("clubs", club) then clubData}
					{@const href = "/" + clubData.id}
					{@const active = $page.url.pathname.startsWith(href)}
					<NavigationLink icon="group" title={clubData.name} {href} {active} sidebarOpen={$open}>
						<img
							src={clubData.photo}
							class="circle w-[20px] border border-gray-400 shadow-sm"
							alt={clubData.name}
						/>
					</NavigationLink>
				{/await}
			{/each}
		</section>
	{:else if $open}
		<div class="flex-center-column h-full gap-1">
			<Icon name="group_remove" customSize="2.5rem" color="gray-400" />
			<span class="text-overflow p-1 text-xs font-medium text-gray-500">You are not in any clubs</span>
		</div>
	{/if}
</aside>
