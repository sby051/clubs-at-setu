<script lang="ts">
	import { Icon, IconButton, Tag } from "@components";
	import type { User } from "@types";
    import { default as u } from "@stores/user";
	import Avatar from "../Avatar.svelte";
    import { confirm } from "@features/confirm";

    export let user: User;

    const handleDelete = async () => {
        await confirm(`Delete user '${user.firstName} ${user.lastName}'?`, {
            icon: "delete",
            message: "Are you sure you want to delete this user? This action cannot be undone.",
            buttons: {
                cancel: {
                    text: "Nevermind",
                    style: "outlined:normal",
                },
                confirm: {
                    text: "Delete",
                    icon: "delete",
                    style: "danger",
                },
            }
        });
    }
</script>

<div class="transition items-center w-full px-4 py-3 flex gap-2 hover:bg-gray-200 rounded-md">
    <Avatar disabled src={user.photo} size="32px"/>

    <span class="text text-lg font-semibold">{user.firstName} {user.lastName}</span>

    {#if user.id === $u?.id}
        <Tag>
            <Icon name="star" />
            You
        </Tag>
    {/if}

    {#if user.admin}
        <Tag color="orange-400" textColor="offwhite">
            <Icon name="shield" />
            Admin
        </Tag>
    {/if}

    <Tag outlined color="gray-300">
        <Icon name="mail" />
        {user.email}
    </Tag>

    <Tag outlined color="gray-300">
        <Icon name="tag" />
        {user.id}
    </Tag>

    <Tag outlined color="gray-300">
        <Icon name="people" />
        {user.clubs.length}
    </Tag>

    <div class="ml-auto flex gap-1 items-center">
        <IconButton icon="edit" outlined size="xl"/>
        <IconButton icon="delete" outlined size="xl" on:click={handleDelete}/>
    </div>
</div>