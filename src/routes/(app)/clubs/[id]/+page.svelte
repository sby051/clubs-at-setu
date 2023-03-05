<script lang="ts">
	import { enter } from 'sveltils/actions';
	import { Button, Drawer, Icon, IconButton, Tag, TextInput } from "@components";
	import type { PageData, Snapshot } from "./$types";
	import Time from "svelte-time";
	import user from "@stores/user";
	import { getDocument, updateDocument } from "@fb/firestore";
	import { Avatar } from "@components";
	import { confirm } from "@features/confirm";
	import { fade, slide } from "svelte/transition";
	import type { Announcement } from "@types";
	import { windowTitle } from "@stores/globals";
	import { sleep } from '@utils/helpers';

	export let data: PageData;

	const { club } = data;

	const joinClub = async () => {
		if (isMember) return;

		const confirmed = await confirm(`Join "${club.name}"`, {
			message: "Joining this club will cost you €" + club.fee + "/year.",
			icon: "group_add",
			buttons: {
				confirm: {
					text: "Join club",
					icon: "group_add",
					style: "primary",
				},
				cancel: {
					text: "Nevermind",
					style: "outlined:normal",
				}
			}
		});

		if(!confirmed) return;

		$user.clubs = [...$user.clubs, club.id];

		club.members = [...club.members, $user.id];

		await updateDocument("users", $user.id, { clubs: $user.clubs });
	};

	const leaveClub = async () => {
		if(!isMember) return;

		if(isManager) {
			await confirm("You are a manager of this club", {
				message: "You cannot leave this club until you transfer your manager role to another member. Please contact an administrator if you wish to do this.",
				icon: "warning",
				buttons: {
					confirm: {
						text: "OK",
						style: "primary",
					}
				}
			});
			return;
		}

		const confirmed = await confirm("Are you sure you want to leave this club?", {
			message: "You will not be refunded any fees you have paid for this club.",
			icon: "group_remove",
			buttons: {
				confirm: {
					text: "Leave club",
					icon: "group_remove",
					style: "danger",
				},
				cancel: {
					text: "I'll stay!",
					style: "outlined:primary",
				}
			}
		});

		if (!isMember || !confirmed) return;

		$user.clubs = $user.clubs.filter(c => c !== club.id);

		club.members = club.members.filter(m => m !== $user.id);

		await updateDocument("users", $user.id, { clubs: $user.clubs });
	};

	const createAnnouncement = async () => {
		if (!announcement.title) return;

		const fullAnnouncement: Announcement = {
			id: btoa(JSON.stringify(announcement)).substring(0, 16) + "-" + Math.random().toString(36).substring(2, 15),
			date: Date.now(),
			author: $user.firstName + " " + $user.lastName,
			...announcement,
		};

		announcement.title = "";
		announcement.content = "";

		postingAnnouncement = true;

		await updateDocument("clubs", club.id, { announcements: club.announcements });

		setTimeout(() => {
			postingAnnouncement = false;
			club.announcements = [fullAnnouncement as Announcement, ...club.announcements];
		}, 500)
	};

	const deleteAnnouncement = async (announcement: Announcement) => {
		const confirmed = await confirm("Are you sure you want to delete this announcement?", {
			message: "This action cannot be undone.",
			icon: "warning",
			buttons: {
				confirm: {
					text: "Delete announcement",
					icon: "delete",
					style: "danger",
				},
				cancel: {
					text: "Let's keep it!'",
					style: "outlined:primary",
				}
			}
		});

		if (!confirmed) return;

		club.announcements = club.announcements.filter(a => a.id !== announcement.id);

		await updateDocument("clubs", club.id, { announcements: club.announcements });
	};

	const updateClub = () => {
		updateDocument("clubs", club.id, {
			name: club.name,
			description: club.description,
		});

		editClubDrawerOpen = false;
	}

	let announcement = {
		title: "",
		content: "",
	}

	export const snapshot: Snapshot<{ title: string, content: string }> = {
		capture: () => announcement,
		restore: (snapshot) => {
			announcement = snapshot;
		}
	}

	let postingAnnouncement = false;
	let editClubDrawerOpen = false;

	$: isMember = $user.clubs.includes(club.id);
	$: isManager = club.managers.includes($user.id) || $user.admin;

	$windowTitle = club.name;
</script>

