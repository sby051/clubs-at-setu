<script lang="ts">
	import { Icon, Tag } from "@components";
	import type { Club } from "@types";
	import user from "@stores/user";

	export let club: Club;

	$: isMember = $user.clubs.includes(club.id);
</script>

<a
	href="/clubs/{club.id}"
	class="relative border-1 flex lg:flex-row flex-col w-full h-fit cursor-pointer gap-6 rounded-xl border-gray-300 p-6 transition hover:bg-white active:scale-[0.99]"
>
	<img src={club.photo} class="aspect-video lg:w-64 w-full flex-grow-0 flex-shrink-0 rounded-lg shadow-md" alt={club.name} />

	<div class="flex flex-col gap-2 w-full">
		<span class="text text-2xl text-overflow font-bold">{club.name}</span>
		<span class="text text-sm text-gray-600">
			{club.description}
		</span>
	</div>

	<div class="lg:absolute lg:bottom-6 lg:right-6 flex gap-2 sm:mt-auto sm:justify-end">
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
