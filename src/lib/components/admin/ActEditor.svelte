<script lang="ts">
	import axios from 'axios';

	export let actID: string;
	let act: any;
	let country: any;
	let years = [2024];
	$: actID, getAct(actID);

	function getAct(id: string) {
		axios
			.get('/admin/acts/' + id)
			.then(function (response) {
				act = response.data[0].act;
				country = response.data[0].country;
			})
			.catch(function (error) {});
	}

	function updateAct() {
		console.log(act.title);
	}
</script>

<div class="w-full h-full">
	<div class="card text-xl p-4">
		{#if act}
			<form on:submit|preventDefault={updateAct}>
				<div class="grid grid-cols-5 space-x-2">
					<label class="label col-span-4">
						<span>Artist</span>
						<input class="input" name="artist" type="text" bind:value={act.artist} />
					</label>
					<label class="label col-span-1">
						<span>Year</span>
						<select class="select" bind:value={act.year}>
							<option value={null}>NULL</option>
							{#each years as year}
								<option value={year}>{year}</option>
							{/each}
						</select>
					</label>
				</div>
				<div class="grid grid-cols-5 space-x-2">
					<label class="label col-span-4">
						<span>Title</span>
						<input class="input" type="text" name="title" bind:value={act.title} />
					</label>
					<label class="label col-span-1">
						<span>Position</span>
						<input class="input" type="number" name="position" bind:value={act.position} />
					</label>
				</div>
				<label class="label">
					<span>Endpoints</span>
					<input class="input" type="number" name="endpoints" bind:value={act.endpoints} />
				</label>
				<div class="flex justify-between m-4">
					<label class="flex items-center space-x-2">
						<input class="checkbox" type="checkbox" name="eliminated" bind:value={act.eliminated} />
						<p>Eliminated</p>
					</label>
					<button class="btn variant-filled" type="submit">Save</button>
				</div>
			</form>
		{/if}
	</div>
</div>
