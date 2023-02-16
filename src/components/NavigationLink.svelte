<script lang="ts">
	import { Icon } from ".";

	export let title: string;
	export let icon: string | undefined = undefined;
	export let href: string | undefined = undefined;
	export let active = false;
	export let sidebarOpen = false;

	const TAG = href ? "a" : "button";
</script>

<svelte:element
	this={TAG}
	{title}
	{href}
	on:click
	on:keydown
	class="transition flex w-full items-center gap-3 rounded-md p-3 text-sm [&:not(.bg-violet-500)]:hover:bg-gray-200"
	class:bg-violet-500={active}
	class:text-white={active}
	class:shadow-md={active}
>
	{#if $$slots.default}
		<slot/>
	{:else}
		<Icon name={icon} size="xl" outlined={!active} />
	{/if}
	{#if sidebarOpen}
		<p class="text text-overflow capitalize" class:font-medium={active}>
			{title}
		</p>
	{/if}
</svelte:element>
