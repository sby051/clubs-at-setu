<script lang="ts">
	import { goto } from "$app/navigation";
	import { signIn } from "@fb/auth";
	import { TextInput, PasswordInput, Button } from "@components";
	import type { PageData } from "./$types";
	import { enter } from "sveltils/actions";
	import { windowTitle } from "@stores/globals";

	export let data: PageData;

	let loading = false;

	const handleSubmit = async (): Promise<void> => {
		loading = true;

		const email = data.email.includes("@itcarlow.ie") ? data.email : data.email + "@itcarlow.ie";

		const result = await signIn(email, data.password);
		loading = false;

		if (!result) {
			alert("Incorrect email or password");
			data.password = "";
			return;
		}

		await goto("/");
	};

	$windowTitle = "Sign In";
</script>

<span class="text text-2xl font-bold">Sign In</span>

<form class="raised-card w-96" on:submit|preventDefault={handleSubmit} use:enter on:enter={handleSubmit}>
	<TextInput required bind:value={data.email} label="Email or Student ID" placeholder="C00xxxxxx(@itcarlow.ie)" />
	<PasswordInput
		bind:value={data.password}
		placeholder="su!perSecure*pAss!12"
		label="Password"
		autofocus={!!data.email}
	/>
	<Button style="primary" type="submit" {loading}>Sign In</Button>
	<a class="link ml-auto mr-auto" href="/password/reset">Forgot your password?</a>
</form>

<a class="link" href="/sign/up">Don't have an account?</a>
