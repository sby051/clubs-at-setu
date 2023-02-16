<script lang="ts">
	import { fly } from "svelte/transition";
	import { createEventDispatcher } from "svelte";
	import { escape, clickoutside } from "sveltils/actions";
	import { IconButton, Backdrop } from ".";

	const dispatch = createEventDispatcher();

	export let open = false;
	export let title: string | undefined = undefined;

	const handleClose = () => {
		open = false;
		dispatch("close");
	};
</script>

<Backdrop bind:open>
	<aside
		class="absolute top-0 right-0 z-50 flex h-full w-1/4 flex-col gap-3 bg-offwhite p-5 shadow-xl"
		transition:fly={{ x: 500, duration: 200 }}
		use:clickoutside
		on:clickoutside={handleClose}
		use:escape
	>
		{#if title}
			<header class="flex items-center justify-between">
				<span class="text-xl font-semibold">{title}</span>
				<IconButton icon="close" size="2xl" on:click={handleClose} />
			</header>
		{/if}

		<slot />

		{#if $$slots.footerButtons}
			<footer class="mt-auto flex w-full gap-2">
				<slot name="footerButtons" />
			</footer>
		{/if}
	</aside>
</Backdrop>
