<script lang="ts">
  import type { PageData } from './$types';
  import { goto } from '$app/navigation';

  export let data: PageData;
  let votes = data.votes;

  function formatDate(date: string) {
    return new Date(date).toLocaleString();
  }

  function viewUserProfile(userId: string) {
    goto(`/profile/${userId}`);
  }
</script>

<div class="container mx-auto p-4">
  <h1 class="text-2xl font-bold mb-4">Vote Management</h1>
  
  <div class="card p-4">
    <div class="overflow-x-auto">
      <table class="table">
        <thead>
          <tr>
            <th class="px-4 md:px-6">User</th>
            <th class="px-4 md:px-6">Act</th>
            <th class="px-4 md:px-6">Category</th>
            <th class="px-4 md:px-6">Points</th>
            <th class="px-4 md:px-6">Date</th>
          </tr>
        </thead>
        <tbody>
          {#each votes as vote}
            <tr>
              <td class="px-4 md:px-6">
                {#if vote.user}
                  <button 
                    class="btn btn-sm variant-ghost-primary"
                    on:click={() => viewUserProfile(vote.user?.id)}
                  >
                    {vote.user?.name || vote.user?.email}
                  </button>
                {:else}
                  <span class="text-surface-500">Deleted User</span>
                {/if}
              </td>
              <td class="px-4 md:px-6">
                {#if vote.act}
                  {vote.act.artist} - {vote.act.title}
                {:else}
                  <span class="text-surface-500">Deleted Act</span>
                {/if}
              </td>
              <td class="px-4 md:px-6">
                {#if vote.category}
                  {vote.category.name}
                {:else}
                  <span class="text-surface-500">Deleted Category</span>
                {/if}
              </td>
              <td class="px-4 md:px-6">{vote.vote.points}</td>
              <td class="px-4 md:px-6">{formatDate(vote.vote.created_at)}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>
</div> 