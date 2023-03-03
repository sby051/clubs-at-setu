<script lang="ts">
	import { goto } from "$app/navigation";
	import { Button, Icon } from "@components";
	import { authed } from "@stores/user";
	import { onMount } from "svelte";

	onMount(async () => {
		// if ($authed === true) await goto("/");
	});
</script>

<div class="flex-center-column relative h-screen gap-4">
	<span class="absolute top-3 left-3 flex">
		<Button href="/" size="sm" style="outlined:normal">
			<Icon name="keyboard_backspace" />
			Go back
		</Button>
	</span>
	<slot />
</div>
