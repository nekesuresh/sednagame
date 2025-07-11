<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { questionGenerator } from '$lib/utils/QuestionGenerator';
	import { answerHandler } from '$lib/utils/AnswerHandler';
	import type { Question } from '$lib/utils/QuestionGenerator';
	import type { AnswerResult } from '$lib/utils/AnswerHandler';
	import CaseStudyModal from './CaseStudyModal.svelte';
	import StatsModal from './StatsModal.svelte';
	import confetti from 'canvas-confetti';

	let currentQuestion: Question | null = null;
	let nextQuestion: Question | null = null;
	let isLoading = true;
	let showAnswer = false;
	let answerResult: AnswerResult | null = null;
	let showCaseStudyModal = false;
	let showStatsModal = false;
	let userAnswer: boolean | null = null;
	let isGeneratingQuestion = false;
	let isPreloadingNext = false;
	let ollamaStatus = false;
	let showDifficultyModal = false;
	let didYouKnowFacts = [
		"Did you know? AI can write an entire book, but it might still struggle to tell you the difference between a banana and an apple in a photo.",
		"Did you know? AI can predict the weather with impressive accuracy, but it still can't predict when your internet will cut out mid-stream.",
		"Did you know? AI can beat the world champion at chess, but it gets completely confused if you ask it to count the number of strawberries in a basket of three.",
		"Did you know? AI can generate complex art that looks just like a famous painter's style, but it still can't figure out how to make a decent cup of coffee!",
		"Did you know? AI has been trained to help doctors diagnose diseases, but it can't tell if a dog is excited or just really tired based on its wagging tail.",
		"Did you know? AI can help design skyscrapers and build bridges, but it might still get tripped up trying to fold a fitted sheet properly.",
		"Did you know? AI can predict traffic patterns and optimize city routes, but it might still get lost in your own driveway!",
		"Did you know? AI can write music in Beethoven's style, but it can't understand the concept of a 'bad hair day.'",
		"Did you know? AI can teach itself to play video games, but it still has trouble figuring out how to open a jar of pickles.",
		"Did you know? AI can analyze vast amounts of medical data, but it can't quite grasp why we keep talking to our pets like they're human."
	];
	let currentFactIndex = Math.floor(Math.random() * didYouKnowFacts.length);
	let factInterval: any = null;

	// Reactive statements to ensure stats update
	$: currentScore = answerHandler.getScore();
	$: currentAccuracy = answerHandler.getAccuracy();
	$: currentDifficulty = answerHandler.getUserInfo()?.difficulty?.toUpperCase() || 'MEDIUM';

	onMount(async () => {
		// Check if user is set up
		const userInfo = answerHandler.getUserInfo();
		if (!userInfo) {
			goto('/setup');
			return;
		}

		// Get Ollama status without waiting for a network check
		ollamaStatus = questionGenerator.getOllamaStatus();
		
		// Check if first question was preloaded
		const firstQuestionPreloaded = localStorage.getItem('sedna_first_question_preloaded');
		if (firstQuestionPreloaded === 'true') {
			// Use the preloaded question
			try {
				const preloadedQuestionData = localStorage.getItem('sedna_preloaded_question');
				if (preloadedQuestionData) {
					currentQuestion = JSON.parse(preloadedQuestionData);
					localStorage.removeItem('sedna_first_question_preloaded');
					localStorage.removeItem('sedna_preloaded_question');
					isLoading = false;
					// Now that Q1 is shown, start preloading Q2
					preloadNextQuestion();
				} else {
					await generateNewQuestion();
				}
			} catch (error) {
				console.error('Error using preloaded question:', error);
				await generateNewQuestion();
			}
		} else {
			await generateNewQuestion();
		}
	});

	async function generateNewQuestion() {
		isGeneratingQuestion = true;
		isLoading = true;
		showAnswer = false;
		answerResult = null;
		userAnswer = null;

		ollamaStatus = questionGenerator.getOllamaStatus();

		try {
			const userInfo = answerHandler.getUserInfo();
			const difficulty = userInfo?.difficulty || 'medium';
			if (nextQuestion) {
				currentQuestion = nextQuestion;
				nextQuestion = null;
			} else {
				currentQuestion = await questionGenerator.generateQuestionFromRandomTip(difficulty);
			}
		} catch (error) {
			console.error('Error generating question:', error);
			currentQuestion = {
				id: 'fallback',
				statement: 'AI can help improve government services and efficiency.',
				isFact: true,
				explanation: 'AI has been successfully implemented in various government agencies to improve service delivery, reduce costs, and enhance citizen satisfaction.',
				sednaTip: {
					id: 0,
					tip: 'AI can enhance government services and improve efficiency when properly implemented.',
					caseStudy: 'Sedna Consulting Group has helped numerous government agencies implement AI solutions that improve service delivery, reduce costs, and enhance citizen satisfaction.'
				},
				difficulty: 'easy'
			};
		} finally {
			isLoading = false;
			isGeneratingQuestion = false;
			// After showing the new question, start preloading the next one
			preloadNextQuestion();
		}
	}

	function handleAnswer(answer: boolean) {
		if (!currentQuestion || showAnswer) return;

		userAnswer = answer;
		showAnswer = true;
		answerResult = answerHandler.handleAnswer(currentQuestion, answer);

		if (answerResult?.isCorrect) {
			// Trigger confetti burst
			confetti({
				particleCount: 60,
				spread: 70,
				origin: { y: 0.6 },
				colors: ['#39ff14', '#c29a3b', '#d5dde3']
			});
		}

		// Check if game is complete
		if (answerHandler.isGameComplete()) {
			handleGameCompletion();
		}
	}

	function handleNextQuestion() {
		generateNewQuestion();
	}

	function handleShowCaseStudy() {
		showCaseStudyModal = true;
	}

	function handleShowStats() {
		showStatsModal = true;
	}

	function handleResetGame() {
		if (confirm('Are you sure you want to reset ALL your stats and player profile? This will clear your score, accuracy, and require you to re-enter your information and choose your difficulty again.')) {
			answerHandler.resetStats();
			// Set flag to show start page
			localStorage.setItem('sedna_show_start_page', 'true');
			// Redirect to start page
			goto('/');
		}
	}

	function handleBackToWelcome() {
		if (confirm('Are you sure you want to go back to the welcome screen?')) {
			answerHandler.resetStats();
			localStorage.setItem('sedna_show_start_page', 'true');
			goto('/');
		}
	}

	function handleChangeDifficulty() {
		showDifficultyModal = true;
	}

	function handleDifficultyChange(newDifficulty: 'easy' | 'medium' | 'hard') {
		answerHandler.updateUserInfo({ difficulty: newDifficulty });
		showDifficultyModal = false;
		nextQuestion = null;
		generateNewQuestion();
		// Force manual refresh of currentDifficulty
		currentDifficulty = answerHandler.getUserInfo()?.difficulty?.toUpperCase() || 'MEDIUM';
	}

	function handleGameCompletion() {
		// Redirect to completion page
		goto('/completion');
	}

	async function preloadNextQuestion() {
		if (isPreloadingNext || nextQuestion) return;
		
		isPreloadingNext = true;
		try {
			const userInfo = answerHandler.getUserInfo();
			const difficulty = userInfo?.difficulty || 'medium';
			nextQuestion = await questionGenerator.generateQuestionFromRandomTip(difficulty);
		} catch (error) {
			console.error('Error preloading question:', error);
		} finally {
			isPreloadingNext = false;
		}
	}

	$: if (isGeneratingQuestion) {
		if (!factInterval) {
			factInterval = setInterval(() => {
				let nextIndex;
				do {
					nextIndex = Math.floor(Math.random() * didYouKnowFacts.length);
				} while (nextIndex === currentFactIndex);
				currentFactIndex = nextIndex;
			}, 7000);
		}
	} else {
		if (factInterval) {
			clearInterval(factInterval);
			factInterval = null;
		}
	}
