<script lang="ts">
	import type { PageData } from './$types';
	import type { Category } from '$lib/types';

	let { data }: { data: PageData } = $props();

	let categories = $state<Category[]>(data.categories);
	let editingCategory = $state<Category | null>(null);
	let newCategory = $state<Partial<Category>>({ name: '', description: '', default: false, position: 0 });
	let showCreate = $state(false);

	type GroupInfo = { id: string; name: string; public: boolean | null };
	let selectedCategoryId = $state<string | null>(null);
	let categoryGroups = $state<GroupInfo[]>([]);
	let loadingGroups = $state(false);

	async function selectCategory(id: string) {
		if (selectedCategoryId === id) return;
		selectedCategoryId = id;
		editingCategory = null;
		categoryGroups = [];
		loadingGroups = true;
		const res = await fetch(`/api/admin/categories/${id}`);
		if (res.ok) {
			categoryGroups = await res.json();
		}
		loadingGroups = false;
	}

	const selectedCategory = $derived(categories.find((c) => c.id === selectedCategoryId));

	async function handleSave() {
		if (!editingCategory) return;
		const res = await fetch('/api/admin/categories', {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(editingCategory)
		});
		if (res.ok) {
			const updated = (await res.json())[0];
			categories = categories.map((c) => (c.id === updated.id ? updated : c));
			editingCategory = null;
		}
	}

	async function handleDelete(categoryId: string) {
		if (!confirm('Are you sure you want to delete this category?')) return;
		const res = await fetch(`/api/admin/categories/${categoryId}`, { method: 'DELETE' });
		if (res.ok) {
			categories = categories.filter((c) => c.id !== categoryId);
			if (selectedCategoryId === categoryId) {
				selectedCategoryId = null;
				categoryGroups = [];
			}
		}
	}

	async function handleCreate() {
		const res = await fetch('/api/admin/categories', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(newCategory)
		});
		if (res.ok) {
			const created = await res.json();
			categories = [...categories, created];
			newCategory = { name: '', description: '', default: false, position: 0 };
			showCreate = false;
		}
	}
</script>

