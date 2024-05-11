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
			<section class="card variant-filled-primary flex mt-2 mx-2 p-4">
				<span class="text-center">Swipe through the carousel and click on the artist to vote!</span>
			</section>
		</div>
		<p class="pt-2 text-2xl underline decoration-2 underline-offset-2">Groups</p>
		<div class="flex p-4 gap-4">
			<a href="/group/new" class="btn bg-secondary-500 w-1/2">Create new Group</a>
			<a href="/group/join" class="btn bg-secondary-500 w-1/2">Join Group</a>
		</div>
		<p class="pt-2 text-2xl underline decoration-2 underline-offset-2">Top List</p>
		<div class="mt-2 mb-16 w-full">
			{#each topActs as act}
				<a href="/vote/{act.actID}">
					<div class="card p-4 mx-2 mb-2 variant-filled-primary">
						<div class="grid grid-cols-3 items-center">
							<div>
								<img
									src={act.countryImage}
									class="aspect-square object-contain w-12 h-12"
									alt={act.countryName}
								/>
							</div>
							<p>
								{act.artist} <br />
								{act.title}
							</p>
							<p class="text-end">
								{act.averagePoints}
							</p>
						</div>
					</div>
				</a>
			{/each}
		</div>
	{/if}
</div>
