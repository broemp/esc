<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import type { PageServerData } from './$types';
	import ActImage from '$lib/components/ActImage.svelte';

	let { data }: { data: PageServerData } = $props();

	let acts = data.acts;
	let topActs = data.topActs;

	let elemCarousel: HTMLDivElement;
	let actIndex = $state(0);
	let currentAct = $state(data.acts[0]);

	let touchStartX = 0;

	function carouselLeft() {
		const x =
			elemCarousel.scrollLeft === 0
				? elemCarousel.clientWidth * elemCarousel.childElementCount
				: elemCarousel.scrollLeft - elemCarousel.clientWidth;
		elemCarousel.scroll(x, 0);
		actIndex = (actIndex - 1 + data.acts.length) % data.acts.length;
		currentAct = data.acts[actIndex];
	}

	function carouselRight() {
		const x =
			elemCarousel.scrollLeft === elemCarousel.scrollWidth - elemCarousel.clientWidth
				? 0
				: elemCarousel.scrollLeft + elemCarousel.clientWidth;
		elemCarousel.scroll(x, 0);
		actIndex = (actIndex + 1) % data.acts.length;
		currentAct = data.acts[actIndex];
	}

	function handleTouchStart(e: TouchEvent) {
		touchStartX = e.touches[0].clientX;
	}

	function handleTouchEnd(e: TouchEvent) {
		const delta = e.changedTouches[0].clientX - touchStartX;
		if (Math.abs(delta) > 40) {
			if (delta < 0) carouselRight();
			else carouselLeft();
		}
	}
</script>