<div class="p-4 h-full">
	<div class="flex items-center justify-between mb-4">
		<h1 class="font-bold text-lg">Category Management</h1>
		<button
			class="btn-brand px-3 py-1.5 rounded-lg text-sm font-semibold"
			onclick={() => (showCreate = !showCreate)}
		>
			{showCreate ? 'Cancel' : '+ New Category'}
		</button>
	</div>

	<!-- Create form (collapsible) -->
	{#if showCreate}
		<div class="card-esc p-4 mb-4">
			<h2 class="font-semibold text-sm mb-3">Create New Category</h2>
			<form onsubmit={(e) => { e.preventDefault(); handleCreate(); }} class="space-y-3">
				<div class="grid grid-cols-1 md:grid-cols-2 gap-3">
					<div>
						<label class="block text-xs uppercase tracking-widest mb-1" style="color: oklch(0.50 0 0);">Name</label>
						<input type="text" bind:value={newCategory.name} class="input-box" required />
					</div>
					<div>
						<label class="block text-xs uppercase tracking-widest mb-1" style="color: oklch(0.50 0 0);">Position</label>
						<input type="number" bind:value={newCategory.position} class="input-box" required />
					</div>
				</div>
				<div>
					<label class="block text-xs uppercase tracking-widest mb-1" style="color: oklch(0.50 0 0);">Description</label>
					<textarea bind:value={newCategory.description} class="input-box" rows="2" style="height: auto; resize: vertical;"></textarea>
				</div>
				<div class="flex items-center gap-3">
					<input type="checkbox" class="checkbox-esc" bind:checked={newCategory.default} id="newDefault" />
					<label for="newDefault" class="text-sm cursor-pointer">Default Category</label>
				</div>
				<button type="submit" class="btn-brand px-4 py-2 rounded-lg text-sm font-semibold">Create</button>
			</form>
		</div>
	{/if}

	<div class="flex gap-4">
		<!-- Left: category list -->
		<div class="w-64 shrink-0 space-y-1 overflow-y-auto">
			{#each categories as category}
				<button
					type="button"
					class="w-full text-left card-esc px-3 py-2.5 transition-colors"
					style={selectedCategoryId === category.id ? 'border-color: oklch(0.65 0.22 145); background: oklch(0.18 0.14 145 / 0.15);' : ''}
					onclick={() => selectCategory(category.id)}
				>
					<div class="flex items-center justify-between gap-2">
						<span class="font-medium text-sm truncate">{category.name}</span>
						{#if category.default}
							<span class="text-xs shrink-0" style="color: oklch(0.65 0.22 145);">Default</span>
						{/if}
					</div>
					{#if category.position != null}
						<p class="text-xs mt-0.5" style="color: oklch(0.45 0 0);">Position {category.position}</p>
					{/if}
				</button>
			{/each}

			{#if categories.length === 0}
				<p class="text-sm" style="color: oklch(0.45 0 0);">No categories yet.</p>
			{/if}
		</div>

		<!-- Right: detail panel -->
		<div class="flex-1 min-w-0">
			{#if !selectedCategoryId}
				<div class="card-esc p-6 flex items-center justify-center h-48">
					<p class="text-sm" style="color: oklch(0.45 0 0);">Select a category to see details</p>
				</div>
			{:else if selectedCategory}
				<div class="card-esc p-5 space-y-5">
					<!-- Header / edit toggle -->
					<div class="flex items-start justify-between gap-4">
						<div>
							<h2 class="font-bold text-base">{selectedCategory.name}</h2>
							<p class="text-xs font-mono mt-1" style="color: oklch(0.45 0 0);">{selectedCategory.id}</p>
						</div>
						<div class="flex gap-2 shrink-0">
							{#if editingCategory}
								<button class="btn-brand px-3 py-1.5 rounded text-xs font-semibold" onclick={handleSave}>Save</button>
								<button class="btn-ghost text-xs px-3 py-1.5 rounded" onclick={() => (editingCategory = null)}>Cancel</button>
							{:else}
								<button class="btn-ghost text-xs px-3 py-1.5 rounded" onclick={() => (editingCategory = { ...selectedCategory })}>Edit</button>
								<button
									class="text-xs px-3 py-1.5 rounded font-semibold text-white"
									style="background: oklch(0.38 0.22 20);"
									onclick={() => handleDelete(selectedCategory.id)}
								>Delete</button>
							{/if}
						</div>
					</div>

					<!-- Edit form or view -->
					{#if editingCategory}
						<div class="space-y-3">
							<div class="grid grid-cols-2 gap-3">
								<div>
									<label class="block text-xs uppercase tracking-widest mb-1" style="color: oklch(0.50 0 0);">Name</label>
									<input type="text" bind:value={editingCategory.name} class="input-box" />
								</div>
								<div>
									<label class="block text-xs uppercase tracking-widest mb-1" style="color: oklch(0.50 0 0);">Position</label>
									<input type="number" bind:value={editingCategory.position} class="input-box" style="width: 6rem;" />
								</div>
							</div>
							<div>
								<label class="block text-xs uppercase tracking-widest mb-1" style="color: oklch(0.50 0 0);">Description</label>
								<textarea bind:value={editingCategory.description} class="input-box" rows="2" style="height: auto; resize: vertical;"></textarea>
							</div>
							<div class="flex items-center gap-3">
								<input type="checkbox" class="checkbox-esc" bind:checked={editingCategory.default} id="editDefault" />
								<label for="editDefault" class="text-sm cursor-pointer">Default Category</label>
							</div>
						</div>
					{:else}
						<div class="space-y-2 text-sm">
							<div class="flex gap-6">
								<div>
									<span class="text-xs uppercase tracking-widest" style="color: oklch(0.50 0 0);">Position</span>
									<p class="mt-0.5">{selectedCategory.position ?? '—'}</p>
								</div>
								<div>
									<span class="text-xs uppercase tracking-widest" style="color: oklch(0.50 0 0);">Default</span>
									<p class="mt-0.5">
										{#if selectedCategory.default}
											<span class="px-2 py-0.5 rounded text-xs font-semibold" style="background: oklch(0.18 0.14 145 / 0.4); color: oklch(0.65 0.22 145);">Yes</span>
										{:else}
											<span class="px-2 py-0.5 rounded text-xs" style="background: oklch(0.15 0 0); color: oklch(0.45 0 0);">No</span>
										{/if}
									</p>
								</div>
							</div>
							{#if selectedCategory.description}
								<div>
									<span class="text-xs uppercase tracking-widest" style="color: oklch(0.50 0 0);">Description</span>
									<p class="mt-0.5" style="color: oklch(0.75 0 0);">{selectedCategory.description}</p>
								</div>
							{/if}
						</div>
					{/if}

					<!-- Groups using this category -->
					<div>
						<h3 class="text-xs uppercase tracking-widest font-semibold mb-2" style="color: oklch(0.50 0 0);">
							Used by groups
						</h3>
						{#if loadingGroups}
							<p class="text-sm" style="color: oklch(0.45 0 0);">Loading...</p>
						{:else if categoryGroups.length === 0}
							<p class="text-sm" style="color: oklch(0.45 0 0);">No groups use this category</p>
						{:else}
							<div class="space-y-1.5">
								{#each categoryGroups as g}
									{#if g.id}
										<div class="flex items-center gap-2 text-sm">
											<span class="w-2 h-2 rounded-full shrink-0" style="background: oklch(0.65 0.18 260);"></span>
											<span>{g.name}</span>
											{#if g.public}
												<span class="text-xs" style="color: oklch(0.45 0 0);">Public</span>
											{/if}
										</div>
									{/if}
								{/each}
							</div>
						{/if}
					</div>
				</div>
			{/if}
		</div>
	</div>
</div>
