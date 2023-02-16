<script lang="ts">
    export let color = "gray-300";
    export let outlined = false;
    export let textColor = "text-gray-500";
</script>

<span class="{outlined ? 'bg-transparent border-1' : `bg-${color}`} w-fit capitalize flex gap-1 items-center text text-xs text-{textColor} px-2 py-1 border-{color} font-medium rounded-full">
    <slot/>
</span>