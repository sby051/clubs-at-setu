<script lang="ts">
    import { beforeUpdate } from "svelte";
    import { cubicOut } from "svelte/easing";
    import { fly } from "svelte/transition";

    export let direction: "vertical" | "horizontal" = "vertical";
    export let key: number = 0;
    export let speed = 1;
    export let hugContent = false;
    export let className: string | undefined = undefined;

    const X_OR_Y = direction === "vertical" ? "y" : "x";
    const DIRECTION_1 = -100;
    const DIRECTION_2 = DIRECTION_1 * -1.3;

    let previousKey = 0;

    beforeUpdate(async () => previousKey = key);
    $: changeDirection = previousKey > key;

    const transitionParams = {
        in: {
            delay: 80 / speed,
            duration: 700 / speed,
            easing: cubicOut
        },
        out: {
            duration: 400 / speed,
            easing: cubicOut
        }
    };
    $: transitionParams.in[X_OR_Y] = changeDirection ? DIRECTION_1 : DIRECTION_2;
    $: transitionParams.out[X_OR_Y] = changeDirection ? DIRECTION_2 : DIRECTION_1;
</script>

{#key key}
    <div class="relative w-full {className}" class:h-fit={hugContent}>
        <div
            class="absolute w-full h-full"
            in:fly|local={transitionParams.in}
            out:fly|local={transitionParams.out}
        >
            <slot/>
        </div>
    </div>
{/key}