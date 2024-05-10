<script lang="ts">
	import type { PageData } from '../$types';

	export let data: PageData;
	let acts = data.acts;
</script>

<div>
	<div class="card">
		Probably newest vote - Next act without vote from person
		<button class="btn variant-soft-primary">Cast your Vote</button>
	</div>
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
