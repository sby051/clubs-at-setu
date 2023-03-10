<script lang="ts">
	import { getFileURL } from "@fb/storage";
	import { onMount } from "svelte";

	export let size = "36px";
	export let src: string;
	export let disabled = false;

	let loading = true;

	onMount(async () => {
		src = (await getFileURL(src)) || src;
		loading = false;
	});
</script>

{#if loading}
	<div class="avatar animate-pulse !bg-gray-300" style="--size: {size}" />
{:else}
	<button {disabled} style="--src: url({src}); --size: {size}" on:click on:mouseenter on:mouseleave class="avatar" />
{/if}

<style>
	.avatar {
		background-image: var(--src);
		background-size: cover;
		background-position: center;
		background-repeat: no-repeat;
		border-radius: 50%;
		width: var(--size);
		height: var(--size);
		cursor: initial;
	}
</style>
