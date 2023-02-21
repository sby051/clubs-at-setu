<script lang="ts">
	import { Icon } from ".";

	export let icon: string;
	export let size: string = "base";
	export let className: string | undefined = undefined;
	export let href: string | undefined = undefined;
	export let ghost = false;
	export let title = "";
	export let outlined = false;

	const tagName = href ? "a" : "button";
</script>

<svelte:element
	this={tagName}
	{href}
	{title}
	on:click
	on:keydown
	type="button"
	class:p-0={ghost}
	class="flex w-fit h-fit marker:flex-shrink-0 items-center justify-center gap-1 rounded-full p-2 transition hover:bg-neutral-100 active:translate-y-[1px] active:bg-neutral-50 {className}"
>
	<Icon name={icon} {size} {outlined} />
</svelte:element>
