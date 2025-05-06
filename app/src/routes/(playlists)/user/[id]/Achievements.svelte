<script lang="ts">
	import type { Achievement, OwnedAchievement } from '$lib/types';
	import { makeExplorerLinkForObject } from '$lib/utils';
	import { ExternalLinkIcon, LinkIcon } from 'lucide-svelte';

	let {
		ownedAchievements,
		achievements
	}: { ownedAchievements: OwnedAchievement[]; achievements: Achievement[] } = $props();

	let remainingAchievements = $derived.by(() => {
		const ownedIDs = ownedAchievements.map((a) => a.achievement_id);
		return achievements.filter((a) => !ownedIDs.includes(a.id));
	});
</script>

{#snippet AchievementCard(achievement: OwnedAchievement | Achievement, owned: boolean)}
	<li class="flex flex-col rounded-md border p-4 {owned ? '' : 'opacity-60 grayscale'}">
		<img src={achievement.image} alt={achievement.title} class="rounded-md" />
		<div class="mt-3">
			<div>
				{achievement.title}
			</div>
			<p class="text-muted-foreground text-sm">
				{achievement.description}
			</p>
		</div>

		{#if owned && 'blockchain_address' in achievement}
			<a
				class="mt-2 flex items-start text-end text-sm justify-end"
				target="_blank"
				href={makeExplorerLinkForObject(achievement.blockchain_address!)}
			>
				View in explorer
				<ExternalLinkIcon size="14" class="ml-1"></ExternalLinkIcon>
			</a>
		{/if}
	</li>
{/snippet}

<div class="">
	<h2 class="mb-3 text-2xl font-bold">Achievements</h2>
	<ul class="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
		{#each ownedAchievements as achievement}
			{@render AchievementCard(achievement, true)}
		{/each}
		{#each remainingAchievements as achievement}
			{@render AchievementCard(achievement, false)}
		{/each}
	</ul>
</div>
