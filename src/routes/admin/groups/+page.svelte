<script lang="ts">
  import { enhance } from '$app/forms';
  import type { PageData } from './$types';

  export let data: PageData;
  let groups = data.groups;
</script>

<div class="p-4">
  <h1 class="text-2xl font-bold mb-6">Manage Groups</h1>

  <div class="grid gap-4">
    {#each groups as group}
      <div class="card p-4 variant-filled-surface">
        <div class="flex justify-between items-center">
          <div>
            <h3 class="text-lg font-semibold">{group.name}</h3>
            <p class="text-sm opacity-75">ID: {group.id}</p>
            <p class="text-sm opacity-75">Admin ID: {group.admin}</p>
            <p class="text-sm opacity-75">Public: {group.public ? 'Yes' : 'No'}</p>
          </div>
          <form
            method="POST"
            action="?/delete"
            use:enhance={() => {
              return async ({ result }) => {
                if (result.type === 'success') {
                  groups = groups.filter(g => g.id !== group.id);
                }
              };
            }}
          >
            <input type="hidden" name="groupId" value={group.id} />
            <button
              type="submit"
              class="btn variant-filled-error"
              on:click={(e) => {
                if (!confirm('Are you sure you want to delete this group? This action cannot be undone.')) {
                  e.preventDefault();
                }
              }}
            >
              Delete
            </button>
          </form>
        </div>
      </div>
    {/each}
  </div>
</div> 