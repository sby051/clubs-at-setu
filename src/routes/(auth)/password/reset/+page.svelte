<script lang="ts">
	import { TextInput, Button, Icon, PasswordInput } from "@components";
	import { auth } from "@fb";
	import { windowTitle } from "@stores/globals";
	import { confirmPasswordReset, sendPasswordResetEmail } from "firebase/auth";

	let email = "";

	let sent = false;

	let code = "";

	let password = "";

	const handleSubmit = async (): Promise<void> => {
		if(!sent) {
			try {
				await sendPasswordResetEmail(auth, email);
				sent = true;
			} catch (e) {
				console.log(e);
				alert("Error sending password reset email");
			}
		}
		else {
			try {
				await confirmPasswordReset(auth, code, password);
				alert("Password reset successfully");
			} catch (e) {
				alert("Error resetting password");
			}
		}
	};

	$windowTitle = "Reset Password";
</script>

<span class="text text-2xl font-bold">Reset Password</span>

<form class="raised-card w-96" on:submit|preventDefault={handleSubmit}>
	{#if !sent}
		<TextInput required bind:value={email} label="Email" placeholder="C00xxxxxx@itcarlow.ie" />
		<Button style="primary" type="submit">
			Send reset link
			<Icon name="send"/>
		</Button>
	{:else}
		<span class="text text-lg font-medium text-gray-600">Password reset email sent</span>
		<span class="text text-sm text-gray-600">Check your email ({email}) for a link to reset your password</span>
		<TextInput bind:value={code} label="Confirmation code" placeholder="123456" />
		<PasswordInput bind:value={password} label="New password"/>
		<Button style="primary" type="submit">
			Reset password
			<Icon name="send"/>
		</Button>
	{/if}
</form>
