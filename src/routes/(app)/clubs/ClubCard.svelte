<script lang="ts">
	import { Icon, Tag } from "@components";
	import type { Club } from "@types";

	export let club: Club;
</script>

<a
	href="/clubs/{club.id}"
	class="border-1 max-w-96 flex h-[25rem] cursor-pointer flex-col gap-4 rounded-md border-gray-300 p-4 transition hover:bg-white active:scale-[0.99]"
>
	<img src={club.photo} class="aspect-video w-96 rounded-lg shadow-md" alt={club.name} />

	<div class="flex flex-col gap-2">
		<div class="flex items-center gap-2">
			<span class="text text-lg font-bold">{club.name}</span>
			{#each club.categories as category}
				<Tag outlined>
					{category}
				</Tag>
			{/each}
		</div>
		<span class="text text-sm">
			{club.description}
		</span>
	</div>

	<div class="mt-auto flex w-full items-center justify-end gap-1">
		<Tag color="gray-200">
			<Icon name="people" outlined />
			{club.members.length}
		</Tag>
		<Tag color="green-400">
			<Icon name="payments" />
			€{club.fee}/year
		</Tag>
	</div>
</a>
