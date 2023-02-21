<script lang="ts">
	import EmojiSelector from "svelte-emoji-selector";
	import { enter } from "sveltils/actions";
	import { createEventDispatcher } from "svelte";
	import { IconButton } from "@components";

	export let value = "";

	const dispatchMessageEvent = createEventDispatcher<MessageEvent>();

	const adjustHeight = (e: any) => {
		e.target.style.height = "auto";
		e.target.style.height = e.target.scrollHeight + "px";
	};

	const handleEmoji = (e: CustomEvent) => (value += e.detail);
	const handleSend = (e: any) => {
		if (value.trim() === "") return;
		dispatchMessageEvent("send", { content: value });
		value = "";
		e.target.style.height = "auto";
	};
</script>

<div class="flex w-full gap-2" aria-label="Chat input">
	<textarea
		class="outlined-input max-h-96 w-full resize-none overflow-y-auto overflow-x-hidden leading-5 transition"
		rows="1"
		placeholder="Type a message..."
		bind:value
		on:input={adjustHeight}
		use:enter
		on:enter={handleSend}
	/>
	<IconButton icon="send" on:click={handleSend} />
	<EmojiSelector on:emoji={handleEmoji} />
</div>
