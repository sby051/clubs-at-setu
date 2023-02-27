<script lang="ts">
	import { goto } from "$app/navigation";
	import { changePassword, signIn, reauthenticate } from "@fb/auth";
	import { TextInput, PasswordInput, Button } from "@components";

	const passwords = {
		old: "",
		new: "",
	};

	const handleSubmit = async () => {
		if (passwords.old === passwords.new) {
			alert("New password cannot be the same as the old password");
			return;
		}

		const reauthenticated = await reauthenticate(passwords.old);

		if (!reauthenticated) {
			alert("Incorrect password");
			return;
		}

		if (!(await changePassword(passwords.new))) {
			alert("Failed to change password");
			return;
		}

		alert("Password changed successfully");
	};
</script>

<span class="text text-2xl font-bold">Change Password</span>

<form class="raised-card w-96" on:submit|preventDefault={handleSubmit}>
	<PasswordInput bind:value={passwords.old} placeholder="su!perSecure*pAss!12" label="Current password" />
	<PasswordInput
		usePattern
		bind:value={passwords.new}
		placeholder="NEW!su!perSecure*pAss!12"
		label="New password"
	/>
	<Button style="primary" type="submit">Change password</Button>
</form>

<a class="link" href="/sign/up">Don't have an account?</a>
