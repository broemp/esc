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

<div class="container mx-auto px-4 py-8">
	<h1 class="text-2xl font-bold mb-6">Category Management</h1>

	<div class="card p-4 md:p-6 mb-8">
		<h2 class="text-xl font-semibold mb-4">Create New Category</h2>
		<form onsubmit={(e) => { e.preventDefault(); handleCreate(); }} class="space-y-4">
			<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
				<label class="label">
					Name
					<input type="text" bind:value={newCategory.name} class="input" required />
				</label>
				<label class="label">
					Position
					<input type="number" bind:value={newCategory.position} class="input" required />
				</label>
			</div>
			<label class="label">
				Description
				<textarea bind:value={newCategory.description} class="input" rows="3"></textarea>
			</label>
			<label class="flex items-center gap-2">
				<input type="checkbox" class="checkbox" bind:checked={newCategory.default} />
				Default Category
			</label>
			<button type="submit" class="btn variant-filled-primary">Create Category</button>
		</form>
	</div>

	<div class="card overflow-x-auto">
		<table class="table">
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
							<td><input type="text" bind:value={editingCategory.name} class="input" /></td>
							<td><input type="number" bind:value={editingCategory.position} class="input" /></td>
							<td><input type="checkbox" class="checkbox" bind:checked={editingCategory.default} /></td>
							<td class="flex gap-2">
								<button class="btn btn-sm variant-filled-primary" onclick={handleSave}>Save</button>
								<button class="btn btn-sm" onclick={() => (editingCategory = null)}>Cancel</button>
							</td>
						{:else}
							<td>{category.name}</td>
							<td>{category.position}</td>
							<td>
								{#if category.default}
									<span class="preset-filled-success-500 px-2 py-0.5 rounded text-xs">Yes</span>
								{:else}
									<span class="preset-tonal-surface px-2 py-0.5 rounded text-xs">No</span>
								{/if}
							</td>
							<td class="flex gap-2">
								<button
									class="btn btn-sm variant-ghost-surface"
									onclick={() => (editingCategory = { ...category })}
								>
									Edit
								</button>
								<button
									class="btn btn-sm variant-filled-error"
									onclick={() => handleDelete(category.id)}
								>
									Delete
								</button>
							</td>
						{/if}
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