</script>

<svelte:head>
	<title>Gameshow - Sedna AI Gameshow</title>
</svelte:head>

<div class="sedna-section-bg min-h-screen relative">
	<div class="crt-overlay pointer-events-none"></div>
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-20">
		<!-- Header with Stats -->
		<div class="flex justify-center items-center mb-8">
			<div class="flex items-center space-x-4">
				<button 
					class="sedna-btn sedna-btn-secondary"
					on:click={handleBackToWelcome}
				>
					🏠 HOME
				</button>
				<button 
					class="sedna-btn"
					on:click={handleShowStats}
				>
					📊 STATS
				</button>
				<button 
					class="sedna-btn sedna-btn-accent"
					on:click={handleChangeDifficulty}
				>
					⚙️ DIFFICULTY
				</button>
				<div class="ml-4 sedna-badge sedna-badge-secondary text-lg">
					Level: {currentDifficulty}
				</div>
			</div>
		</div>
		<!-- Main Game Area -->
		<div class="max-w-4xl mx-auto">
			{#if isLoading}
				<div class="sedna-card text-center py-16">
					<div class="text-6xl mb-6">🤖</div>
					<h2 class="text-3xl font-retro-bold text-sedna-cool-blue mb-4">
						Generating AI Question...
					</h2>
					<p class="sedna-text">
						{ollamaStatus ? 'Using local AI model...' : 'Using pre-generated questions...'}
					</p>
					<div class="mt-8">
						<h3 class="text-xl font-retro-bold text-sedna-orange mb-4">While you wait, here's a fun fact:</h3>
						<ul class="text-lg text-sedna-steel-blue-tint max-w-xl mx-auto">
							<li>{didYouKnowFacts[currentFactIndex]}</li>
						</ul>
					</div>
				</div>
			{:else if currentQuestion}
				<div class="sedna-card {showAnswer ? (answerResult?.isCorrect ? 'correct-pop' : 'shake-card') : ''}">
					<div class="text-center mb-8">
						<h2 class="text-2xl md:text-3xl font-retro-bold text-sedna-orange mb-4">
							MYTH OR FACT?
						</h2>
					</div>
					<div class="bg-sedna-light-grey border-2 border-sedna-cool-blue rounded-lg p-8 mb-8">
						<p class="sedna-text text-xl md:text-2xl text-center leading-relaxed">
							"{currentQuestion.statement}"
						</p>
					</div>
					{#if !showAnswer}
						<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
							<button
								class="sedna-btn sedna-btn-secondary text-2xl py-8 px-12"
								on:click={() => handleAnswer(false)}
							>
								🚫 MYTH
							</button>
							<button
								class="sedna-btn sedna-btn-accent text-2xl py-8 px-12"
								on:click={() => handleAnswer(true)}
							>
								✅ FACT
							</button>
						</div>
					{:else if answerResult}
						<div>
							<div class="text-center mb-6">
								{#if answerResult.isCorrect}
									<div class="text-6xl mb-4">🎉</div>
									<h3 class="text-3xl font-retro-bold text-sedna-cool-blue mb-2">
										CORRECT!
									</h3>
								{:else}
									<div class="text-6xl mb-4">❌</div>
									<h3 class="text-3xl font-retro-bold text-sedna-orange mb-2">
										INCORRECT!
									</h3>
								{/if}
							</div>
							<div class="bg-sedna-light-grey border-2 border-sedna-cool-blue rounded-lg p-6 mb-6">
								<p class="sedna-text text-lg whitespace-pre-line">
									{answerResult.feedback}
								</p>
							</div>
							{#if answerResult.showLearnMore}
								<div class="bg-sedna-light-grey border-2 border-sedna-orange rounded-lg p-6 mb-6">
									<h4 class="text-xl font-retro-bold text-sedna-orange mb-3">
										💡 Sedna Did This:
									</h4>
									<p class="sedna-text mb-4">
										{answerResult.sednaTip}
									</p>
									<button
										class="sedna-btn sedna-btn-accent"
										on:click={handleShowCaseStudy}
									>
										📚 LEARN MORE
									</button>
								</div>
							{/if}
							<div class="flex flex-col md:flex-row items-center justify-center gap-6">
								<button
									class="sedna-btn sedna-btn-accent {(!isGeneratingQuestion && nextQuestion) ? 'pulse' : ''} text-2xl py-6 px-10"
									on:click={handleNextQuestion}
									disabled={isGeneratingQuestion || !nextQuestion}
									title={!nextQuestion ? 'Please wait for question to finish generating' : ''}
								>
									{isGeneratingQuestion ? '🔄 LOADING...' : nextQuestion ? '🎯 NEXT QUESTION' : '⏳ GENERATING QUESTION'}
								</button>
								<button
									class="sedna-btn sedna-btn-secondary text-2xl py-6 px-10"
									on:click={handleResetGame}
								>
									🔄 RESET GAME
								</button>
							</div>
							{#if isPreloadingNext}
								<div class="text-center mt-4">
									<p class="sedna-text text-sedna-dark-grey text-sm">
										⚡ Preloading next question...
									</p>
								</div>
							{:else if !nextQuestion && showAnswer}
								<div class="text-center mt-4">
									<p class="sedna-text text-sedna-dark-grey text-sm">
										⏳ Preparing next question...
									</p>
								</div>
							{/if}
						</div>
					{/if}
				</div>
			{/if}
		</div>
		<div class="text-center mt-12">
			<p class="sedna-text text-sedna-dark-grey">
				Powered by <span class="sedna-highlight">Sedna Consulting Group</span>
			</p>
		</div>
	</div>
</div>

<!-- Modals -->
{#if showCaseStudyModal && answerResult}
	<CaseStudyModal
		{answerResult}
		on:close={() => showCaseStudyModal = false}
	/>
{/if}

{#if showStatsModal}
	<StatsModal
		on:close={() => showStatsModal = false}
		on:reset={handleResetGame}
	/>
{/if}

{#if showDifficultyModal}
	<div class="sedna-modal" on:click={() => showDifficultyModal = false}>
		<div class="sedna-modal-content" on:click|stopPropagation>
			<div class="flex justify-between items-start mb-6">
				<h2 class="text-3xl md:text-4xl font-retro-bold text-sedna-cool-blue mb-2">
					⚙️ CHANGE DIFFICULTY
				</h2>
				<button
					class="text-4xl text-sedna-dark-grey hover:text-sedna-cool-blue transition-colors"
					on:click={() => showDifficultyModal = false}
				>
					×
				</button>
			</div>
			
			<div class="space-y-6">
				<div class="bg-sedna-light-grey border-2 border-sedna-orange rounded-lg p-6">
					<h3 class="text-xl font-retro-bold text-sedna-orange mb-3">
						🎯 Choose Your Challenge Level:
					</h3>
					<div class="space-y-4">
						<button
							class="w-full sedna-btn sedna-btn-secondary text-left p-4"
							on:click={() => handleDifficultyChange('easy')}
						>
							<div class="flex justify-between items-center">
								<div>
									<div class="text-lg font-retro-bold">🌱 EASY</div>
									<div class="text-sm">Basic AI concepts, simple language</div>
								</div>
								<div class="text-2xl">10 pts</div>
							</div>
						</button>
						
						<button
							class="w-full sedna-btn text-left p-4"
							on:click={() => handleDifficultyChange('medium')}
						>
							<div class="flex justify-between items-center">
								<div>
									<div class="text-lg font-retro-bold">🎯 MEDIUM</div>
									<div class="text-sm">Moderate complexity, some technical terms</div>
								</div>
								<div class="text-2xl">20 pts</div>
							</div>
						</button>
						
						<button
							class="w-full sedna-btn sedna-btn-accent text-left p-4"
							on:click={() => handleDifficultyChange('hard')}
						>
							<div class="flex justify-between items-center">
								<div>
									<div class="text-lg font-retro-bold">🔥 HARD</div>
									<div class="text-sm">Advanced concepts, technical language</div>
								</div>
								<div class="text-2xl">30 pts</div>
							</div>
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
{/if} 