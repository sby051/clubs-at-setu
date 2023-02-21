<script lang="ts">
	import { Button, Icon, IconButton, Tag } from "@components";
    import type { PageData } from "./$types";
    import user from "@stores/user";
	import { getDocument, updateDocument } from "@fb/fsdb";
	import Avatar from "@routes/(app)/Avatar.svelte";
    import { confirm } from "@features/confirm";
    import { invalidateAll } from "$app/navigation";
	import { slide } from "svelte/transition";
	import type { Announcement } from "@types";

    export let data: PageData;
    
    const { club } = data;

    const announcement = {
        title: "",
        content: "",
    }

    const handleJoin = async () => {
        if(isMember) return;
        $user = {
            ...$user,
            clubs: [...$user.clubs, club.id]
        }
        await updateDocument("clubs", club.id, {
            members: [...club.members, $user.id]
        })

        await invalidateAll();
    }

    const handleLeave = async () => {
        const confirmed = await confirm("Are you sure you want to leave this club?", {
            message: "You will not be refunded any fees you have paid for this club.",
            icon: "warning",
        })

        if(!isMember || !confirmed) return;

        $user = {
            ...$user,
            clubs: $user.clubs.filter(id => id !== club.id)
        }

        await updateDocument("clubs", club.id, {
            members: club.members.filter(id => id !== $user.id)
        })

        await invalidateAll();
    }

    const handleAnnouncement = async () => {
        if(!announcement.title) return;

        const fullAnnouncement: Announcement = {
            ...announcement,
            date: Date.now(),
            author: $user.id,
        }

        posting = true;
        await updateDocument("clubs", club.id, {
            announcements: [
                ...club.announcements,
                fullAnnouncement
            ]
        })
        posting = false;
        announcement.title = "";
        announcement.content = "";
        await invalidateAll();
    }

    let posting = false;

    $: isMember = $user.clubs.includes(club.id);
    $: isManager = club.managers.includes($user.id) || $user?.admin;
</script>

<div class="flex border-b-[1px] border-b-gray-300 gap-8 p-10 items-center" aria-label="Club header">
    <img alt={club.name} src={club.photo} class="w-64 aspect-video rounded-lg shadow-md" />
    <div class="flex flex-col gap-4 w-full">
        <div class="flex gap-1 items-center w-full">
            <span class="text-4xl font-extrabold w-full text-overflow">{club.name}</span>
            <div class="w-full justify-end items-center flex gap-1">
                {#if isManager}
                    <Button style="outlined:primary">
                        <Icon name="edit" />
                        Edit
                    </Button>
                {/if}
                {#if !isMember}
                    <Button style="primary" className="rounded-full" on:click={handleJoin}>
                        <Icon name="group_add" />
                        Join for {!!club.fee ? "Free" : `€${club.fee}/year`}
                    </Button>
                {:else}
                    <Button style="danger" className="rounded-full" on:click={handleLeave}>
                        <Icon name="group_remove" />
                        Leave
                    </Button>
                {/if}
            </div>
        </div>

        <span class="text-gray-500">{club.description}</span>
        
        <div class="flex gap-1 items-center">
            <Tag>
                <Icon name="payments"/>
                €{club.fee ? club.fee : "Free"}/year
            </Tag>
            <Tag outlined>
                <Icon name="person"/>
                {club.members.length} member{club.members.length === 1 ? "" : "s"}
            </Tag>
            {#each club.categories as category}
                <Tag outlined>
                    {category}
                </Tag>
            {/each}
        </div>
    </div>
</div>

<div class="flex">
    <div class="relative flex flex-col gap-4 p-8 w-full border-r-[1px] border-r-gray-300" aria-label="Announcements"> 
        <span class="text text-xl font-semibold">Announcements</span>

        {#if !isMember}
            <div class="w-full h-full flex-center-column gap-2">
                <Icon name="warning" customSize="6rem" color="gray-400" />
                <span class="text text-md text-gray-500">You must be a member to view announcements.</span>
            </div>
        {:else}
            {#if isManager}
                <form on:submit|preventDefault={handleAnnouncement} class="transition flex flex-col gap-3 w-full px-4 py-3 border-1 border-gray-300 rounded-md hover:bg-white focus-within:bg-white">
                    {#if posting}   
                        Posting...
                    {:else}
                        <div class="flex gap-2 w-full items-center">
                            <Icon name="campaign" customSize="1.5rem" color="gray-500"/>
                            <input maxlength="50" type="text" bind:value={announcement.title} class="focus:outline-none bg-transparent w-full text-lg text-overflow font-medium" placeholder="Say something to your club..">
                            {#if announcement.title}
                                <IconButton icon="close" on:click={() => announcement.title = ""} />
                            {/if}
                        </div>
                        {#if announcement.title}
                            <div class="w-full flex flex-col gap-3" transition:slide>
                                <textarea maxlength="256" bind:value={announcement.content} class="h-64 resize-none focus:outline-none bg-transparent w-full" placeholder="Say something to your club.."></textarea>
                                <Button style="primary" className="w-fit ml-auto" type="submit">
                                    <Icon name="send"/>
                                    Make announcement
                                </Button>
                            </div>
                        {/if}   
                    {/if}                         
                </form>
            {/if}

            <ul class="flex flex-col gap-2 pb-8">
                {#if club.announcements.length > 0}
                    {#each club.announcements as announcement}
                        {#await getDocument("users", announcement.author)}
                            <li class="h-16 w-full rounded-md animate-pulse bg-gray-300"></li>
                        {:then user}
                            <li class="flex flex-col gap-2 p-4 hover:bg-white border-1 border-gray-300 rounded-md transition">
                                <span class="flex gap-2 items-center">
                                    <Avatar src={user.photo} size="32px" />
                                    <div class="flex flex-col">
                                        <span class="text text-sm font-medium text-gray-800">{user.firstName} {user.lastName}</span>
                                        <span class="text text-xs font-medium text-gray-500">{user.studentId}</span>
                                    </div>
                                    <span class="text ml-auto text-xs font-medium text-gray-500">{new Date(announcement.date * 1000).toLocaleDateString()}</span>
                                </span>
                                <span class="text text-lg font-semibold text-gray-800">{announcement.title}</span>
                                <span class="text text-sm text-gray-500">{announcement.content}</span>
                            </li>
                        {:catch}
                            Error loading announcement author
                        {/await}
                    {/each}
                {:else}
                    <div class="flex flex-col gap-2 p-4 border-1 border-gray-300 rounded-md">
                        <span class="text text-sm text-gray-500">No announcements yet.</span>
                    </div>
                {/if}
            </ul>
        {/if}
    </div>

    <div class="sticky top-0 h-full flex flex-col gap-4 p-8 min-w-[15rem]">
        <span class="text text-xl font-semibold">Members</span>

        <ul class="flex flex-col gap-1 pb-8">
            {#if club.members.length > 0}
                {#each club.members as member}
                    {#await getDocument("users", member)}
                        <li class="h-8 w-full bg-gray-200 rounded-md animate-pulse"></li>
                    {:then user}
                        <li class="flex gap-2 p-2 items-center hover:bg-gray-200 rounded-md transition">
                            <Avatar src={user.photo} size="28px" />
                            <span class="text-overflow text text-sm font-medium text-gray-800">{user.firstName} {user.lastName}</span>
                        </li>
                    {/await}
                {/each}
            {:else}
                <li class="flex flex-col gap-2 p-4 border-1 border-gray-300 rounded-md">
                    <span class="text text-sm text-gray-500">No members yet.</span>
                </li>
            {/if}
        </ul>
    </div>
</div>