<Drawer bind:open={editClubDrawerOpen} title="Edit club" on:close={() => editClubDrawerOpen = false}>
	<TextInput bind:value={club.name} label="Club name" />
	<TextInput bind:value={club.description} label="Club description" />
	<svelte:fragment slot="footerButtons">
		<Button fillWidth style="outlined:normal" on:click={() => editClubDrawerOpen = false}>Cancel</Button>
		<Button fillWidth style="primary" on:click={updateClub}>
			<Icon name="check"/>
			Save
		</Button>
	</svelte:fragment>
</Drawer>

<header class="flex items-center gap-8 border-b-[1px] border-b-gray-300 p-10" aria-label="Club header">
	<img alt={club.name} src={club.photo} class="aspect-video w-64 rounded-lg shadow-md" />
	<div class="flex w-full flex-col gap-4">
		<div class="flex w-full items-center gap-1">
			<span class="text-overflow w-full text-4xl font-extrabold">{club.name}</span>
			<div class="flex w-full items-center justify-end gap-1">
				{#if isManager}
					<Button style="outlined:primary" on:click={() => editClubDrawerOpen = !editClubDrawerOpen}>
						<Icon name="edit" />
						Edit
					</Button>
				{/if}
				{#if !isMember}
					<Button style="primary" className="rounded-full" on:click={joinClub}>
						<Icon name="group_add" outlined />
						Join for {club.fee ? `€${club.fee}/year` : "free"}
					</Button>
				{:else}
					<Button style="danger" className="rounded-full" on:click={leaveClub}>
						<Icon name="group_remove" />
						Leave
					</Button>
				{/if}
			</div>
		</div>

		<span class="text-gray-500">{club.description}</span>

		<div class="flex items-center gap-1">
			{#if isMember}
				<Tag className="bg-violet-500 text-offwhite">
					<Icon name="check"/>
					Joined
				</Tag>
				{#if isManager}
					<Tag className="bg-orange-600 text-offwhite">
						<Icon name="admin_panel_settings"/>
						You're a Manager
					</Tag>
				{/if}
			{:else}
				<Tag color="orange-400" className="bg-green-500 text-offwhitewhite">
					<Icon name="payments" />
					€{club.fee}/year
				</Tag>
			{/if}
			<Tag outlined>
				<Icon name="people" outlined />
				{club.members.length}
				members
			</Tag>
			{#each club.categories as category}
				<Tag outlined>
					{category}
				</Tag>
			{/each}
		</div>
	</div>
</header>

<main class="flex min-h-screen" aria-label="{club.name} Club">
	<section
		class="relative flex w-full flex-col gap-4 border-r-[1px] border-r-gray-300 p-8"
		aria-label="Announcements"
	>
		<span class="text text-xl font-semibold">Announcements</span>

		{#if !isMember}
			<div class="flex-center-column h-full w-full gap-2">
				<Icon name="warning" customSize="6rem" color="gray-400" />
				<span class="text text-md text-gray-500">You must be a member to view announcements.</span>
			</div>
		{:else}
			{#if isManager}
				<form
					on:submit|preventDefault={createAnnouncement}
					use:enter
					on:enter={createAnnouncement}
					class="border-1 flex w-full flex-col gap-3 rounded-md border-gray-300 px-4 py-3 transition focus-within:bg-white "
				>
					<div class="flex w-full items-center gap-2">
						<Icon name="campaign" customSize="1.5rem" color="gray-500" />
						<input
							maxlength="50"
							type="text"
							bind:value={announcement.title}
							class="text-overflow w-full bg-transparent text-xl font-semibold focus:outline-none"
							placeholder="Say something to your club.."
						/>
						{#if announcement.title}
							<IconButton icon="close" on:click={() => (announcement.title = "")} />
						{/if}
					</div>

					{#if announcement.title}
						{@const contentLimit = 1028}
						<div class="flex w-full flex-col gap-3" transition:slide={{duration: 100}}>
							<textarea
								maxlength={contentLimit}
								bind:value={announcement.content}
								class="h-64 w-full resize-none bg-transparent text-sm focus:outline-none"
								placeholder="Say something to your club.."
							/>
							<span class="flex w-full items-center justify-end gap-2">
								{#if announcement.content}
									{@const limitReached = announcement.content.length >= contentLimit}
									<span class:text-red-400={limitReached} class:animate-pulse={limitReached} class:font-medium={limitReached} transition:fade={{duration: 80}} class="text text-xs font-light text-gray-600">
										{announcement.content.length}/{contentLimit}
									</span>
								{/if}
								<Button style="primary" size="sm" type="submit">
									Send
									<Icon name="send" />
								</Button>
							</span>
						</div>
					{/if}
				</form>
			{/if}

			<ol class="relative border-l-2 border-green-500/30 h-fit">
				{#if club.announcements.length > 0}
					{#if postingAnnouncement}
						<li in:slide class="ml-6 h-16">
							<div class="flex-center-column absolute w-6 h-6 bg-violet-500 animate-bounce rounded-full -left-3">
								<Icon name="upload" customSize="1rem" color="white" />
							</div>
							<span class="text text-sm text-gray-400 animate-pulse">Posting announcement...</span>
						</li>
					{/if}
					{#each club.announcements as announcement}
						{#await sleep(0.5)}
							<li class="ml-6 h-16">
								<div class="flex-center-column absolute w-6 h-6 bg-gray-400 animate-spin rounded-full -left-3">
									<Icon name="sync" customSize="1rem" color="white" />
								</div>
								<span class="text text-sm text-gray-400 animate-pulse">Loading announcement...</span>
							</li>
						{:then _}
							<li class="ml-6 delay-75 group mb-4 hover:bg-white hover:shadow-md rounded-lg hover:p-3 p-0 transition-all">
								<div class="flex-center-column absolute w-6 h-6 bg-green-500 rounded-full -left-3">
									<Icon name="campaign" customSize="1rem" color="white" />
								</div>
								<div class="flex gap-2 items-center">
									<time class="mb-1 text-xs font-normal leading-none text-gray-400">
										<Time relative={Date.now() < announcement.date + 1000 * 60 * 60 * 3} timestamp={announcement.date} />
									</time>
									<div class="w-1 h-1 bg-gray-300 rounded-full"/>
									<span class="text text-xs font-medium text-gray-500">{announcement.author}</span>
								</div>
								<h3 class="text-lg text-overflow font-semibold text-gray-900">{announcement.title}</h3>
								<p class="my-2 text-sm text-wrap font-normal text-gray-500 ">{announcement.content}</p>
								{#if isManager}
									<div class="delay-75 transition opacity-0 group-hover:opacity-100 justify-end flex gap-1">
										<Button style="danger" size="sm" on:click={() => deleteAnnouncement(announcement)}>
											<Icon name="delete"/>
											Delete announcement
										</Button>
									</div>
								{/if}
							</li>
						{/await}
					{/each}
					<li in:slide class="ml-6">
						<div class="flex-center-column absolute w-6 h-6 bg-violet-500 rounded-full -left-3">
							<Icon name="check" customSize="1rem" color="white" />
						</div>
						<h3 class="text-lg font-semibold text-gray-900 ">You've reached the end!</h3>
						<p class="my-2 text-wrap text-sm font-normal text-gray-500 ">Come back later, there might be something new to see.</p>
					</li>
				{:else}
					<li class="ml-6">
						<div class="flex-center-column absolute w-6 h-6 bg-gray-300 rounded-full -left-3">
							<Icon name="blur_on" customSize="1rem" />
						</div>
						<p class="my-2 text-wrap text-sm font-normal text-gray-500 ">No announcements found. </p>
					</li>
				{/if}
			</ol>
		{/if}
	</section>

	<section class="sticky top-0 flex h-full min-w-[15rem] flex-col gap-4 p-8">
		<span class="text text-xl font-semibold">Members</span>

		<ul class="flex flex-col gap-1 pb-8">
			{#if club.members.length > 0}
				{#each club.members as member}
					{@const manager = club.managers.includes(member)}
					{#await getDocument("users", member)}
						<li class="h-8 w-full animate-pulse rounded-md bg-gray-200" />
					{:then user}
						<li class="flex items-center gap-2 rounded-md p-2 transition hover:bg-gray-200">
							<Avatar src={user.photo} size="28px" />
							<span class="text-overflow text text-sm font-medium text-gray-800">{user.firstName} {user.lastName}</span>
							{#if manager}
								<Icon
									className="ml-auto"
									name="admin_panel_settings"
									customSize="1.25rem"
									color="red-400"
								/>
							{/if}
						</li>
					{/await}
				{/each}
			{:else}
				<li class="border-1 flex flex-col gap-2 rounded-md border-gray-300 p-4">
					<span class="text text-sm text-gray-500">No members yet.</span>
				</li>
			{/if}
		</ul>
	</section>
</main>
