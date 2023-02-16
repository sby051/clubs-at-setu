<script lang="ts">
	export let size = "36px";
	export let src: string;
	export let disabled = false;
</script>

<button {disabled} style="--src: url({src}); --size: {size}" on:click on:mouseenter on:mouseleave class="avatar">
</button>

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