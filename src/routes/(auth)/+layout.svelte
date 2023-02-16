<script lang="ts">
	import { goto } from "$app/navigation";
	import { Button, Icon } from "@components";
	import { authed } from "@stores/user";
	import { onMount } from "svelte";

    onMount(() => {
        if($authed) goto("/");
    });
</script>

<div class="relative h-full flex-center-column gap-4">
    <span class="absolute top-3 left-3 flex">
        <Button href="/" size="sm" style="outlined:normal">
            <Icon name="keyboard_backspace"/>
            Go back
        </Button>
    </span>
    <slot/>
</div>