<script lang="ts">
	import { goto } from "$app/navigation";
    import { login } from "@fb/auth"
	import { TextInput, PasswordInput, Button } from "@components";
	import type { PageData } from "./$types";

    export let data: PageData;

    const handleSubmit = async (): Promise<void> => {
        const result = await login(data.email, data.password)

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
    <TextInput bind:value={data.email} label="Email" placeholder="C00xxxxxx@itcarlow.ie"/>
    <PasswordInput bind:value={data.password} placeholder="su!perSecure*pAss!12" label="Password" autofocus={!!data.email} />
    <Button style="primary" type="submit">Login</Button>
</form>

<a class="link" href="/sign-up">Don't have an account?</a>