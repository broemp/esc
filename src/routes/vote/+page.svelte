<script lang="ts">
	import { goto } from '$app/navigation';
	import type { PageServerData } from './$types';

	export let data: PageServerData;
	let acts = data.acts;
	let nextAct = data.nextAct[0];
</script>

<div>
	{#if nextAct}
		<div class="card" on:click={() => goto('/vote/' + nextAct.id)} role="button">
			<div class="flex justify-center">
				<p class="text-xl font-bold">Next Up: {nextAct.artist} - {nextAct.title}</p>
			</div>
		</div>
		<img class="w-full h-48 object-contain" src={nextAct.picture_url} alt="next artist" />
	{/if}
	<div class="act-list w-full">
		{#each acts as act}
			<a href="/vote/{act.act.id}">
				<div class="w-full bg-surface-900 border-black border-t-2 grid grid-cols-2">
					<img
						class="pic aspect-square object-contain w-3/6"
						src={act.act.picture_url}
						alt="artist"
					/>
					<div class="flex justify-items-center self-center text-center">
						<p>
							<span class="text-xl font-bold text-[#ff47df]"
								>{act.act.position}. {act.country.name}</span
							>
							<br />
							<span class="text-lg font-bold">{act.act.artist}</span> <br />
							<span class="font-normal">{act.act.title}</span>
						</p>
					</div>
				</div>
			</a>
		{/each}
	</div>
</div>
