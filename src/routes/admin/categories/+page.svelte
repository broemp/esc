<script lang="ts">
	import type { PageData } from './$types';
	import type { Category } from '$lib/types';

	let { data }: { data: PageData } = $props();

	let categories = $state<Category[]>(data.categories);
	let editingCategory = $state<Category | null>(null);
	let newCategory = $state<Partial<Category>>({ name: '', description: '', default: false, position: 0 });

	async function handleSave() {
		if (!editingCategory) return;
		const res = await fetch('/api/admin/categories', {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(editingCategory)
		});
		if (res.ok) {
			const updated = await res.json();
			categories = categories.map((c) => (c.id === updated.id ? updated : c));
			editingCategory = null;
		}
	}

	async function handleDelete(categoryId: string) {
		if (!confirm('Are you sure you want to delete this category?')) return;
		const res = await fetch(`/api/admin/categories/${categoryId}`, { method: 'DELETE' });
		if (res.ok) {
			categories = categories.filter((c) => c.id !== categoryId);
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
		}
	}
</script>

<div class="p-4 max-w-3xl">
	<h1 class="font-bold text-lg mb-4">Category Management</h1>

	<!-- Create new -->
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

	<!-- Table -->
	<div class="card-esc overflow-x-auto">
		<table class="table-esc">
			<thead>
				<tr>
					<th>Name</th>
					<th>Position</th>
					<th>Default</th>
					<th>Actions</th>
				</tr>
			</thead>
			<tbody>
				{#each categories as category}
					<tr>
						{#if editingCategory?.id === category.id}
							<td><input type="text" bind:value={editingCategory.name} class="input-box" style="padding: 0.25rem 0.5rem;" /></td>
							<td><input type="number" bind:value={editingCategory.position} class="input-box" style="padding: 0.25rem 0.5rem; width: 5rem;" /></td>
							<td><input type="checkbox" class="checkbox-esc" bind:checked={editingCategory.default} /></td>
							<td>
								<div class="flex gap-2">
									<button class="btn-brand px-3 py-1 rounded text-xs font-semibold" onclick={handleSave}>Save</button>
									<button class="btn-ghost text-xs px-3 py-1 rounded" onclick={() => (editingCategory = null)}>Cancel</button>
								</div>
							</td>
						{:else}
							<td class="font-medium">{category.name}</td>
							<td>{category.position}</td>
							<td>
								{#if category.default}
									<span class="px-2 py-0.5 rounded text-xs font-semibold" style="background: oklch(0.18 0.14 145 / 0.4); color: oklch(0.65 0.22 145);">Yes</span>
								{:else}
									<span class="px-2 py-0.5 rounded text-xs" style="background: oklch(0.15 0 0); color: oklch(0.45 0 0);">No</span>
								{/if}
							</td>
							<td>
								<div class="flex gap-2">
									<button
										class="btn-ghost text-xs px-3 py-1 rounded"
										onclick={() => (editingCategory = { ...category })}
									>
										Edit
									</button>
									<button
										class="text-xs px-3 py-1 rounded font-semibold text-white"
										style="background: oklch(0.38 0.22 20);"
										onclick={() => handleDelete(category.id)}
									>
										Delete
									</button>
								</div>
							</td>
						{/if}
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
