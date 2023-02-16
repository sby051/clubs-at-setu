<script lang="ts">
	import { goto } from "$app/navigation";
    import { changePassword, login, reauthenticate } from "@fb/auth"
	import { TextInput, PasswordInput, Button } from "@components";

    const data = {
        oldPassword: "",
        newPassword: ""
    }

    const handleSubmit = async () => {
        if(data.oldPassword === data.newPassword) {
            alert("New password cannot be the same as the old password");
            return;
        }

        const reauthenticated = await reauthenticate(data.oldPassword);

        if(!reauthenticated) {
            alert("Incorrect password");
            return;
        }

        if(!await changePassword(data.newPassword)) {
            alert("Failed to change password");
            return;
        }

        alert("Password changed successfully");
    }
</script>

<span class="text text-2xl font-bold">Change Password</span>

<form class="w-96 raised-card" on:submit|preventDefault={handleSubmit}>
    <PasswordInput bind:value={data.oldPassword} placeholder="su!perSecure*pAss!12" label="Current password" />
    <PasswordInput usePattern bind:value={data.newPassword} placeholder="NEW!su!perSecure*pAss!12" label="New password" />
    <Button style="primary" type="submit">Change password</Button>
</form>

<a class="link" href="/sign-up">Don't have an account?</a>