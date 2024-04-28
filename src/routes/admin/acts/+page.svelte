<script lang="ts">
	import ActEditor from '$lib/components/admin/ActEditor.svelte';
	import ActList from '$lib/components/admin/ActList.svelte';

	export let data: { acts: ActList };
	let actID = '';
</script>

<div class="grid grid-cols-3 m-4">
	<div class="col-span-2">
		<ActEditor {actID} />
	</div>
	<div class="col-span-1">
		<ActList acts={data.acts} bind:selectedAct={actID} />
	</div>
</div>
