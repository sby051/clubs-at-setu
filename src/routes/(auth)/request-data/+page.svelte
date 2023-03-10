<script lang="ts">
	import { requestUserData } from "@fb/auth";
	import user from "@stores/user";
	import { Button, Icon, CodeBlock } from "@components";
	import { windowTitle } from "@stores/globals";

	const handleDownload = (data: any, fileName: string) => {
		const element = document.createElement("a");
		const file = new Blob([JSON.stringify(data, null, 4)], { type: "application/json" });
		element.href = URL.createObjectURL(file);
		element.download = fileName;
		document.body.appendChild(element);
		element.click();
		element.remove();
	};

	$windowTitle = "Request Data";
</script>

<span class="text-xl font-bold">Request your data</span>

{#await requestUserData($user.id)}
	<p class="text-gray-500">Collecting...</p>
{:then data}
	<div class="raised-card max-h-[80vh] max-w-[50vw] overflow-y-auto overflow-x-hidden">
		<span class="text-xl font-bold">User data</span>
		<span class="text text-sm text-gray-500">
			This is the data we have on you. You can download it by clicking the button below. We don't store anything
			else, so if you don't see something here, it's because we don't have it.
		</span>

		<CodeBlock language="json" code={JSON.stringify(data, null, 2)} header="User data" />
	</div>

	<Button
		style="primary"
		on:click={() =>
			handleDownload(
				data,
				`${$user.firstName}_${$user.lastName}_${
					$user.id
				}_Clubs_At_SETU_User_Data_${new Date().toDateString()}.json`
			)}
	>
		<Icon name="download" />
		Download your data
	</Button>
{:catch error}
	<p class="text-red-500">Error: {error.message}</p>
{/await}
