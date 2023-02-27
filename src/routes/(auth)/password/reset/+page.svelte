<script lang="ts">
	import { TextInput, Button, Icon } from "@components";
	import { auth } from "@fb";
	import { sendPasswordResetEmail } from "firebase/auth";

	let email = "";

	let sent = false;

	const handleSubmit = async (): Promise<void> => {
		try {
			await sendPasswordResetEmail(auth, email);
			sent = true;
		} catch (e) {
			alert("Error sending password reset email");
		}
	};
</script>

<span class="text text-2xl font-bold">Reset Password</span>

<form class="raised-card w-96" on:submit|preventDefault={handleSubmit}>
	{#if !sent}
		<TextInput required bind:value={email} label="Email or Student ID" placeholder="C00xxxxxx(@itcarlow.ie)" />
		<Button style="primary" type="submit">
			Send reset link
			<Icon name="send"/>
		</Button>
	{:else}
		<span class="text text-lg font-medium text-gray-600">Password reset email sent</span>
		<span class="text text-sm text-gray-600">Check your email ({email}) for a link to reset your password</span>
	{/if}
</form>
