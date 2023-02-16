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
		},
		{
			title: "Add club",
			icon: "join",
		},
	];

	let currentCategory = 0;

	const clubs = [
		{
			name: "Chess Club",
			description: "A club for students who enjoy playing chess.",
			about: null,
			photo: null,
			announcements: [
				{
					id: "1",
					title: "Chess tournament coming up!",
					author: "2",
					content:
						"We're excited to announce our annual chess tournament will be held next month. Sign up today!",
					date: 1646534400,
				},
			],
			managers: ["3"],
			members: ["2", "4", "5", "6"],
			registrationCost: 0,
			categories: ["academic", "hobbies"],
			invites: [],
		},
		{
			name: "Environmental Club",
			description: "A club for students interested in environmental issues.",
			about: "Our mission is to raise awareness about environmental issues and promote sustainable practices on campus.",
			photo: null,
			announcements: [],
			managers: ["7", "8"],
			members: ["9", "10", "11", "12", "13"],
			registrationCost: 10,
			categories: ["community", "science", "service"],
			invites: ["14", "15"],
		},
		{
			name: "Film Club",
			description: "A club for students who love watching and discussing films.",
			about: null,
			photo: "https://example.com/film-club.jpg",
			announcements: [
				{
					id: "2",
					title: "Movie screening tonight!",
					author: "16",
					content:
						"Join us for a screening of The Godfather tonight at 7pm in the Student Center. Pizza and drinks provided!",
					date: 1645828800,
				},
			],
			managers: ["16", "17"],
			members: ["18", "19", "20"],
			registrationCost: 5,
			categories: ["arts", "media"],
			invites: [],
		},
		{
			name: "Basketball Club",
			description: "A club for students who love playing basketball.",
			about: "We meet twice a week to play pick-up games and work on our skills.",
			photo: null,
			announcements: [
				{
					id: "3",
					title: "Intramural basketball registration",
					author: "21",
					content:
						"Registration for intramural basketball is now open. We encourage all members to sign up and represent our club!",
					date: 1647758400,
				},
			],
			managers: ["22", "23"],
			members: ["24", "25", "26", "27", "28", "29"],
			registrationCost: 20,
			categories: ["athletics", "sports"],
			invites: ["30"],
		},
		{
			name: "Theater Club",
			description: "A club for students interested in theater.",
			about: "We produce two plays each semester and welcome students of all experience levels.",
			photo: null,
			announcements: [],
			managers: ["31"],
			members: ["32", "33", "34", "35"],
			registrationCost: 0,
			categories: ["arts", "culture"],
			invites: [],
		},
		{
			name: "Debate Club",
			description: "A club for students who enjoy debating.",
			about: "We meet weekly to discuss current events and practice our debating skills.",
			photo: null,
			announcements: [
				{
					id: "4",
					title: "Debate competition next week",
					author: "36",
					content:
						"Our club will be competing in a debate competition next week. Good luck to all participants!",
					date: 1648041600,
				},
			],
			managers: ["37", "38"],
			members: ["39", "40", "41", "42", "43"],
			registrationCost: 0,
			categories: ["politics", "academic"],
			invites: [],
		},
		{
			name: "Art Club",
			description: "A club for students who enjoy making art.",
			about: null,
			photo: null,
			announcements: [
				{
					id: "5",
					title: "Art exhibit next month",
					author: "44",
					content:
						"Our club will be hosting an art exhibit next month in the Student Center. All are welcome to attend!",
					date: 1648780800,
				},
			],
			managers: ["44", "45"],
			members: ["46", "47", "48", "49", "50"],
			registrationCost: 5,
			categories: ["arts", "culture"],
			invites: [],
		},
		{
			name: "Science Club",
			description: "A club for students who love science.",
			about: "We explore a different scientific topic each week and conduct experiments.",
			photo: null,
			announcements: [],
			managers: ["51", "52"],
			members: ["53", "54", "55", "56", "57"],
			registrationCost: 0,
			categories: ["science", "academic"],
			invites: [],
		},
		{
			name: "Dance Club",
			description: "A club for students who love to dance.",
			about: "We meet weekly to learn and practice different dance styles.",
			photo: "https://example.com/dance-club.jpg",
			announcements: [
				{
					id: "6",
					title: "Dance performance tonight",
					author: "58",
					content:
						"Come see our club perform a variety of dance styles tonight at 7pm in the Student Center.",
					date: 1646198400,
				},
			],
			managers: ["59", "60"],
			members: ["61", "62", "63", "64", "65", "66", "67"],
			registrationCost: 10,
			categories: ["arts", "athletics"],
			invites: [],
		},
	];

    const addClubs = async () => await createDocuments("clubs", clubs);
</script>

<div class="flex h-full">
	<CategorySidebar title="Admin" categories={CATEGORIES} bind:currentCategory />

	<div class="flex flex-col gap-0.5 w-full scroll-y p-12">
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
		{:else if currentCategory === 1}
			<button on:click={addClubs}>Add clubs</button>
		{/if}
	</div>
</div>
