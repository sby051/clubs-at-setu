<script lang="ts">
	import { goto } from "$app/navigation";
	import { page } from "$app/stores";
	import { Button, Icon } from "@components";
	import { authed } from "@stores/user";
	import { onMount } from "svelte";

    const ALLOWED_WITH_AUTH = [
        "/change-password"
    ]

    onMount(async () => {
        if($authed === true || ALLOWED_WITH_AUTH.includes($page.url.pathname)) await goto("/");
    });
</script>

<div class="relative h-screen flex-center-column gap-4">
    <span class="absolute top-3 left-3 flex">
        <Button href="/" size="sm" style="outlined:normal">
            <Icon name="keyboard_backspace"/>
            Go back
        </Button>
    </span>
    <slot/>
</div>