<script lang="ts">
	import { Button, Icon, IconButton, Tag } from "@components";
	import type { PageData } from "./$types";
	import Time from "svelte-time";
	import user from "@stores/user";
	import { getDocument, updateDocument } from "@fb/fsdb";
	import { Avatar } from "@components";
	import { confirm } from "@features/confirm";
	import { invalidateAll } from "$app/navigation";
	import { fade, slide } from "svelte/transition";
	import type { Announcement } from "@types";
	import { ChatRoom } from "@features/chat";

	export let data: PageData;

	const { club } = data;

	const announcement = {
		title: "",
		content: "",
	};

	const joinClub = async () => {
		if (isMember) return;
		$user = {
			...$user,
			clubs: [...$user?.clubs, club.id],
		};
		await updateDocument("clubs", club.id, {
			members: [...club.members, $user?.id],
		});

		await invalidateAll();
	};

	const leaveClub = async () => {
		const confirmed = await confirm("Are you sure you want to leave this club?", {
			message: "You will not be refunded any fees you have paid for this club.",
			icon: "warning",
		});

		if (!isMember || !confirmed) return;

		$user = {
			...$user,
			clubs: $user.clubs.filter((id) => id !== club.id),
		};

		await updateDocument("clubs", club.id, {
			members: club.members.filter((id) => id !== $user?.id),
		});

		await invalidateAll();
	};

	const createAnnouncement = async () => {
		if (!announcement.title) return;

		const fullAnnouncement: Announcement = {
			...announcement,
			date: Date.now(),
			author: $user?.id,
			readBy: [],
		};

		postingAnnouncement = true;
		await updateDocument("clubs", club.id, {
			announcements: [...club.announcements, fullAnnouncement],
		});
		postingAnnouncement = false;
		announcement.title = "";
		announcement.content = "";

		await invalidateAll();
	};

	const deleteAnnouncement = async () => {
		const confirmed = await confirm("Are you sure you want to delete this announcement?", {
			message: "This action cannot be undone.",
			icon: "warning",
		});

		if (!confirmed) return;

		await updateDocument("clubs", club.id, {
			announcements: club.announcements.filter((a) => a.title !== announcement.title),
		});

		await invalidateAll();
	};

	let postingAnnouncement = false;

	$: isMember = $user.clubs.includes(club.id);
	$: isManager = club.managers.includes($user?.id) || $user?.admin;
</script>

<header class="flex items-center gap-8 border-b-[1px] border-b-gray-300 p-10" aria-label="Club header">
	<img alt={club.name} src={club.photo} class="aspect-video w-64 rounded-lg shadow-md" />
	<div class="flex w-full flex-col gap-4">
		<div class="flex w-full items-center gap-1">
			<span class="text-overflow w-full text-4xl font-extrabold">{club.name}</span>
			<div class="flex w-full items-center justify-end gap-1">
				{#if isManager}
					<Button style="outlined:primary">
						<Icon name="edit" />
						Edit
					</Button>
				{/if}
				{#if !isMember}
					<Button style="primary" className="rounded-full" on:click={joinClub}>
						<Icon name="group_add" />
						Join for {club.fee ? "Free" : `€${club.fee}/year`}
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
			<Tag>
				<Icon name="payments" />
				€{club.fee ? club.fee : "Free"}/year
			</Tag>
			<Tag outlined>
				<Icon name="person" />
				{club.members.length} member{club.members.length === 1 ? "" : "s"}
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
					class="border-1 flex w-full flex-col gap-3 rounded-md border-gray-300 px-4 py-3 transition focus-within:bg-white hover:bg-white"
				>
					{#if postingAnnouncement}
						Posting...
					{:else}
						<div class="flex w-full items-center gap-2">
							<Icon name="campaign" customSize="1.5rem" color="gray-500" />
							<input
								maxlength="50"
								type="text"
								bind:value={announcement.title}
								class="text-overflow w-full bg-transparent text-lg font-medium focus:outline-none"
								placeholder="Say something to your club.."
							/>
							{#if announcement.title}
								<IconButton icon="close" on:click={() => (announcement.title = "")} />
							{/if}
						</div>
						{#if announcement.title}
							<div class="flex w-full flex-col gap-3" transition:slide>
								<textarea
									maxlength="256"
									bind:value={announcement.content}
									class="h-64 w-full resize-none bg-transparent focus:outline-none"
									placeholder="Say something to your club.."
								/>
								<Button style="primary" size="sm" className="w-fit ml-auto" type="submit">
									<Icon name="send" />
									Send
								</Button>
							</div>
						{/if}
					{/if}
				</form>
			{/if}

			<ul class="flex flex-col gap-1">
				{#if club.announcements.length > 0}
					{#each club.announcements as announcement}
						{#await getDocument("users", announcement.author)}
							<li class="h-8 w-full animate-pulse rounded-md bg-gray-200" />
						{:then author}
							{#each [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15] as i}
								<li
									class="border-1 group relative flex flex-col gap-2 rounded-md border-gray-300 p-4 transition hover:bg-white"
								>
									<span class="flex items-center gap-2">
										<Avatar src={author.photo} size="32px" />
										<div class="flex flex-col ">
											<span class="text text-sm font-medium text-gray-800"
												>{author.firstName} {author.lastName}</span
											>
											<span class="text text-xs font-medium text-gray-500"
												>{author.studentId}</span
											>
										</div>
										<Icon name="admin_panel_settings" customSize="1.25rem" color="gray-600" />
										<span class="text ml-auto text-xs">
											<Time
												relative={Date.now() < announcement.date + 1000 * 60 * 60 * 3}
												timestamp={announcement.date}
												format="dddd D, MMMM YYYY @ h:mm:a"
											/>
										</span>
									</span>
									<span class="text text-lg font-semibold text-gray-800">{announcement.title}</span>
									<span class="text text-sm text-gray-500">{announcement.content}</span>
									{#if isManager}
										<span
											class="border-1 invisible absolute -right-2 -top-2 z-20 flex items-center rounded-full border-gray-300 bg-gray-200 p-0.5 shadow-md transition group-hover:visible"
										>
											<IconButton icon="edit" title="Feature coming soon.." disabled />
											<IconButton icon="delete" title="Delete announcement" />
										</span>
									{/if}
								</li>
							{/each}
						{/await}
					{/each}
				{:else}
					<div class="border-1 flex flex-col gap-2 rounded-md border-gray-300 p-4">
						<span class="text text-sm text-gray-500">No announcements yet.</span>
					</div>
				{/if}
			</ul>
		{/if}
	</section>

	<!-- <section class="sticky flex flex-col gap-4 top-0 h-full p-8 min-w-[30rem] border-r-[1px] border-r-gray-300">
        <span class="text text-xl font-semibold">Chat</span>

        <ChatRoom id={club.id} members={club.members}/>
    </section> -->

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
							<span class="text-overflow text text-sm font-medium text-gray-800"
								>{user.firstName} {user.lastName}</span
							>
							{#if !manager}
								<Icon
									className="ml-auto"
									name="admin_panel_settings"
									customSize="1.25rem"
									color="gray-600"
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
