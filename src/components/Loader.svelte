<script lang="ts">
	import loader from "@assets/loader.gif";

	export let size = "32";
	export let className: string | undefined = undefined; 
</script>

<img src={loader} alt="loader" class="p-1 w-{size} h-{size} rounded-full shadow-md outline-1 outline-dotted outline-gray-300 animate-bounce"/>