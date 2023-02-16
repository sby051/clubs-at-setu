<script lang="ts">
	import { Button, Icon, Tag } from "@components";
    import type { PageData } from "./$types";
    import user from "@stores/user";

    export let data: PageData;
    const { club } = data;

    const handleJoin = () => {
        if(isInClub) return;
        $user = {
            ...$user,
            clubs: [...$user.clubs, club.id]
        }
    }

    const handleLeave = () => {
        if(!isInClub) return;
        $user = {
            ...$user,
            clubs: $user.clubs.filter(id => id !== club.id)
        }
    }

    $: isInClub = $user.clubs.includes(club.id);
    $: isManager = club.managers.includes($user.id) || $user.admin;
</script>

<div class="flex flex-col scroll-y w-full">
    <div class={`flex gap-12 p-12 items-center bg-opacity-10 bg-[url(${club.photo})] bg-cover bg-center`}>
        <img src={club.photo} class="w-64 aspect-video rounded-lg shadow-md" />
        <div class="flex flex-col gap-4">
            <div class="flex gap-3 items-center">
                <h1 class="text-5xl font-extrabold">{club.name}</h1>
                {#if isManager}
                    <Button style="outlined:primary" size="sm">
                        <Icon name="edit" />
                        Edit club
                    </Button>
                {:else}
                    {#if !isInClub}
                        <Button style="primary" className="rounded-full" size="sm" on:click={handleJoin}>
                            <Icon name="add" />
                            Join Club
                        </Button>
                    {:else}
                        <Button style="outlined:danger" className="rounded-full" size="sm" on:click={handleLeave}>
                            <Icon name="close" />
                            Leave club
                        </Button>
                    {/if}
                {/if}
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

    <div class="flex h-full gap-1">
        <div class="flex flex-col gap-6 p-12">
            <h2 class="text text-2xl font-bold">Announcements</h2>
            {#each club.announcements as announcement}
                <div class="flex flex-col gap-2 p-4 hover:bg-gray-200 border-1 border-gray-300 rounded-md transition">
                    <div class="flex gap-2 items-center justify-between">
                        <h3 class="text text-lg font-semibold text-gray-800">{announcement.title}</h3>
                        <span class="text text-xs font-medium text-gray-500">{new Date(announcement.date * 1000).toLocaleDateString()}</span>
                    </div>
                    <p class="text text-sm text-gray-500">{announcement.content}</p>
                </div>
            {/each}
        </div>
    
        <span class="separator-v"/>
    
        <article class="prose w-full p-12">
            <h2>Information</h2>
            <p>Club ID: {club.id}</p>
            <p>Club Owner: {club.managers}</p>
            <p>Club Members: {club.members.length}</p>
        </article>
    </div>
</div>