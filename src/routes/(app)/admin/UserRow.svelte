<script lang="ts">
	import { Icon, IconButton, Tag } from "@components";
	import type { User } from "@types";
	import Avatar from "../Avatar.svelte";

    export let user: User;
</script>

<div class="transition items-center w-full px-4 py-3 flex gap-2 hover:bg-gray-200 rounded-md">
    <Avatar disabled src={user.photo} size="32px"/>
    <span class="text text-lg font-semibold">{user.firstName} {user.lastName}</span>
    <Tag outlined color="gray-300">
        <Icon name="mail" outlined />
        {user.email}
    </Tag>
    <Tag outlined color="gray-300">
        <Icon name="tag" outlined />
        {user.id}
    </Tag>
    <Tag outlined color="gray-300">
        <Icon name="school" outlined />
        {user.studentId}
    </Tag>
    <Tag outlined color="gray-300">
        <Icon name="people" outlined />
        {user.clubs.length}
    </Tag>
    <div class="ml-auto flex gap-1 items-center">
        <IconButton icon="edit" outlined size="xl"/>
        <IconButton icon="delete" outlined size="xl"/>
    </div>
</div>