<script lang="ts">
	import type { Achievement } from '$lib/types';

	let {
		ownedAchievements,
		achievements
	}: { ownedAchievements: Achievement[]; achievements: Achievement[] } = $props();

	let remainingAchievements = $derived.by(() => {
		const ownedIDs = ownedAchievements.map((a) => a.id);
		return achievements.filter((a) => !ownedIDs.includes(a.id));
	});
</script>

{#snippet AchievementCard(achievement: Achievement, owned: boolean)}
	<li class="flex flex-col rounded-md p-4 {owned ? '' : 'grayscale'}">
		<img src={achievement.image} alt={achievement.title} />
		<div>
			{achievement.title}
		</div>
		<p>
			{achievement.description}
		</p>
	</li>
{/snippet}

<div class="max-w-3xl space-y-8">
	<h2 class="mb-4 text-2xl font-bold">Achievements</h2>
	<ul class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
		{#each ownedAchievements as achievement}
			{@render AchievementCard(achievement, true)}
		{/each}
		{#each remainingAchievements as achievement}
			{@render AchievementCard(achievement, false)}
		{/each}
	</ul>
</div>
