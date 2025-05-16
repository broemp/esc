<script lang="ts">
    import type { PageData } from './$types';
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';
    export let data: PageData;

    let selectedCategory = 'song';
    let categories = [...new Set(data.votes.map(vote => vote.category?.name || 'song').filter(Boolean))];
    if (!categories.includes('song')) {
        categories.unshift('song');
    }

    $: filteredVotes = data.votes.filter(vote => 
        vote.category?.name === selectedCategory
    );

    function capitalize(str: string): string {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    $: isOwnProfile = $page.data.session?.user?.id === data.user.id;
</script>

<div class="container mx-auto px-4 py-8">
    <div class="bg-gradient-to-br from-red-900 to-black rounded-lg shadow-lg p-6 text-white">
        <div class="flex items-center justify-between mb-8">
            <div class="flex items-center space-x-4">
                {#if data.user.image}
                    <img
                        src={data.user.image}
                        alt={data.user.name || 'User avatar'}
                        class="w-24 h-24 rounded-full object-cover border-4 border-white"
                    />
                {:else}
                    <div class="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center border-4 border-white">
                        <span class="text-4xl text-gray-500">
                            {data.user.name?.[0]?.toUpperCase() || '?'}
                        </span>
                    </div>
                {/if}
                <div>
                    <h1 class="text-3xl font-bold text-white">{data.user.name || 'Anonymous User'}</h1>
                    <p class="text-gray-300">Member since {new Date(data.user.createdAt).toLocaleDateString()}</p>
                </div>
            </div>
            {#if isOwnProfile}
                <button 
                    class="btn variant-soft-primary p-2" 
                    on:click={() => goto('/settings')}
                    title="Settings"
                >
                    <i class="fa-solid fa-gear text-2xl"></i>
                </button>
            {/if}
        </div>

        <div class="mt-8">
            <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-4">
                <h2 class="text-2xl font-semibold">Votes</h2>
                <!-- Mobile Dropdown -->
                <div class="sm:hidden">
                    <select
                        class="w-full p-2 rounded-lg bg-red-800 text-white border-2 border-red-700 focus:outline-none focus:border-white"
                        bind:value={selectedCategory}
                    >
                        {#each categories as category}
                            <option value={category}>{capitalize(category)}</option>
                        {/each}
                    </select>
                </div>
                <!-- Desktop Buttons -->
                <div class="hidden sm:flex space-x-2">
                    {#each categories as category}
                        <button
                            class="px-4 py-2 rounded-full transition-colors {selectedCategory === category ? 'bg-white text-red-900' : 'bg-red-800 text-white hover:bg-red-700'}"
                            on:click={() => selectedCategory = category}
                        >
                            {capitalize(category)}
                        </button>
                    {/each}
                </div>
            </div>
            
            {#if filteredVotes.length === 0}
                <p class="text-gray-300">No votes in this category yet</p>
            {:else}
                <div class="space-y-4">
                    {#each filteredVotes as vote}
                        <div class="flex items-center space-x-4 p-4 bg-red-800/50 rounded-lg backdrop-blur-sm">
                            {#if vote.act?.picture_url}
                                <img
                                    src={vote.act.picture_url}
                                    alt={vote.act.title}
                                    class="w-16 h-16 object-cover rounded border-2 border-white"
                                />
                            {:else if vote.country?.imageURL}
                                <img
                                    src={vote.country.imageURL}
                                    alt={vote.act?.title}
                                    class="w-16 h-16 object-cover rounded border-2 border-white"
                                />
                            {:else}
                                <div class="w-16 h-16 bg-gray-200 rounded flex items-center justify-center border-2 border-white">
                                    <span class="text-gray-500">No image</span>
                                </div>
                            {/if}
                            <div class="flex-1">
                                <h3 class="font-semibold text-white">{vote.act?.artist} - {vote.act?.title}</h3>
                            </div>
                            <div class="text-xl font-bold text-yellow-400">
                                {vote.points} points
                            </div>
                        </div>
                    {/each}
                </div>
            {/if}
        </div>

        <div class="mt-8">
            <h2 class="text-2xl font-semibold mb-4">Public Groups</h2>
            {#if data.publicGroups.length === 0}
                <p class="text-gray-300">No public groups yet</p>
            {:else}
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {#each data.publicGroups as group}
                        <a href="/group/{group.group?.id}">
                            <div class="p-4 bg-red-800/50 rounded-lg backdrop-blur-sm hover:bg-red-700/50 transition-colors">
                                <h3 class="font-semibold text-white">{group.group?.name}</h3>
                            </div>
                        </a>
                    {/each}
                </div>
            {/if}
        </div>
    </div>
</div> 