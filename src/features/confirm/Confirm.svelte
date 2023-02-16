<script lang="ts">
    import { Backdrop, Button, Icon, } from "@components";
    import { confirmData, submitConfirm } from "./confirm";
    import { enter } from "sveltils/actions";
	import { backInOut } from "svelte/easing";
	import { scale } from "svelte/transition";
</script>

<svelte:window on:enter={() => { if ($confirmData) submitConfirm(true) }} use:enter/>

<Backdrop open={!!$confirmData}>
    <div class="w-full h-full grid place-items-center">
        <div class="raised-card items-center justify-center" transition:scale={{duration: 400, easing: backInOut}}>
            {#if $confirmData.icon}
                <Icon name={$confirmData?.icon} customSize="3.5rem" color="gray-400"/>
            {/if}

            <span class="text-xl font-semibold">{$confirmData?.title}</span>
        
            {#if $confirmData?.message}
                <span class="text text-gray-600">{$confirmData?.message}</span>
            {/if}
        
            <div class="flex gap-1 w-full items-center">
                <Button
                    on:click={() => submitConfirm(false)}
                    style={$confirmData.buttons.cancel.style}
                    fillWidth
                >
                    {#if $confirmData.buttons.cancel.icon}
                        <Icon name={$confirmData?.buttons.cancel.icon} />
                    {/if}
                    {$confirmData.buttons.cancel.text}
                </Button>
        
                <Button
                    on:click={() => submitConfirm(true)}
                    style={$confirmData.buttons.confirm.style}
                    fillWidth
                >
                    {#if $confirmData.buttons.confirm.icon}
                        <Icon name={$confirmData.buttons.confirm.icon} />
                    {/if}
                    {$confirmData.buttons.confirm.text}
                </Button>
            </div>
        </div>
    </div>
</Backdrop>
