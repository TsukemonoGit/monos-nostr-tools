<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { ChevronLeft, ChevronRight } from '@lucide/svelte';

	// カルーセル1スライドの型。

	let {
		screenshots
	}: {
		screenshots: string[];
	} = $props();

	let currentIndex = $state(0);
	let trackEl: HTMLDivElement | undefined = $state();
	let slideEls: (HTMLDivElement | undefined)[] = $state([]);
	let observer: IntersectionObserver | null = null;

	function goTo(index: number) {
		if (index === currentIndex) return;
		currentIndex = index;
		slideEls[index]?.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
	}

	function goNext() {
		goTo((currentIndex + 1) % screenshots.length);
	}

	function goPrev() {
		goTo((currentIndex - 1 + screenshots.length) % screenshots.length);
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'ArrowRight') {
			e.preventDefault();
			goNext();
		} else if (e.key === 'ArrowLeft') {
			e.preventDefault();
			goPrev();
		}
	}

	let autoplayInterval: ReturnType<typeof setInterval> | null = null;
	let isHovering = $state(false);
	let isFocusedWithin = $state(false);
	let isPaused = $derived(isHovering || isFocusedWithin);

	function startAutoplay() {
		if (autoplayInterval || screenshots.length <= 1) return;
		autoplayInterval = setInterval(() => {
			if (!isPaused) {
				goNext();
			}
		}, 5000);
	}

	function stopAutoplay() {
		if (autoplayInterval) {
			clearInterval(autoplayInterval);
			autoplayInterval = null;
		}
	}

	onMount(() => {
		startAutoplay();

		if (!trackEl) return;
		// 手動スワイプ/スクロール時にcurrentIndexを実際の表示スライドへ追従させる
		observer = new IntersectionObserver(
			(entries) => {
				const visible = entries.filter((e) => e.isIntersecting);
				if (visible.length === 0) return;
				const mostVisible = visible.reduce((a, b) =>
					a.intersectionRatio > b.intersectionRatio ? a : b
				);
				const index = slideEls.findIndex((el) => el === mostVisible.target);
				if (index !== -1) currentIndex = index;
			},
			{ root: trackEl, threshold: 0.6 }
		);
		slideEls.forEach((el) => el && observer?.observe(el));
	});

	onDestroy(() => {
		stopAutoplay();
		observer?.disconnect();
	});

	$effect(() => {
		if (isPaused) {
			stopAutoplay();
		} else {
			startAutoplay();
		}
	});
</script>

<!--
		role="region" + tabindex + keydown は WAI-ARIA APG Carousel パターンに基づく意図的な実装。
		region は svelte-check 上「非インタラクティブ要素」と判定されるため、以下2ルールを抑制する。
		参照: https://www.w3.org/WAI/ARIA/apis/patterns/carousel/
	-->
<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<div class="bg-gray-300">
	<div
		class="relative w-full overflow-hidden h-64 md:h-96 my-16 myContainer"
		role="region"
		aria-roledescription="carousel"
		aria-label="carousel"
		tabindex="0"
		onmouseenter={() => (isHovering = true)}
		onmouseleave={() => (isHovering = false)}
		onfocusin={() => (isFocusedWithin = true)}
		onfocusout={() => (isFocusedWithin = false)}
		onkeydown={handleKeydown}
	>
		<span class="sr-only" aria-live="polite">{currentIndex + 1} / {screenshots.length}</span>

		<div
			bind:this={trackEl}
			class="flex h-full overflow-x-auto snap-x snap-mandatory scroll-smooth motion-reduce:scroll-auto [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
		>
			{#each screenshots as slide, i (slide)}
				<div
					id={`slide-${i}`}
					bind:this={slideEls[i]}
					class="min-w-0 w-full h-full shrink-0 snap-start"
					role="group"
					aria-roledescription="slide"
					aria-label={`${i + 1} / ${screenshots.length}`}
					aria-hidden={i !== currentIndex}
				>
					<img
						src={slide}
						alt={`Screenshot ${i + 1}`}
						class="w-full h-full object-contain"
						loading={i === 0 ? 'eager' : 'lazy'}
						decoding="async"
					/>
				</div>
			{/each}
		</div>

		{#if screenshots.length > 1}
			<button
				onclick={goPrev}
				class="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-gray-50/80 flex items-center justify-center button-animation"
				aria-label="Previous slide"
			>
				<ChevronLeft class="w-5 h-5 text-gray-700" />
			</button>

			<button
				onclick={goNext}
				class="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-gray-50/80 flex items-center justify-center button-animation"
				aria-label="Next slide"
			>
				<ChevronRight class="w-5 h-5 text-gray-700" />
			</button>

			<div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
				{#each Array.from({ length: screenshots.length }, (_, i) => i) as index (index)}
					<button
						onclick={() => goTo(index)}
						class="w-2 h-2 rounded-full transition-all duration-300 ease-in-out hover:scale-[1.2]"
						class:bg-gray-700={index === currentIndex}
						class:bg-gray-400={index !== currentIndex}
						aria-label={`Go to slide ${index + 1}`}
						aria-current={index === currentIndex}
					></button>
				{/each}
			</div>
		{/if}
	</div>
</div>
