<script lang="ts">
	import { goto } from '$app/navigation';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	function capitalize(s: string) {
		return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
	}

	function pearsonPct(pearson: number) {
		return Math.max(0, Math.round(pearson * 100));
	}

	function scoreColor(score: number) {
		if (score >= 7.5) return 'oklch(0.72 0.18 142)';
		if (score >= 5) return 'oklch(0.70 0.15 80)';
		return 'oklch(0.65 0.18 25)';
	}

	// Most generous and harshest voter
	const sorted = $derived([...data.voterProfiles].sort((a, b) => Number(b.avgScore) - Number(a.avgScore)));
	let judgesLimit = $state(5);
	const mostGenerous = $derived(sorted[0]);
	const harshest = $derived(sorted[sorted.length - 1]);

	// Most opinionated (highest spread in own votes)
	const mostOpinionated = $derived(
		[...data.voterProfiles].sort((a, b) => Number(b.spread) - Number(a.spread))[0]
	);

	// Most contrarian (highest deviation from group)
	const topContrarian = $derived(data.deviation[0]);
	const mostAligned = $derived(data.deviation[data.deviation.length - 1]);

	function handleGroupChange(e: Event) {
		const val = (e.target as HTMLSelectElement).value;
		goto(val === 'global' ? '/stats' : `/stats?group=${val}`, { replaceState: true });
	}
</script>

<svelte:head>
	<title>Stats — ESC 2026</title>
</svelte:head>