<div class="w-full">
	{#if !$page.data.session}
		<!-- Unauthenticated: hero -->
		<div class="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center">
			<h1 class="text-gradient font-bold leading-none mb-4" style="font-size: clamp(3rem, 12vw, 6rem);">
				ESC 2026
			</h1>
			<p class="text-lg mb-2 font-medium" style="color: oklch(0.70 0 0);">Eurovision Song Contest</p>
			<p class="text-sm mb-10 max-w-xs" style="color: oklch(0.48 0 0);">
				Create groups, vote on acts, and see who has the best taste in Eurovision.
			</p>
			<div class="gradient-line w-24 mb-10 opacity-60"></div>
			<a href="/auth/signIn" class="btn-brand px-8 py-3.5 rounded-xl text-base font-semibold">
				Join the Watch Party
			</a>
			{#if data.publicGroups.length > 0}
				<div class="mt-12 w-full max-w-sm">
					<p class="text-xs uppercase tracking-widest mb-4" style="color: oklch(0.42 0 0);">Popular Groups</p>
					<div class="grid grid-cols-2 gap-2">
						{#each data.publicGroups.slice(0, 4) as group}
							<a href="/group/{group.id}" class="card-esc p-3 block hover:border-[oklch(0.30_0_0)] transition-colors">
								<p class="font-semibold text-sm truncate">{group.name}</p>
								<p class="text-xs mt-0.5" style="color: oklch(0.48 0 0);">{group.memberCount} members</p>
							</a>
						{/each}
					</div>
				</div>
			{/if}
		</div>

	{:else}
		<div class="max-w-lg mx-auto px-4 pt-5 pb-6 space-y-6">

			{#if data.groups.length === 0}
				<!-- No groups: join prompt -->
				<div>
					<p class="text-xs uppercase tracking-widest mb-3" style="color: oklch(0.42 0 0);">Get Started</p>
					<p class="text-sm mb-4" style="color: oklch(0.60 0 0);">
						Join a group to start voting with friends.
					</p>
					<div class="flex gap-3 mb-6">
						<a href="/group/new" class="btn-brand flex-1 h-11 rounded-xl text-sm font-semibold">
							Create Group
						</a>
						<a href="/group/join" class="btn-outline-brand flex-1 h-11 rounded-xl text-sm font-semibold">
							Join Group
						</a>
					</div>
					{#if data.publicGroups.length > 0}
						<p class="text-xs uppercase tracking-widest mb-3" style="color: oklch(0.42 0 0);">Public Groups</p>
						<div class="grid grid-cols-2 gap-2">
							{#each data.publicGroups.slice(0, 4) as group}
								<a href="/group/{group.id}" class="card-esc p-3 block hover:border-[oklch(0.30_0_0)] transition-colors">
									<p class="font-semibold text-sm truncate">{group.name}</p>
									<p class="text-xs mt-0.5" style="color: oklch(0.48 0 0);">{group.memberCount} members</p>
								</a>
							{/each}
						</div>
					{/if}
				</div>
			{/if}

			<!-- Carousel -->
			{#if acts.length > 0}
				<div>
					<div
						class="overflow-hidden rounded-2xl"
						style="border: 1px solid oklch(0.22 0 0); background: oklch(0.07 0 0);"
					>
						<!-- Image with swipe -->
						<div
							bind:this={elemCarousel}
							class="snap-x snap-mandatory scroll-smooth flex overflow-x-hidden"
							style="mask-image: linear-gradient(to top, transparent 0%, black 25%); -webkit-mask-image: linear-gradient(to top, transparent 0%, black 25%);"
							ontouchstart={handleTouchStart}
							ontouchend={handleTouchEnd}
						>
							{#each acts as act}
								<button
									type="button"
									class="snap-center shrink-0 w-full cursor-pointer block leading-none"
									onclick={() => goto('/vote/' + act.act.id)}
									aria-label="Vote for {act.act.artist}"
								>
									<ActImage
										src={act.act.picture_url}
										alt={act.act.artist}
										class="object-cover w-full h-52 block"
										style="background: oklch(0.07 0 0);"
									/>
								</button>
							{/each}
						</div>

						<!-- Info bar below the image -->
						<div class="px-4 py-2.5">
							<div class="flex items-center gap-2 mb-1">
								<img
									src={currentAct.country.imageURL}
									class="w-5 h-5 object-contain rounded-sm shrink-0"
									alt={currentAct.country.name}
								/>
								<span class="text-xs font-medium" style="color: oklch(0.58 0 0);">
									{currentAct.country.name}
								</span>
							</div>
							<p class="text-sm truncate">
								<span class="font-bold">{currentAct.act.artist}</span>
								<span style="color: oklch(0.52 0 0);"> · {currentAct.act.title}</span>
							</p>
						</div>
					</div>
					<p class="text-center text-xs mt-2" style="color: oklch(0.38 0 0);">
						Tap to vote · {actIndex + 1} / {acts.length}
					</p>
				</div>
			{/if}

			{#if data.groups.length > 0}
				<!-- Your Groups -->
				<div>
					<div class="gradient-line mb-4"></div>
					<p class="text-xs uppercase tracking-widest mb-3" style="color: oklch(0.42 0 0);">Your Groups</p>
					<div class="grid grid-cols-2 gap-2">
						{#each data.groups as group, i}
							<a
								href="/group/{group.group?.id}"
								class="card-esc p-4 block font-semibold text-sm hover:border-[oklch(0.30_0_0)] transition-colors {i === data.groups.length - 1 && data.groups.length % 2 === 1 ? 'col-span-2 text-center' : ''}"
							>
								{group.group?.name}
							</a>
						{/each}
					</div>
					<div class="flex gap-3 mt-3">
						<a href="/group/new" class="btn-outline-brand flex-1 h-10 rounded-xl text-sm font-semibold">
							Create
						</a>
						<a href="/group/join" class="btn-brand flex-1 h-10 rounded-xl text-sm font-semibold">
							Join
						</a>
					</div>
				</div>

				<!-- Your Stats -->
				{#if data.userStats}
					<div>
						<div class="gradient-line mb-4"></div>
						<div class="flex items-center justify-between mb-3">
							<p class="text-xs uppercase tracking-widest" style="color: oklch(0.42 0 0);">Your Stats</p>
							<a href="/stats" class="text-xs font-medium" style="color: oklch(0.52 0 0);">Full stats →</a>
						</div>
						<div class="grid grid-cols-2 gap-2">
							<div class="card-esc p-3 text-center">
								<p class="text-gradient font-bold text-xl">{data.userStats.overall?.totalVotes ?? 0}</p>
								<p class="text-xs mt-0.5" style="color: oklch(0.45 0 0);">Votes cast</p>
							</div>
							<div class="card-esc p-3 text-center">
								<p class="text-gradient font-bold text-xl">{data.userStats.overall?.avgScore ?? '—'}</p>
								<p class="text-xs mt-0.5" style="color: oklch(0.45 0 0);">Avg score</p>
							</div>
							{#if data.userStats.byCat.length > 0}
								{@const top = [...data.userStats.byCat].sort((a, b) => Number(b.avgScore) - Number(a.avgScore))[0]}
								{@const bot = [...data.userStats.byCat].sort((a, b) => Number(a.avgScore) - Number(b.avgScore))[0]}
								<div class="card-esc p-3 text-center">
									<p class="font-bold text-sm truncate capitalize" style="color: oklch(0.72 0.18 142);">{(top.categoryName ?? '').replace('_', ' ')}</p>
									<p class="text-xs mt-0.5" style="color: oklch(0.45 0 0);">Favorite cat.</p>
								</div>
								<div class="card-esc p-3 text-center">
									<p class="font-bold text-sm truncate capitalize" style="color: oklch(0.65 0.18 25);">{(bot.categoryName ?? '').replace('_', ' ')}</p>
									<p class="text-xs mt-0.5" style="color: oklch(0.45 0 0);">Toughest on</p>
								</div>
							{/if}
						</div>
					</div>
				{/if}
			{/if}

			<!-- Top Acts -->
			{#if topActs.length > 0}
				<div>
					<div class="gradient-line mb-4"></div>
					<p class="text-xs uppercase tracking-widest mb-3" style="color: oklch(0.42 0 0);">Top Acts</p>
					<div class="space-y-1.5">
						{#each topActs as act}
							<a href="/vote/{act.actID}" class="card-esc p-3 flex items-center gap-3 hover:border-[oklch(0.30_0_0)] transition-colors block">
								<img
									src={act.countryImage}
									class="w-9 h-9 object-contain rounded-sm shrink-0"
									alt={act.artist}
								/>
								<div class="flex-1 min-w-0">
									<p class="font-semibold text-sm truncate">{act.artist}</p>
									<p class="text-xs truncate" style="color: oklch(0.50 0 0);">{act.title}</p>
								</div>
								<span class="text-gradient font-bold text-base shrink-0">{act.score}</span>
							</a>
						{/each}
					</div>
				</div>
			{/if}

		</div>
	{/if}
</div>
