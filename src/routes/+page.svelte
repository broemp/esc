<script lang="ts">
	import { page } from '$app/stores';
	import type { PageServerData } from './$types';

	export let data: PageServerData;
	let acts = data.acts;

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
					<a href="/vote/{act.act.id}">
						<img
							class="snap-center w-[1024px] rounded-container-token"
							src={act.act.picture_url}
							alt={act.act.id}
							loading="lazy"
						/></a
					>
				{/each}
			</div>
			<!-- Button: Right -->
			<button type="button" class="btn-icon variant-filled" on:click={carouselRight}>
				<i class="fa-solid fa-arrow-right" />
			</button>
		</div>
		<!-- Info Field -->
		<section class="p-4">
			<span class="grid grid-cols-1">
				<p>
					{currentAct.act.position} <img src={currentAct.country.imageURL} alt="country icon" />
				</p>
				<br />
				<p>{currentAct.act.artist}</p>
				<br />
				<p>{currentAct.act.title}</p>
				<br />
			</span>
		</section>

		<div class="flex p-4 gap-4">
			<a href="/group/new" class="btn bg-primary-500 w-1/2">Create new Group</a>
			<a href="/group/join" class="btn bg-primary-500 w-1/2">Join Group</a>
		</div>
	{/if}
</div>
