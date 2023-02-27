<script lang="ts">
	import { Icon, Tag } from "@components";
	import type { Club } from "@types";
	import user from "@stores/user";

	export let club: Club;

	$: isMember = $user?.clubs.includes(club.id);
</script>

<a
	href="/clubs/{club.id}"
	class="border-1 w-96 flex flex-1 cursor-pointer flex-col gap-4 rounded-xl border-gray-300 p-4 transition hover:bg-white active:scale-[0.99]"
>
	<img src={club.photo} class="aspect-video w-full rounded-lg shadow-md" alt={club.name} />

	<div class="flex flex-col gap-2">
		<div class="flex items-center gap-2">
			<span class="text text-lg font-bold">{club.name}</span>
			{#each club.categories as category}
				<Tag outlined>
					{category}
				</Tag>
			{/each}
		</div>
		<span class="text text-sm text-gray-600">
			{club.description}
		</span>
	</div>

	<div class="mt-auto flex w-full items-center justify-end gap-1">
		<Tag outlined>
			<Icon name="people" outlined />
			{club.members.length}
			members
		</Tag>
		{#if isMember}
			<Tag className="bg-violet-500 text-offwhite">
				<Icon name="check"/>
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
