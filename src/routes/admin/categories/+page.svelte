<script lang="ts">
  import { enhance } from '$app/forms';
  import type { PageData } from './$types';
  import type { Category } from '$lib/types';

  export let data: PageData;
  let categories: Category[] = data.categories;
  let editingCategory: Category | null = null;
  let newCategory: Partial<Category> = { name: '', description: '', default: false, position: 0 };

  async function handleEdit(category: Category) {
    editingCategory = { ...category };
  }

  async function handleSave() {
    if (!editingCategory) return;

    try {
      const response = await fetch('/api/admin/categories', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingCategory)
      });

      if (response.ok) {
        const updatedCategory = await response.json();
        categories = categories.map(c => c.id === updatedCategory.id ? updatedCategory : c);
        editingCategory = null;
      }
    } catch (error) {
      console.error('Failed to update category:', error);
    }
  }

  async function handleDelete(categoryId: string) {
    if (!confirm('Are you sure you want to delete this category?')) return;

    try {
      const response = await fetch(`/api/admin/categories/${categoryId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        categories = categories.filter(c => c.id !== categoryId);
      }
    } catch (error) {
      console.error('Failed to delete category:', error);
    }
  }

  async function handleCreate() {
    try {
      const response = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCategory)
      });

      if (response.ok) {
        const createdCategory = await response.json();
        categories = [...categories, createdCategory];
        newCategory = { name: '', description: '', default: false, position: 0 };
      }
    } catch (error) {
      console.error('Failed to create category:', error);
    }
  }
</script>

<div class="container mx-auto px-4 py-8">
  <h1 class="text-2xl font-bold mb-6">Category Management</h1>

  <!-- Create New Category Form -->
  <div class="bg-surface-800 p-6 rounded-lg shadow-md mb-8">
    <h2 class="text-xl font-semibold mb-4">Create New Category</h2>
    <form on:submit|preventDefault={handleCreate} class="space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label for="newName" class="block text-sm font-medium">Name</label>
          <input
            type="text"
            id="newName"
            bind:value={newCategory.name}
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-black focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>
        <div>
          <label for="newPosition" class="block text-sm font-medium">Position</label>
          <input
            type="number"
            id="newPosition"
            bind:value={newCategory.position}
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-black focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>
      </div>
      <div>
        <label for="newDescription" class="block text-sm font-medium">Description</label>
        <textarea
          id="newDescription"
          bind:value={newCategory.description}
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-black focus:border-indigo-500 focus:ring-indigo-500"
          rows="3"
        ></textarea>
      </div>
      <div class="flex items-center">
        <input
          type="checkbox"
          id="newDefault"
          bind:checked={newCategory.default}
          class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
        />
        <label for="newDefault" class="ml-2 block text-sm">Default Category</label>
      </div>
      <button
        type="submit"
        class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Create Category
      </button>
    </form>
  </div>

  <!-- Categories List -->
  <div class="rounded-lg shadow-md overflow-hidden">
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="">
        <tr>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Default</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-200">
        {#each categories as category}
          <tr>
            {#if editingCategory?.id === category.id}
              <td class="px-6 py-4 whitespace-nowrap">
                <input
                  type="text"
                  bind:value={editingCategory.name}
                  class="block w-full rounded-md border-gray-300 shadow-sm text-black focus:border-indigo-500 focus:ring-indigo-500"
                />
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <input
                  type="number"
                  bind:value={editingCategory.position}
                  class="block w-full rounded-md border-gray-300 shadow-sm text-black focus:border-indigo-500 focus:ring-indigo-500"
                />
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <input
                  type="checkbox"
                  bind:checked={editingCategory.default}
                  class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  on:click={handleSave}
                  class="text-indigo-600 hover:text-indigo-900 mr-4"
                >
                  Save
                </button>
                <button
                  on:click={() => editingCategory = null}
                  class="text-gray-600 hover:text-gray-900"
                >
                  Cancel
                </button>
              </td>
            {:else}
              <td class="px-6 py-4 whitespace-nowrap">{category.name}</td>
              <td class="px-6 py-4 whitespace-nowrap">{category.position}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                {#if category.default}
                  <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Yes
                  </span>
                {:else}
                  <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                    No
                  </span>
                {/if}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  on:click={() => handleEdit(category)}
                  class="text-indigo-600 hover:text-indigo-900 mr-4"
                >
                  Edit
                </button>
                <button
                  on:click={() => handleDelete(category.id)}
                  class="text-red-600 hover:text-red-900"
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