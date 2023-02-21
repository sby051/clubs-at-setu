<script lang="ts">
	import type { PageData } from "./$types";
	import type { Category, NavigationLink as NavigationLinkType } from "@types";
	import { CategorySidebar, Icon, IconButton, NavigationLink, Tag } from "@components";
	import { goto } from "$app/navigation";
	import { onMount } from "svelte";
	import user from "@stores/user";
	import Avatar from "../Avatar.svelte";
	import UserRow from "./UserRow.svelte";
	import ClubCard from "../clubs/ClubCard.svelte";
	import { createDocuments } from "@fb/fsdb";

	let loading = true;

	onMount(() => {
		if (!$user.admin) goto("/");
		loading = false;
	});

	export let data: PageData;

	const CATEGORIES: Category[] = [
		{
			title: "users",
			icon: "person",
		}
	];

	let currentCategory = 0;
</script>

<div class="flex h-full">
	<CategorySidebar title="Admin" categories={CATEGORIES} bind:currentCategory />

	<div class="flex flex-col w-full scroll-y p-8">
		{#if currentCategory === 0}
			{#if data.users.length > 0}
				{#each data.users as user}
					<UserRow {user} />
				{/each}
			{:else}
				<div class="flex flex-col gap-4 items-center justify-center h-full">
					<Icon name="person_off" size="6xl" color="gray-500" />
					<span class="text text-xl text-gray-500">No users</span>
				</div>
			{/if}
		{/if}
	</div>
</div>
