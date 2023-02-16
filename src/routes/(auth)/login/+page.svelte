<script lang="ts">
	import { goto } from "$app/navigation";
    import { login } from "@fb/auth"
	import { TextInput, PasswordInput, Button } from "@components";
	import type { PageData } from "./$types";

    export let data: PageData;

    let loading = false;

    const handleSubmit = async (): Promise<void> => {
        loading = true;

        const email = data.email.includes("@itcarlow.ie") ? data.email : data.email + "@itcarlow.ie";

        const result = await login(email, data.password)
        loading = false;

        if(!result) {
            alert("Incorrect email or password");
            data.password = "";
            return;
        }

        await goto("/");
    };
</script>

<span class="text text-2xl font-bold">Login</span>

<form class="w-96 raised-card" on:submit|preventDefault={handleSubmit}>
    <TextInput required bind:value={data.email} label="Email or Student ID" placeholder="C00xxxxxx(@itcarlow.ie)"/>
    <PasswordInput bind:value={data.password} placeholder="su!perSecure*pAss!12" label="Password" autofocus={!!data.email} />
    <Button style="primary" type="submit" {loading}>Login</Button>
    <a class="link ml-auto mr-auto" href="/reset-password">Forgot your password?</a>
</form>

<a class="link" href="/sign-up">Don't have an account?</a>