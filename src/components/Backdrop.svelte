<script lang="ts">
	import { blur as b } from "svelte/transition";

	export let blur = false;

	export let opacity: string | number = "50%";

	export let open = false;
</script>

{#if open}
	<div class="fixed top-0 left-0 z-50 h-screen w-screen">
		<slot />
	</div>

	<div
		class:backdrop-blur-sm={blur}
		class="fixed top-0 left-0 z-40 h-screen w-screen bg-black"
		style="opacity: {opacity}"
		transition:b={{ duration: 100 }}
	/>
{/if}
