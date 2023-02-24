<script lang="ts">
	export let scale = 1;
</script>

<div class="loader" style="scale: {scale}">
	<span class="loader__circle"/>
	<span class="loader__circle" />
	<span class="loader__circle" />
	<span class="loader__circle" />
</div>

<style>
	.loader {
		display: inline-block;
		position: relative;
		width: 80px;
		height: 80px;
	}

	.loader__circle {
		position: absolute;
		top: 33px;
		width: 13px;
		height: 13px;
		border-radius: 50%;
		background: black;
		animation-timing-function: cubic-bezier(0, 1, 1, 0);
	}

	.loader:first-child {
		left: 8px;
		animation: loader-circles-1 ease-in-out 0.6s infinite;
	}

	.loader:nth-child(2) {
		left: 8px;
		animation: loader-circles-2 ease-in-out 0.6s infinite;
	}
	
	.loader:nth-child(3) {
		left: 32px;
		animation: loader-circles-3 ease-in-out 0.6s infinite;
	}

	.loader:last-child {
		left: 56px;
		animation: loader-circles-2 ease-in-out 0.6s infinite;
	}
	
	@keyframes loader-circles-1 {
		0% {
			transform: scale(0);
		}
		100% {
			transform: scale(1);
		}
	}

	@keyframes loader-circles-2 {
		0% {
			transform: scale(1);
		}
		100% {
			transform: scale(0);
		}
	}

	@keyframes loader-circles-3 {
		0% {
			transform: translate(0, 0);
		}
		100% {
			transform: translate(24px, 0);
		}
	}
</style>
