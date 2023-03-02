<script lang="ts">
	import { Icon } from ".";

	export let icon = "";
	export let size = "base";
	export let className: string | undefined = undefined;
	export let href: string | undefined = undefined;
	export let ghost = false;
	export let title = "";
	export let outlined = false;
	export let disabled = false;

	const tagName = href ? "a" : "button";
</script>

<svelte:element
	this={tagName}
	{href}
	{title}
	{disabled}
	on:click
	on:keydown
	type="button"
	class:p-0={ghost}
	class="flex h-fit w-fit items-center justify-center gap-1 rounded-full p-2 transition marker:flex-shrink-0 hover:bg-neutral-100 active:translate-y-[1px] active:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-30 {className}"
>
	{#if $$slots.default}
		<slot/>
	{:else}
		<Icon name={icon} {size} {outlined} />
	{/if}
</svelte:element>
