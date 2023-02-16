<script lang="ts">
	export let name = "";
	export let size = "auto";
	export let color = "auto";
	export let outlined = false;
	export let className = "";
	export let customSize: string | undefined = undefined;
</script>

<span style="font-size: {customSize ? customSize : ''}" class="text-{color} text-{size} grid aspect-square place-items-center {className}">
	<i class="material-symbols-rounded" class:outlined>{name}</i>
</span>

<style>
	@import "material-symbols";

	.material-symbols-rounded {
		font-variation-settings: "FILL" 1, "wght" 400, "GRAD" 0, "opsz" 48;
		display: inline-block;
		line-height: 1;
		font-size: inherit;
		user-select: none;
	}

	.outlined {
		font-variation-settings: "FILL" 0, "wght" 400, "GRAD" 0, "opsz" 48;
	}
</style>
