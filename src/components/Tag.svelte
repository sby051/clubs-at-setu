<script lang="ts">
	export let color = "gray-300";
	export let outlined = false;
	export let textColor = "text-gray-500";
</script>

<span
	class:bg-transparent={outlined}
	class:border-1={outlined}
	class="bg-{color} text-overflow text flex min-w-fit items-center gap-1 text-xs capitalize text-{textColor} px-2 py-1 border-{color} rounded-full font-medium"
>
	<slot />
</span>
