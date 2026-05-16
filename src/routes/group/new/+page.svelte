<script lang="ts">
	import type { PageData } from './$types';
	let { data }: { data: PageData } = $props();
</script>

<div class="max-w-lg mx-auto px-4 pt-6 pb-6">
	<h1 class="text-gradient font-bold text-2xl tracking-tight mb-1">Create Group</h1>
	<div class="gradient-line mb-6"></div>

	<form method="POST" class="space-y-6">
		<!-- Group Details -->
		<div class="space-y-5">
			<div>
				<label for="name" class="block text-xs uppercase tracking-widest mb-2" style="color: oklch(0.50 0 0);">
					Group Name
				</label>
				<input
					id="name"
					class="input-esc"
					title="Name"
					name="name"
					type="text"
					required
					minlength="1"
					placeholder="My Eurovision Squad"
				/>
			</div>
			<div>
				<label for="description" class="block text-xs uppercase tracking-widest mb-2" style="color: oklch(0.50 0 0);">
					Description
				</label>
				<input
					id="description"
					class="input-esc"
					title="Description"
					name="description"
					type="text"
					placeholder="Optional description"
				/>
			</div>
		</div>

		<!-- Visibility -->
		<div class="card-esc p-4 flex items-center justify-between">
			<div>
				<p class="font-semibold text-sm">Public Group</p>
				<p class="text-xs mt-0.5" style="color: oklch(0.50 0 0);">Appears in the browse list</p>
			</div>
			<input name="public" class="checkbox-esc" type="checkbox" />
		</div>

		<div class="gradient-line" style="opacity: 0.3;"></div>

		<!-- Categories -->
		<div>
			<p class="text-xs uppercase tracking-widest mb-3" style="color: oklch(0.42 0 0);">Voting Categories</p>
			<div class="grid grid-cols-2 gap-2">
				{#each data.categories as category}
					<label class="card-esc p-3 flex items-center gap-3 cursor-pointer hover:border-[oklch(0.28_0_0)] transition-colors">
						<input name={category.id} class="checkbox-esc" type="checkbox" checked={category.default} />
						<span class="text-sm font-medium">{category.name}</span>
					</label>
				{/each}
			</div>
		</div>

		<button type="submit" class="btn-brand w-full h-12 rounded-xl text-base font-semibold">
			Create Group
		</button>
	</form>
</div>
