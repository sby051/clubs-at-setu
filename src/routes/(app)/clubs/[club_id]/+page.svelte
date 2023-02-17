<script lang="ts">
	import { Button, Icon, IconButton, Tag } from "@components";
    import type { PageData } from "./$types";
    import user from "@stores/user";
	import { ChatRoom } from "@features/chat";
	import { getDocument, updateDocument } from "@fb/fsdb";
	import Avatar from "@routes/(app)/Avatar.svelte";
    import { growShrink } from "sveltils/transitions";
    import { confirm } from "@features/confirm";
    import { invalidate } from "$app/navigation";
	import { page } from "$app/stores";

    export let data: PageData;
    
    const { club } = data;

    const handleJoin = async () => {
        if(isMember) return;
        $user = {
            ...$user,
            clubs: [...$user.clubs, club.id]
        }
        await updateDocument("clubs", club.id, {
            members: [...club.members, $user.id]
        })

        await invalidate($page.url.pathname);
    }

    const handleLeave = async () => {
        const confirmed = await confirm("Are you sure you want to leave this club?")

        if(!isMember || !confirmed) return;

        $user = {
            ...$user,
            clubs: $user.clubs.filter(id => id !== club.id)
        }

        await updateDocument("clubs", club.id, {
            members: club.members.filter(id => id !== $user.id)
        })

        await invalidate($page.url.pathname);
    }

    let membersVisible = true;
    let chatVisible = true;

    const showHideMembers = () => membersVisible = !membersVisible;
    const showHideChat = () => chatVisible = !chatVisible;

    $: isMember = $user.clubs.includes(club.id);
    $: isManager = club.managers.includes($user.id) || $user.admin;
</script>

<div class="flex flex-col h-full w-full">

    <div class={`flex gap-8 p-10 items-center bg-opacity-10 bg-[url(${club.photo})] bg-cover bg-center`}>
        <img src={club.photo} class="w-64 aspect-video rounded-lg shadow-md" />
        <div class="flex flex-col gap-4 w-full">
            <div class="flex gap-1 items-center w-full">
                <h1 class="text-4xl font-extrabold w-full text-overflow">{club.name}</h1>
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
                            Join
                        </Button>
                    {:else}
                        <Button style="danger" className="rounded-full" on:click={handleLeave}>
                            <Icon name="group_remove" />
                            Leave
                        </Button>
                    {/if}
                </div>
            </div>

            <p class="text-gray-500">{club.description}</p>
            
            <div class="flex gap-1 items-center">
                {#each club.categories as category}
                    <Tag outlined>
                        {category}
                    </Tag>
                {/each}
            </div>
        </div>
    </div>

    <span class="separator-h"/>

    <div class="flex h-full gap-1 overflow-hidden">    
        <div class="relative flex flex-col gap-0.5 p-8 w-full">
            <h2 class="text text-xl font-semibold mb-6">Announcements</h2>
            {#if !isMember}
                <div class="absolute top-0 left-0 w-full h-full flex-center-column gap-2 bg-offwhite bg-opacity-10 backdrop-blur-md z-20">
                    <Icon name="warning" customSize="6rem" color="gray-400" />
                    <span class="text text-md text-gray-500">You must be a member to view announcements.</span>
                </div>
            {/if}
            {#if club.announcements.length > 0}
                {#each club.announcements as announcement}
                    <div class="flex flex-col gap-2 p-4 hover:bg-gray-200 border-1 border-gray-300 rounded-md transition">
                        <div class="flex gap-2 items-center justify-between">
                            <h3 class="text text-lg font-semibold text-gray-800">{announcement.title}</h3>
                            <span class="text text-xs font-medium text-gray-500">{new Date(announcement.date * 1000).toLocaleDateString()}</span>
                        </div>
                        <p class="text text-sm text-gray-500">{announcement.content}</p>
                    </div>
                {/each}
            {:else}
                <div class="flex flex-col gap-2 p-4 border-1 border-gray-300 rounded-md">
                    <p class="text text-sm text-gray-500">No announcements yet.</p>
                </div>
            {/if}
        </div>

        <span class="separator-v"/>

        {#if isMember}
            {#if chatVisible}
                <div transition:growShrink|local={{duration: 50}} class="flex flex-col gap-6 h-full w-[30rem] flex-shrink-0">
                    <div class="px-8 pt-8 flex w-full justify-between items-center gap-2">
                        <h2 class="text text-xl font-semibold">Chat</h2>
                        <IconButton icon="last_page" size="lg" on:click={showHideChat}/>
                    </div>
                    <ChatRoom id={club.id} members={club.members} moderators={club.managers}/>
                </div>
            {:else}
                <span class="py-8 px-1">
                    <IconButton icon="first_page" size="lg" on:click={showHideChat}/>
                </span>
            {/if}

            <span class="separator-v"/>
        {/if}

        {#if membersVisible}
            <div transition:growShrink|local={{duration: 50}} class="flex flex-col h-full gap-0.5 p-8 w-64 flex-shrink-0 overflow-hidden">
                <div class="flex gap-2 justify-between mb-6 items-center">
                    <h2 class="text text-xl font-semibold">Members</h2>
                    <IconButton icon="last_page" size="lg" on:click={showHideMembers}/>
                </div>
                {#if club.members.length > 0}
                    {#each club.members as member}
                        {#await getDocument("users", member) then user}
                            <div class="transition w-full flex items-center rounded-md hover:bg-gray-300 p-2 gap-2">
                                <Avatar src={user.photo} size="28px"/>
                                <span class="text text-gray-600 font-medium">{user.firstName} {user.lastName}</span>
                            </div>
                        {:catch}
                            <div class="flex flex-col gap-2 p-4 border-1 border-gray-300 rounded-md">
                                <p class="text text-sm text-gray-500">Error loading user.</p>
                            </div>
                        {/await}
                    {/each}
                {:else}
                    <div class="flex flex-col gap-2 p-4 border-1 border-gray-300 rounded-md">
                        <p class="text text-sm text-gray-500">No members yet.</p>
                    </div>
                {/if}
            </div>
        {:else}
            <span class="py-8 px-1">
                <IconButton icon="first_page" size="lg" on:click={showHideMembers}/>
            </span>
        {/if}
    </div>
</div>