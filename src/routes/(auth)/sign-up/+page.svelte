<script lang="ts">
	import { isEmailUsed, signUp } from "@fb/auth";
	import { uploadFile } from "@fb/storage"
	import { windowTitle } from "@stores/globals";
	import { Button, TextInput, PasswordInput, Icon, IconButton, ImagePicker, HourglassLoader } from "@components";
	import type { User } from "@types";
	import { REGEXES } from "@utils/constants";
	import { scale, slide } from "svelte/transition";
	import { goto } from "$app/navigation";
	import { blur } from "svelte/transition";

	const STAGE_NAMES = [
		"Details",
		"Confirm",
		"Medical",
		"Finished",
	]

	const enum STAGES {
		DETAILS,
		CONFIRM,
		MEDICAL,
		FINISH,
	};

	let data: User = {
		id: "",
		studentId: "",
		firstName: "",
		lastName: "",
		email: "",
		clubs: [],
		password: "",
		phoneNumber: "",
		medicalInfo: {
			doctor: {
				name: "",
				phoneNumber: "",
			},
			nextOfKin: {
				name: "",
				phoneNumber: "",
			},
			conditions: []
		},
		photo: "",
	};

	const FORM_GROUP_SECTION = "flex flex-col sm:flex-row w-full gap-2";

	const handleBack = () => {
		if (currentStage > 0) currentStage--;
	};

	const handleSubmit = async () => {
		switch(currentStage) {
			case STAGES.DETAILS:
				if(await isEmailUsed(data.email)) {
					const result = confirm("This email is already in use. Do you want to login?");
					if (result) {
						await goto(`/login?email=${data.email}`);
					}
					return;
				}
				
				currentStage++;
				break;
			case STAGES.CONFIRM:
				currentStage++;
				break;
			case STAGES.MEDICAL:
				currentStage++;
				loading = true;
				const signUpResult = await signUp(data);

				if (!signUpResult) {
					alert("An error occurred");
					return;
				}

				loading = false;

				setTimeout(async () => {
					await goto("/");
				}, 1000);
				break;
		}
	};

	const handleRemoveCondition = (i: number): void => {
		data.medicalInfo.conditions.splice(i, 1);
		data = data;
	}

	const handlePicked = async (e: CustomEvent<{ url: string, file: File }>) => {
		const { file } = e.detail;
		const path = `photos/${data.studentId}.${file.type.split("/")[1]}`;
		loading = true;
		await uploadFile(path, file);
		loading = false;
		data.photo = path;
	};

	let currentStage = STAGES.DETAILS;
	let loading = false;
	$: data.email = data.studentId ? `${data.studentId}@itcarlow.ie` : "";
	$: data.studentId = data.studentId?.toUpperCase();

	windowTitle.set("Sign up");
</script>

<span class="text text-2xl font-bold">Sign up</span>

