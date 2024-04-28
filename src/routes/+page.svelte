<script lang="ts">
	import { page } from '$app/stores';
</script>

<div class="w-full h-full grid grid-cols-1 content-center justify-items-center">
	{#if !$page.data.session}
		<span class="text-center font-extrabold text-5xl pb-4 underline underline-offset-8">
			WELCOME
		</span>
		<span class="text-center font-bold text-xl m-4 pb-16">
			Please log in to take part in a watch party vote for this year's Eurovision Song Contest -
			create your own group or join an existing one!
		</span>
		<a href="/auth/signIn" class="btn btn-md variant-ghost w-48">Join Now</a>
	{:else}
		<div>Logged In</div>
		<div class="flex p-4 gap-4">
			<a href="/group/new" class="btn bg-primary-500 w-1/2">Create new Group</a>
			<a href="/group/join" class="btn bg-primary-500 w-1/2">Join Group</a>
		</div>
	{/if}
</div>
