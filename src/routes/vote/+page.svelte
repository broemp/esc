<script lang="ts">
	import { goto } from '$app/navigation';
	import type { PageServerData } from './$types';

	export let data: PageServerData;
	let acts = data.acts;
	let nextAct = data.nextAct[0];

	function handleNextActClick() {
		if (nextAct) {
			goto(`/vote/${nextAct.id}`);
		}
	}
</script>

<div>
	{#if nextAct}
		<div class="card cursor-pointer" on:click={handleNextActClick} role="button">
			<div class="flex justify-center">
				<p class="text-xl font-bold">Next Up: {nextAct.artist} - {nextAct.title}</p>
			</div>
		</div>
		<img class="w-full h-48 object-contain cursor-pointer" src={nextAct.picture_url} alt="next artist" on:click={handleNextActClick} />
	{/if}
	<div class="act-list w-full">
		{#each acts as act}
			<a href="/vote/{act.act.id}">
				<div class="w-full border-black border-t-2 grid grid-cols-[1fr_2fr_3fr] h-32">
					<div class="flex items-center justify-center">
						<span class="text-4xl font-bold text-primary-500">{act.act.position}</span>
					</div>
					<img
						class="pic h-full w-full object-contain"
						src={act.act.picture_url}
						alt="artist"
					/>
					<div class="flex flex-col justify-center p-4">
						<div class="flex items-center gap-2">
							<img src={act.country.imageURL} alt="country flag" class="w-6 h-6 object-contain" />
							<span class="text-xl font-bold text-primary-500">{act.country.name}</span>
						</div>
						<span class="text-lg font-bold">{act.act.artist}</span>
						<span class="font-normal">{act.act.title}</span>
					</div>
				</div>
			</a>
		{/each}
	</div>
</div>