<form class="max-w-lg flex flex-col gap-5 min-w-96 max-h-[80%] h-fit raised-card relative overflow-x-hidden overflow-y-auto" on:submit|preventDefault={handleSubmit}>
	{#if loading}
		<div transition:blur class="absolute w-full h-full top-0 left-0 flex-center-column gap-2 z-50 bg-gray-200 bg-opacity-5 backdrop-blur-lg">
			<p class="text text-sm text-gray-500 text-center">
				Doing important things...
			</p>
		</div>
	{/if}

	<div class="flex w-full items-center gap-0.5">
		{#each STAGE_NAMES as stage, i}
			{@const active = i === currentStage}
			{@const completed = i < currentStage}
			{#if i > 0}
				<Icon name="chevron_right" color="gray-400"/>
			{/if}
			<button class:text-green-600={completed} class:text-violet-500={active} on:click={() => currentStage = i} disabled={i > currentStage} type="button" class="text-gray-400 disabled:text-gray-200 text text-xs font-medium [&:not(:disabled)]:cursor-pointer disabled:cursor-not-allowed [&:not(:disabled)]:hover:text-violet-500">{stage}</button>
			{#if completed}
				<Icon name="check_circle" color="green-600" outlined/>
			{/if}
		{/each}
	</div>

	{#if currentStage === STAGES.DETAILS}
		<section class={FORM_GROUP_SECTION}>
			<TextInput required placeholder="John" label="First name" bind:value={data.firstName} />
			<TextInput required placeholder="Doe" label="Last name" bind:value={data.lastName} />
		</section>

		<section class={FORM_GROUP_SECTION}>
			<TextInput
				required
				bind:value={data.studentId}
				label="Student ID"
				placeholder="C00xxxxxx"
				limit={9}
				pattern={REGEXES.STUDENT_ID}
				invalidMessage="Student ID must be in the format C00xxxxxx"
			/>

			<TextInput
				placeholder="Auto-populated"
				disabled
				bind:value={data.email}
				label="Email"
				caption="This field is auto-populated with your Student ID."
			/>
		</section>

		<section class={FORM_GROUP_SECTION}>
			<TextInput limit={11} placeholder="0871234567" label="Phone number" pattern={REGEXES.PHONE_NUMBER} invalidMessage="Please provide a valid Irish phone number" bind:value={data.phoneNumber} />
			<div class="flex flex-col gap-1">
				<label for="date-of-birth" class="text text-sm font-medium text-gray-600">Date of birth</label>
				<input required bind:value={data.dateOfBirth} id="date-of-birth" type="date" class="outlined-input"/>
			</div>
		</section>
		<PasswordInput usePattern bind:value={data.password} />
	{:else if currentStage === STAGES.CONFIRM}
		<span class="text text-xl font-medium">Confirm your details</span>
		<p class="mt-2 text text-sm text-gray-500">
			An email will be sent to your student email address to confirm your details.
			Please check your email and click the link to confirm your details.
		</p>
	{:else if currentStage === STAGES.MEDICAL}
		<div class="block">
			<span class="text text-xl font-medium">Medical information</span>
			<p class="mt-2 text text-sm text-gray-500">
				Due to the nature of joining a club, we require some medical information.
				This information is used to contact your doctor and next of kin in case of an emergency.
				All data is stored securely and is not shared with any third parties.
				To learn more about how we use your data, please read our <a href="/privacy-policy" class="link text-sm">privacy policy</a>.
			</p>
		</div>

		<section class="flex gap-4 w-full h-72">
			<div class="flex flex-col gap-2 w-full">
				<span class="flex gap-1.5 items-center text font-medium text-gray-500">
					<Icon name="photo" />
					Your photo *
				</span>
	
				<ImagePicker on:picked={handlePicked}/>
			</div>

			<div class="flex flex-col gap-2 w-full">
				<span class="flex gap-1.5 items-center text font-medium text-gray-700">
					<Icon name="conditions" />
					Conditions
				</span>
	
				<span class="text text-xs text-gray-500">Please list any medical conditions you have.</span>

				<div class="h-48 overflow-y-auto flex flex-col gap-1">
					{#each data.medicalInfo.conditions as condition, i}
						<div class="w-full gap-2 flex items-center" transition:slide|local={{duration: 200}}>
							<TextInput bind:value={condition} placeholder="E.g. Asthma" />
							<IconButton icon="close" on:click={() => handleRemoveCondition(i)}/>
						</div>
					{/each}
				</div>

				<Button style="outlined:normal" size="sm" on:click={() => data.medicalInfo.conditions = [...data.medicalInfo.conditions, ""]}>
					<Icon name="add" />
					Add condition
				</Button>
			</div>
		</section>

		<section class="flex flex-col gap-2">

			<span class="flex gap-1.5 items-center text font-medium text-gray-500">
				<Icon name="stethoscope" />
				Your doctor
			</span>
	
			<div class="flex gap-2 w-full items-center">
				<TextInput required placeholder="John Doe" label="Name" bind:value={data.medicalInfo.doctor.name} />
				<TextInput required limit={11} placeholder="0871234567" label="Phone number" pattern={REGEXES.PHONE_NUMBER} invalidMessage="Please provide a valid Irish phone number" bind:value={data.medicalInfo.doctor.phoneNumber} />
			</div>
		</section>

		<section class="flex flex-col gap-2">
			<span class="flex gap-1.5 items-center text font-medium text-gray-500">
				<Icon name="deceased" />
				Your next of kin
			</span>
	
			<div class="flex gap-2 w-full items-center">
				<TextInput required placeholder="John Doe" label="Name" bind:value={data.medicalInfo.nextOfKin.name} />
				<TextInput required limit={11} placeholder="0871234567" label="Phone number" pattern={REGEXES.PHONE_NUMBER} invalidMessage="Please provide a valid Irish phone number" bind:value={data.medicalInfo.nextOfKin.phoneNumber} />
			</div>
		</section>

		<span class="text text-xs text-gray-500">
			By clicking continue, you agree to our <a class="link" href="/terms">Terms of Service</a> and <a class="link" href="/privacy">Privacy Policy</a>.
		</span>
	{:else if currentStage === STAGES.FINISH}
		<div class="flex-center-column h-full gap-2" in:scale>
			<Icon name="check_circle" customSize="8rem" color="green-500" />
			<span class="text text-xl font-medium">You're all set!</span>
			<p class="text text-sm text-gray-500 text-center w-96">
				You've successfully created your account. You can now use Clubs @ SETU!
			</p>
		</div>
	{/if}

	<div class="flex gap-2 w-full items-center">
		{#if currentStage > STAGES.DETAILS && currentStage < STAGES.FINISH}
			<Button fillWidth style="outlined:normal" on:click={handleBack}>
				<Icon name="keyboard_backspace" />
				Back
			</Button>
		{/if}
		{#if currentStage < STAGES.FINISH}
			<Button type="submit" style="primary" fillWidth {loading}>
				Continue
				<Icon name="arrow_forward" />
			</Button>
		{/if}
	</div>
</form>


<a class="link" href="/login">Already have an account?</a>
