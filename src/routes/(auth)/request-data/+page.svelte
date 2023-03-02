<script lang="ts">
	import type { PageData } from "./$types";
    import { requestUserData } from "@fb/auth";
    import user from "@stores/user";
	import { Button, Icon } from "@components";
	import { windowTitle } from "@stores/globals";

    const handleDownload = (data: any, fileName: string) => {
        const element = document.createElement("a");
        const file = new Blob([JSON.stringify(data, null, 4)], { type: "text/plain" });
        element.href = URL.createObjectURL(file);
        element.download = fileName;
        document.body.appendChild(element);
        element.click();
    }

    export let data: PageData;

	$windowTitle = "Request Data";
</script>

<span class="font-bold text-xl">Request your data</span>

{#await requestUserData($user.id)}
    <p class="text-gray-500">Collecting...</p>
{:then data}
    <div class="raised-card max-w-[50vw] max-h-[80vh] overflow-x-hidden overflow-y-auto">
        <span class="font-bold text-xl">User data</span>
        <code class="whitespace-pre-wrap">{JSON.stringify(data.fsdb, null, 4)}</code>

        <span class="font-bold text-xl">Storage</span>
        <a class="link" href={data.storage}>{data.storage}</a>
    </div>

    <Button style="primary" on:click={() => handleDownload(data, `${$user.id}-data-${new Date()}.txt`)}>
        <Icon name="download"/>
        Download your data
    </Button>
{:catch error}
    <p class="text-red-500">Error: {error.message}</p>
{/await}