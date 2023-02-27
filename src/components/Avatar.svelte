<script lang="ts">
	import { getFileURL } from "@fb/storage";
	import { onMount } from "svelte";

	export let size = "36px";
	export let src: string;
	export let disabled = false;

	onMount(async () => {
		src = await getFileURL(src);
	})
</script>

<button {disabled} style="--src: url({src}); --size: {size}" on:click on:mouseenter on:mouseleave class="avatar" />

<style>
	.avatar {
		background-image: var(--src);
		background-size: cover;
		background-position: center;
		background-repeat: no-repeat;
		border-radius: 50%;
		width: var(--size);
		height: var(--size);
	}
</style>
