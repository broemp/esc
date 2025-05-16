<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import type { PageServerData } from './$types';

	export let data: PageServerData;
	let acts = data.acts;
	let topActs = data.topActs;

	let elemCarousel: HTMLDivElement;
	let currentAct = data.acts[0];
	let actIndex = 0;
	function carouselLeft(): void {
		const x =
			elemCarousel.scrollLeft === 0
				? elemCarousel.clientWidth * elemCarousel.childElementCount // loop
				: elemCarousel.scrollLeft - elemCarousel.clientWidth; // step left
		elemCarousel.scroll(x, 0);
		actIndex = (actIndex - 1) % data.acts.length;
		currentAct = data.acts[actIndex];
	}

	function carouselRight(): void {
		const x =
			elemCarousel.scrollLeft === elemCarousel.scrollWidth - elemCarousel.clientWidth
				? 0 // loop
				: elemCarousel.scrollLeft + elemCarousel.clientWidth; // step right
		elemCarousel.scroll(x, 0);
		actIndex = (actIndex + 1) % data.acts.length;
		currentAct = data.acts[actIndex];
	}

	function visitAct(actID: string): void {
		goto('/vote/' + actID);
	}
</script>

<div class="w-full h-full grid grid-cols-1 content-center justify-items-center">
	<div class="w-full md:w-2/3 mx-auto">
		{#if !$page.data.session}
			<span class="text-center font-extrabold text-5xl pb-4 pt-5 underline underline-offset-8">
				WELCOME
			</span>
			<span class="text-center font-bold text-xl m-4 pb-16">
				Please log in to take part in a watch party vote for this year's Eurovision Song Contest -
				create your own group or join an existing one!
			</span>
			<a href="/auth/signIn" class="btn btn-md bg-primary-500 w-48">Join Now</a>
		{:else}
			{#if data.groups.length === 0}
				<span class="text-center font-bold text-xl m-4">
					Please become a member of a group to vote!
				</span>
				<div class="w-full max-w-2xl mx-auto">
					<p class="text-center text-lg mb-4">Join one of these popular groups:</p>
					<div class="grid grid-cols-2 gap-4 mb-6">
						{#each data.publicGroups.slice(0, 4) as group}
							<a href="/group/{group.id}">
								<div class="card variant-form-material p-4 font-bold grid justify-items-center">
									<div>{group.name}</div>
									<div class="text-sm text-gray-400">{group.memberCount} members</div>
								</div>
							</a>
						{/each}
					</div>
					<div class="flex gap-4 justify-center">
						<a href="/group/new" class="btn bg-primary-500 w-48">Create New Group</a>
						<a href="/group/join" class="btn bg-primary-500 w-48">View All Groups</a>
					</div>
				</div>
			{/if}
		
			<div class="card p-4 grid grid-cols-[auto_1fr_auto] gap-4 items-center">
				<!-- Button: Left -->
				<button type="button" class="btn-icon variant-filled" on:click={carouselLeft}>
					<i class="fa-solid fa-arrow-left" />
				</button>
				<!-- Full Images -->
				<div
					bind:this={elemCarousel}
					class="snap-x snap-mandatory scroll-smooth flex overflow-x-auto"
				>
					{#each acts as act}
						<img
							class="snap-center object-contain w-[1024px] max-h-32 rounded-container-token"
							src={act.act.picture_url}
							alt={act.act.id}
							on:click={() => visitAct(act.act.id)}
							loading="lazy"
						/>
					{/each}
				</div>
				<!-- Button: Right -->
				<button type="button" class="btn-icon variant-filled" on:click={carouselRight}>
					<i class="fa-solid fa-arrow-right" />
				</button>
			</div>
			<!-- Info Field -->
			<div class="w-full">
				<section class="card variant-filled-secondary flex mt-2 mx-2 p-4">
					<span class="text-center">Swipe through the carousel and click on the artist to vote!</span>
				</section>
			</div>
			{#if data.groups.length > 0}
				<p class="text-center pt-2 text-2xl underline decoration-2 underline-offset-2">Your Groups</p>
				<div class="m-4">
					<div class="grid grid-cols-2 gap-4">
						{#each data.groups as group, i}
							<a href="/group/{group.group?.id}" class={i === data.groups.length - 1 && data.groups.length % 2 === 1 ? 'col-span-2' : ''}>
								<div class="card variant-form-material p-4 font-bold grid justify-items-center">
									{group.group?.name}
								</div>
							</a>
						{/each}
					</div>
				</div>
				<div class="flex p-4 gap-4">
					<a href="/group/new" class="btn bg-primary-500 w-1/2">Create new Group</a>
					<a href="/group/join" class="btn bg-primary-500 w-1/2">Join Group</a>
				</div>
			{/if}
			<p class="text-center pt-2 text-2xl underline decoration-2 underline-offset-2">Top Public Groups</p>
			{#if data.publicGroups.length > 0}
				<div class="m-4">
					<div class="grid grid-cols-2 gap-4">
						{#each data.publicGroups as group}
							<a href="/group/{group.id}">
								<div class="card variant-form-material p-4 font-bold grid justify-items-center">
									<div>{group.name}</div>
									<div class="text-sm text-gray-400">{group.memberCount} members</div>
								</div>
							</a>
						{/each}
					</div>
				</div>
			{:else}
				<div class="text-center text-gray-300 m-4">
					No public groups available
				</div>
			{/if}
			<p class="text-center pt-2 text-2xl underline decoration-2 underline-offset-2">Top List</p>
			<div class="mt-2 mb-16 w-full">
				{#each topActs as act}
					<a href="/vote/{act.actID}">
						<div class="card p-4 mx-2 mb-2 variant-filled-primary">
							<div class="grid grid-cols-3 items-center">
								<div>
									<img
										src={act.countryImage}
										class="aspect-square object-contain w-12 h-12"
										alt={act.artist}
									/>
								</div>
								<p>
									<span class="font-bold">{act.artist}</span> <br />
									{act.title}
								</p>
								<p class="text-end">
									{act.score}
								</p>
							</div>
						</div>
					</a>
				{/each}
			</div>
		{/if}
	</div>
</div>