<div class="max-w-2xl mx-auto px-4 pt-6 pb-10">
	<!-- Header -->
	<div class="flex items-center justify-between mb-1">
		<h1 class="text-gradient font-bold text-2xl tracking-tight">Stats</h1>
	</div>
	<div class="gradient-line mb-5"></div>

	<!-- Disabled state -->
	{#if data.disabled}
		<div class="text-center py-20">
			<i class="fa-solid fa-chart-bar text-3xl mb-4" style="color: oklch(0.22 0 0);"></i>
			<p class="font-semibold mb-1" style="color: oklch(0.55 0 0);">Stats are currently disabled</p>
			<p class="text-sm" style="color: oklch(0.38 0 0);">An admin can re-enable them in the admin panel.</p>
		</div>
	{:else}

	<!-- Group selector -->
	<div class="mb-6">
		<label class="block text-xs uppercase tracking-widest mb-2" style="color: oklch(0.42 0 0);">
			Viewing
		</label>
		<select class="select-esc" onchange={handleGroupChange}>
			<option value="global" selected={!data.groupId}>Everyone</option>
			{#each data.groups as group}
				<option value={group.id} selected={data.groupId === group.id}>{group.name}</option>
			{/each}
		</select>
	</div>

	<!-- ── YOUR STATS ────────────────────────────────────────── -->
	{#if data.userStats && data.userId}
		<div class="mb-6">
			<p class="text-xs uppercase tracking-widest mb-3" style="color: oklch(0.42 0 0);">Your Stats</p>

			<div class="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
				<div class="card-esc p-3 text-center">
					<p class="text-gradient font-bold text-xl">{data.userStats.overall?.totalVotes ?? 0}</p>
					<p class="text-xs mt-0.5" style="color: oklch(0.45 0 0);">Votes cast</p>
				</div>
				<div class="card-esc p-3 text-center">
					<p class="text-gradient font-bold text-xl">{data.userStats.overall?.avgScore ?? '—'}</p>
					<p class="text-xs mt-0.5" style="color: oklch(0.45 0 0);">Avg score</p>
				</div>
				{#if data.userStats.byCat.length > 0}
					{@const top = [...data.userStats.byCat].sort((a, b) => Number(b.avgScore) - Number(a.avgScore))[0]}
					{@const bot = [...data.userStats.byCat].sort((a, b) => Number(a.avgScore) - Number(b.avgScore))[0]}
					<div class="card-esc p-3 text-center">
						<p class="font-bold text-sm truncate" style="color: oklch(0.72 0.18 142);">{capitalize(top.categoryName ?? '')}</p>
						<p class="text-xs mt-0.5" style="color: oklch(0.45 0 0);">Most loved cat.</p>
					</div>
					<div class="card-esc p-3 text-center">
						<p class="font-bold text-sm truncate" style="color: oklch(0.65 0.18 25);">{capitalize(bot.categoryName ?? '')}</p>
						<p class="text-xs mt-0.5" style="color: oklch(0.45 0 0);">Toughest on</p>
					</div>
				{/if}
			</div>

			<!-- Per-category breakdown -->
			{#if data.userStats.byCat.length > 0}
				<div class="card-esc p-4 mb-4">
					<p class="text-xs uppercase tracking-widest mb-3" style="color: oklch(0.42 0 0);">Category averages</p>
					<div class="space-y-2">
						{#each [...data.userStats.byCat].sort((a, b) => Number(b.avgScore) - Number(a.avgScore)) as cat}
							<div class="flex items-center gap-2">
								<span class="text-sm w-24 shrink-0 truncate" style="color: oklch(0.70 0 0);">{capitalize(cat.categoryName ?? '')}</span>
								<div class="flex-1 h-1.5 rounded-full" style="background: oklch(0.15 0 0);">
									<div
										class="h-1.5 rounded-full"
										style="width: {Math.min(100, (Number(cat.avgScore) / 10) * 100)}%; background: var(--gradient-brand-horizontal);"
									></div>
								</div>
								<span class="text-sm font-semibold w-8 text-right shrink-0" style="color: {scoreColor(Number(cat.avgScore))};">
									{cat.avgScore}
								</span>
							</div>
						{/each}
					</div>
				</div>
			{/if}

			<!-- Top & bottom acts -->
			{#if data.userStats.topActs.length > 0 || data.userStats.bottomActs.length > 0}
				<div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
					{#if data.userStats.topActs.length > 0}
						<div class="card-esc p-3">
							<p class="text-xs uppercase tracking-widest mb-2" style="color: oklch(0.72 0.18 142);">Your top acts</p>
							<div class="space-y-1.5">
								{#each data.userStats.topActs as act}
									<div class="flex items-center gap-2">
										{#if act.countryImage}
											<img src={act.countryImage} alt="" class="w-7 h-7 object-contain rounded shrink-0" />
										{/if}
										<div class="flex-1 min-w-0">
											<p class="text-xs font-semibold truncate">{act.artist}</p>
											<p class="text-xs truncate" style="color: oklch(0.48 0 0);">{act.categoryName}</p>
										</div>
										<span class="text-xs font-bold shrink-0" style="color: oklch(0.72 0.18 142);">{act.points}</span>
									</div>
								{/each}
							</div>
						</div>
					{/if}
					{#if data.userStats.bottomActs.length > 0}
						<div class="card-esc p-3">
							<p class="text-xs uppercase tracking-widest mb-2" style="color: oklch(0.65 0.18 25);">Your bottom acts</p>
							<div class="space-y-1.5">
								{#each data.userStats.bottomActs as act}
									<div class="flex items-center gap-2">
										{#if act.countryImage}
											<img src={act.countryImage} alt="" class="w-7 h-7 object-contain rounded shrink-0" />
										{/if}
										<div class="flex-1 min-w-0">
											<p class="text-xs font-semibold truncate">{act.artist}</p>
											<p class="text-xs truncate" style="color: oklch(0.48 0 0);">{act.categoryName}</p>
										</div>
										<span class="text-xs font-bold shrink-0" style="color: oklch(0.65 0.18 25);">{act.points}</span>
									</div>
								{/each}
							</div>
						</div>
					{/if}
				</div>
			{/if}
		</div>
		<div class="gradient-line mb-5"></div>
	{/if}

	<!-- ── CONTROVERSY CORNER ─────────────────────────────────── -->
	{#if data.controversial.length > 0}
		<div class="mb-6">
			<p class="text-xs uppercase tracking-widest mb-1" style="color: oklch(0.42 0 0);">Controversy corner</p>
			<p class="text-xs mb-3" style="color: oklch(0.38 0 0);">Highest disagreement among voters</p>
			<div class="space-y-2">
				{#each data.controversial as act}
					<div class="card-esc p-3 flex items-center gap-3">
						{#if act.countryImage}
							<img src={act.countryImage} alt="" class="w-10 h-10 object-contain rounded-lg shrink-0" />
						{:else}
							<div class="w-10 h-10 rounded-lg shrink-0 flex items-center justify-center" style="background: oklch(0.12 0 0);">
								<i class="fa-solid fa-music text-xs" style="color: oklch(0.35 0 0);"></i>
							</div>
						{/if}
						<div class="flex-1 min-w-0">
							<p class="font-semibold text-sm truncate">{act.artist}</p>
							<p class="text-xs truncate" style="color: oklch(0.50 0 0);">{act.title}</p>
						</div>
						<div class="text-right shrink-0">
							<p class="text-xs font-medium" style="color: oklch(0.65 0.18 25);">±{act.stddev}</p>
							<p class="text-xs" style="color: oklch(0.38 0 0);">avg {act.avgScore}</p>
						</div>
					</div>
				{/each}
			</div>
		</div>
		<div class="gradient-line mb-5"></div>
	{/if}

	<!-- ── TOTAL AGREEMENT ───────────────────────────────────── -->
	{#if data.agreed.length > 0}
		<div class="mb-6">
			<p class="text-xs uppercase tracking-widest mb-1" style="color: oklch(0.42 0 0);">Total agreement</p>
			<p class="text-xs mb-3" style="color: oklch(0.38 0 0);">Everyone's on the same page here</p>
			<div class="space-y-2">
				{#each data.agreed as act}
					<div class="card-esc p-3 flex items-center gap-3">
						{#if act.countryImage}
							<img src={act.countryImage} alt="" class="w-10 h-10 object-contain rounded-lg shrink-0" />
						{:else}
							<div class="w-10 h-10 rounded-lg shrink-0 flex items-center justify-center" style="background: oklch(0.12 0 0);">
								<i class="fa-solid fa-music text-xs" style="color: oklch(0.35 0 0);"></i>
							</div>
						{/if}
						<div class="flex-1 min-w-0">
							<p class="font-semibold text-sm truncate">{act.artist}</p>
							<p class="text-xs truncate" style="color: oklch(0.50 0 0);">{act.title}</p>
						</div>
						<div class="text-right shrink-0">
							<p class="text-gradient font-bold text-sm">{act.avgScore}</p>
							<p class="text-xs" style="color: oklch(0.38 0 0);">±{act.stddev}</p>
						</div>
					</div>
				{/each}
			</div>
		</div>
		<div class="gradient-line mb-5"></div>
	{/if}

	<!-- ── THE JUDGES ────────────────────────────────────────── -->
	{#if data.voterProfiles.length > 0}
		<div class="mb-6">
			<p class="text-xs uppercase tracking-widest mb-3" style="color: oklch(0.42 0 0);">The judges</p>
			<div class="space-y-2 mb-4">
				{#each sorted.slice(0, judgesLimit) as voter}
					<div class="card-esc p-3 flex items-center gap-3">
						{#if voter.userImage}
							<img src={voter.userImage} alt="" class="w-8 h-8 rounded-full object-cover shrink-0" />
						{:else}
							<div class="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style="background: oklch(0.12 0 0);">
								<span class="text-gradient text-sm font-bold">{(voter.userName ?? '?')[0].toUpperCase()}</span>
							</div>
						{/if}
						<div class="flex-1 min-w-0">
							<p class="text-sm font-semibold truncate">{voter.userName ?? 'Unknown'}</p>
							<div class="flex items-center gap-1 mt-0.5">
								<div class="flex-1 h-1 rounded-full" style="background: oklch(0.15 0 0);">
									<div
										class="h-1 rounded-full"
										style="width: {Math.min(100, (Number(voter.avgScore) / 10) * 100)}%; background: var(--gradient-brand-horizontal);"
									></div>
								</div>
							</div>
						</div>
						<div class="text-right shrink-0">
							<span class="font-bold text-sm" style="color: {scoreColor(Number(voter.avgScore))};">{voter.avgScore}</span>
							<p class="text-xs" style="color: oklch(0.38 0 0);">{voter.totalVotes} votes</p>
						</div>
					</div>
				{/each}
			</div>
			{#if sorted.length > judgesLimit}
				<button
					class="w-full text-xs py-2 mb-4 rounded-lg"
					style="color: oklch(0.55 0 0); border: 1px solid oklch(0.20 0 0 / 0.7);"
					onclick={() => judgesLimit += 5}
				>
					Show more ({sorted.length - judgesLimit} remaining)
				</button>
			{/if}

			<!-- Fun facts row -->
			<div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
				{#if mostGenerous}
					<div class="card-esc p-3 text-center">
						<p class="text-xs uppercase tracking-widest mb-1" style="color: oklch(0.42 0 0);">Most generous</p>
						<p class="font-semibold text-sm truncate" style="color: oklch(0.72 0.18 142);">{mostGenerous.userName}</p>
						<p class="text-xs" style="color: oklch(0.38 0 0);">avg {mostGenerous.avgScore}</p>
					</div>
				{/if}
				{#if harshest}
					<div class="card-esc p-3 text-center">
						<p class="text-xs uppercase tracking-widest mb-1" style="color: oklch(0.42 0 0);">Toughest judge</p>
						<p class="font-semibold text-sm truncate" style="color: oklch(0.65 0.18 25);">{harshest.userName}</p>
						<p class="text-xs" style="color: oklch(0.38 0 0);">avg {harshest.avgScore}</p>
					</div>
				{/if}
				{#if mostOpinionated}
					<div class="card-esc p-3 text-center">
						<p class="text-xs uppercase tracking-widest mb-1" style="color: oklch(0.42 0 0);">Most opinionated</p>
						<p class="font-semibold text-sm truncate" style="color: oklch(0.70 0.15 60);">{mostOpinionated.userName}</p>
						<p class="text-xs" style="color: oklch(0.38 0 0);">spread ±{mostOpinionated.spread}</p>
					</div>
				{/if}
			</div>
		</div>
		<div class="gradient-line mb-5"></div>
	{/if}

	<!-- ── CONTRARIANS ───────────────────────────────────────── -->
	{#if data.deviation.length > 0}
		<div class="mb-6">
			<p class="text-xs uppercase tracking-widest mb-1" style="color: oklch(0.42 0 0);">Contrarians vs. conformists</p>
			<p class="text-xs mb-3" style="color: oklch(0.38 0 0);">Deviation from group average per voter</p>
			<div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
				{#if topContrarian}
					<div class="card-esc p-3">
						<p class="text-xs uppercase tracking-widest mb-1" style="color: oklch(0.65 0.18 25);">Most contrarian</p>
						<div class="flex items-center gap-2">
							{#if topContrarian.user_image}
								<img src={topContrarian.user_image} alt="" class="w-8 h-8 rounded-full object-cover shrink-0" />
							{:else}
								<div class="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style="background: oklch(0.12 0 0);">
									<span class="text-gradient text-sm font-bold">{(topContrarian.user_name ?? '?')[0].toUpperCase()}</span>
								</div>
							{/if}
							<div>
								<p class="font-semibold text-sm">{topContrarian.user_name ?? 'Unknown'}</p>
								<p class="text-xs" style="color: oklch(0.45 0 0);">±{topContrarian.deviation} from avg</p>
							</div>
						</div>
					</div>
				{/if}
				{#if mostAligned}
					<div class="card-esc p-3">
						<p class="text-xs uppercase tracking-widest mb-1" style="color: oklch(0.72 0.18 142);">Most aligned</p>
						<div class="flex items-center gap-2">
							{#if mostAligned.user_image}
								<img src={mostAligned.user_image} alt="" class="w-8 h-8 rounded-full object-cover shrink-0" />
							{:else}
								<div class="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style="background: oklch(0.12 0 0);">
									<span class="text-gradient text-sm font-bold">{(mostAligned.user_name ?? '?')[0].toUpperCase()}</span>
								</div>
							{/if}
							<div>
								<p class="font-semibold text-sm">{mostAligned.user_name ?? 'Unknown'}</p>
								<p class="text-xs" style="color: oklch(0.45 0 0);">±{mostAligned.deviation} from avg</p>
							</div>
						</div>
					</div>
				{/if}
			</div>
		</div>
		<div class="gradient-line mb-5"></div>
	{/if}

	<!-- ── CHEMISTRY ─────────────────────────────────────────── -->
	<div class="mb-6">
		<p class="text-xs uppercase tracking-widest mb-1" style="color: oklch(0.42 0 0);">Chemistry</p>
		<p class="text-xs mb-3" style="color: oklch(0.38 0 0);">Taste match vs other voters (Pearson correlation)</p>

		{#if !data.userId}
			<div class="card-esc p-4 text-center">
				<p class="text-sm" style="color: oklch(0.45 0 0);">Log in to see your chemistry with other voters.</p>
			</div>
		{:else if data.mostAlike.length === 0 && data.mostDifferent.length === 0}
			<div class="card-esc p-4 text-center">
				<p class="text-sm" style="color: oklch(0.45 0 0);">Vote on more acts to unlock chemistry stats.</p>
			</div>
		{:else}
			<div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
				<!-- Most alike -->
				<div>
					<p class="text-xs mb-2" style="color: oklch(0.38 0 0);">Most alike</p>
					<div class="space-y-2">
						{#each data.mostAlike as peer}
							<div class="card-esc p-2.5 flex items-center gap-2">
								{#if peer.other_image}
									<img src={peer.other_image} alt="" class="w-6 h-6 rounded-full object-cover shrink-0" />
								{:else}
									<div class="w-6 h-6 rounded-full flex items-center justify-center shrink-0" style="background: oklch(0.14 0 0);">
										<span class="text-gradient text-xs font-bold">{(peer.other_name ?? '?')[0].toUpperCase()}</span>
									</div>
								{/if}
								<span class="text-xs truncate flex-1" style="color: oklch(0.60 0 0);">{peer.other_name ?? 'Unknown'}</span>
								<span class="text-xs font-semibold shrink-0" style="color: oklch(0.72 0.18 142);">{pearsonPct(peer.pearson)}%</span>
							</div>
						{/each}
					</div>
				</div>

				<!-- Most different -->
				<div>
					<p class="text-xs mb-2" style="color: oklch(0.38 0 0);">Most different</p>
					<div class="space-y-2">
						{#each data.mostDifferent as peer}
							<div class="card-esc p-2.5 flex items-center gap-2">
								{#if peer.other_image}
									<img src={peer.other_image} alt="" class="w-6 h-6 rounded-full object-cover shrink-0" />
								{:else}
									<div class="w-6 h-6 rounded-full flex items-center justify-center shrink-0" style="background: oklch(0.14 0 0);">
										<span class="text-gradient text-xs font-bold">{(peer.other_name ?? '?')[0].toUpperCase()}</span>
									</div>
								{/if}
								<span class="text-xs truncate flex-1" style="color: oklch(0.60 0 0);">{peer.other_name ?? 'Unknown'}</span>
								<span class="text-xs font-semibold shrink-0" style="color: oklch(0.65 0.18 25);">{pearsonPct(peer.pearson)}%</span>
							</div>
						{/each}
					</div>
				</div>
			</div>
		{/if}
	</div>

	{#if data.controversial.length === 0 && data.voterProfiles.length === 0}
		<div class="text-center py-16">
			<i class="fa-solid fa-chart-bar text-3xl mb-3" style="color: oklch(0.25 0 0);"></i>
			<p class="text-sm" style="color: oklch(0.40 0 0);">No votes yet — stats will appear once people start voting.</p>
		</div>
	{/if}

	{/if}
</div>
