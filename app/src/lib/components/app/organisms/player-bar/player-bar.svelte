<script lang="ts">
	import PlayIcon from 'lucide-svelte/icons/play';
	import PauseIcon from 'lucide-svelte/icons/pause';
	import SkipBackIcon from 'lucide-svelte/icons/skip-back';
	import SkipForwardIcon from 'lucide-svelte/icons/skip-forward';
	import ShuffleIcon from 'lucide-svelte/icons/shuffle';
	import RepeatIcon from 'lucide-svelte/icons/repeat-1';

	import PlaylistIcon from 'lucide-svelte/icons/list-music';
	import { getPlayerContext } from '$lib/state/player.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Slider } from '$lib/components/ui/slider/index.js';
	import VolumeIcon from '../../atoms/volume-icon/volume-icon.svelte';
	import Thumbnail from '../../atoms/thumbnail/thumbnail.svelte';
	import ProgressIndicator from '../../atoms/progress-indicator/progress-indicator.svelte';

	const playerState = getPlayerContext();
</script>

{#if playerState && playerState.currentTrack}
	{@const currentTrack = playerState.currentTrack}
	<div class="bg-background  z-10 hidden w-full border-t lg:block">
		<div class="container grid grid-cols-3 px-6 py-4">
			<div class="flex items-center space-x-2">
				<Thumbnail coverURL={currentTrack.cover_url}></Thumbnail>

				<div>
					<div class="text-sm">
						{currentTrack.title}
					</div>
					<a
						href="/artist/{currentTrack.artist_id}"
						class="text-muted-foreground mt-0.5 text-xs hover:underline"
					>
						{currentTrack.artist_id}
						 <!-- {currentTrack.audio_url} -->
					</a>
				</div>
			</div>
			<div class="space-y-2">
				<div class="flex items-center justify-center space-x-3">
					<Button
						size="icon"
						variant="ghost"
						onclick={() => playerState.toggleShuffle()}
						class={playerState.settings.shuffle ? 'text-primary hover:text-primary' : ''}
					>
						<ShuffleIcon></ShuffleIcon>
					</Button>
					<Button
						size="icon"
						variant="ghost"
						disabled={!playerState.hasPrevious}
						onclick={() => playerState.playPreviousTrack()}
					>
						<SkipBackIcon></SkipBackIcon>
					</Button>
					<Button size="icon" onclick={() => playerState.togglePlayPause()}>
						{#if playerState.isPlaying}
							<PauseIcon></PauseIcon>
						{:else}
							<PlayIcon></PlayIcon>
						{/if}
					</Button>
					<Button
						size="icon"
						variant="ghost"
						disabled={!playerState.hasNext}
						onclick={() => playerState.playNextTrack()}
					>
						<SkipForwardIcon></SkipForwardIcon>
					</Button>

					<Button
						size="icon"
						variant="ghost"
						onclick={() => playerState.toggleRepeat()}
						class="{playerState.settings.repeat !== 'off'
							? 'text-primary hover:text-primary'
							: ''} relative"
					>
						<RepeatIcon></RepeatIcon>
						{#if playerState.settings.repeat === 'one'}
							<div
								class="absolute -end-2 -top-2 inline-flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-red-500 text-xs font-bold text-white dark:border-gray-900"
							>
								1
							</div>
						{/if}
					</Button>
				</div>
				<div class="text-muted-foreground flex items-center space-x-2 text-xs">
					<span>
						{playerState.formattedCurrentTime}
					</span>
					<ProgressIndicator progress={playerState.progress}></ProgressIndicator>
					<span>
						{playerState.formattedDuration}
					</span>
				</div>
			</div>

			<div class="flex items-center justify-end space-x-4">
				<div class="flex items-center space-x-1">
					<VolumeIcon muted={playerState.settings.muted} volume={playerState.settings.volume}
					></VolumeIcon>
					<Slider
						type="single"
						value={playerState.settings.volume}
						min={0}
						max={1}
						step={0.1}
						onValueChange={(v) => {
							playerState.setVolume(v);
						}}
						class="min-w-[100px] max-w-[200px]"
					/>
				</div>

				<Button size="icon" variant="ghost">
					<PlaylistIcon></PlaylistIcon>
				</Button>
			</div>
		</div>
	</div>
{/if}
