<script lang="ts">
	import { Icon, Tag } from "@components";
	import type { Club } from "@types";
	import user from "@stores/user";

	export let club: Club;

	$: isMember = $user.clubs.includes(club.id);
</script>

<a
	href={club.id}
	class="border-1 relative flex h-fit w-full cursor-pointer flex-col gap-6 rounded-xl border-gray-300 p-6 transition hover:bg-white active:scale-[0.99] lg:flex-row"
>
	<img
		src={club.photo}
		class="aspect-video w-full flex-shrink-0 flex-grow-0 rounded-lg shadow-md lg:w-64"
		alt={club.name}
	/>

	<div class="flex w-full flex-col gap-2">
		<span class="text text-overflow text-2xl font-bold">{club.name}</span>
		<span class="text text-sm text-gray-600">
			{club.description}
		</span>
	</div>

	<div class="flex gap-2 sm:mt-auto sm:justify-end lg:absolute lg:bottom-6 lg:right-6">
		<Tag outlined>
			<Icon name="people" outlined />
			{club.members.length}
			members
		</Tag>
		{#if isMember}
			<Tag className="bg-violet-500 text-offwhite">
				<Icon name="check" />
				Joined
			</Tag>
		{:else}
			<Tag color="orange-400" className="bg-green-500 text-offwhitewhite">
				<Icon name="payments" />
				€{club.fee}/year
			</Tag>
		{/if}
	</div>
</a>
