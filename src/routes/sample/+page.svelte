<script lang="ts">
import { onMount, onDestroy } from 'svelte';
import { goto } from '$app/navigation';

// Sample fallback question
const sampleQuestion = {
  statement: 'AI can completely replace human cybersecurity analysts in detecting threats.',
  isFact: false,
  explanation: 'While AI can assist in threat detection, human analysts are still essential for context, decision-making, and handling complex scenarios that require human judgment.',
  sednaTip: {
    id: 1,
    tip: 'AI can help, but not fully replace, human experts in cybersecurity.',
    caseStudy: 'Sedna helped a national cybersecurity agency stop data leaks using AI, achieving zero malicious exfiltrations for three years.'
  }
};

let questionReady = false;
let interval: any;

onMount(() => {
  // Poll for preloaded question flag
  interval = setInterval(() => {
    questionReady = localStorage.getItem('sedna_first_question_preloaded') === 'true';
  }, 500);
});

onDestroy(() => {
  clearInterval(interval);
});

function handlePlayForReal() {
  if (questionReady) {
    goto('/gameshow');
  } else {
    goto('/waiting');
  }
}
</script>

<svelte:head>
  <title>How to Play - Sedna AI Gameshow</title>
</svelte:head>

<div class="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-sedna-cool-blue via-sedna-dark-blue to-sedna-navy p-4">
  <div class="max-w-4xl w-full bg-white rounded-xl shadow-xl p-8 flex flex-col gap-8">
    <h2 class="text-3xl font-retro-bold text-sedna-orange mb-2 text-center">How to Play</h2>
    <div class="flex flex-col md:flex-row gap-8">
      <div class="flex-1 flex flex-col gap-6">
        <div class="bg-sedna-pale-blue-grey border-2 border-sedna-cool-blue rounded-lg p-6 relative">
          <div class="absolute -top-6 left-1/2 -translate-x-1/2 bg-sedna-bright-yellow text-sedna-dark-slate-blue px-4 py-1 rounded-full font-bold shadow">Game UI Preview</div>
          <div class="flex flex-col gap-4">
            <div class="flex justify-center gap-4 mb-2">
              <div class="flex flex-col items-center">
                <button class="sedna-btn text-lg px-4 py-2 opacity-80 cursor-default bg-sedna-muted-gold text-white border-sedna-muted-gold">🏠 HOME</button>
                <span class="text-xs text-sedna-steel-blue-tint mt-1">Go back to start</span>
              </div>
              <div class="flex flex-col items-center">
                <button class="sedna-btn text-lg px-4 py-2 opacity-80 cursor-default bg-sedna-muted-gold text-white border-sedna-muted-gold">📊 STATS</button>
                <span class="text-xs text-sedna-steel-blue-tint mt-1">See your stats</span>
              </div>
              <div class="flex flex-col items-center">
                <button class="sedna-btn sedna-btn-accent text-lg px-4 py-2 opacity-80 cursor-default">⚙️ DIFFICULTY</button>
                <span class="text-xs text-sedna-steel-blue-tint mt-1">Change difficulty</span>
              </div>
              <div class="flex flex-col items-center">
                <div class="ml-2 sedna-badge text-base bg-sedna-muted-gold text-white border-sedna-muted-gold">Level: MEDIUM</div>
                <span class="text-xs text-sedna-steel-blue-tint mt-1">Current level</span>
              </div>
            </div>
            <div class="sedna-card mt-2">
              <div class="text-center mb-4">
                <h3 class="text-xl font-retro-bold text-sedna-orange mb-2">MYTH OR FACT?</h3>
              </div>
              <div class="bg-sedna-light-grey border-2 border-sedna-cool-blue rounded-lg p-4 mb-4">
                <p class="sedna-text text-lg text-center leading-relaxed">
                  "AI can completely replace human cybersecurity analysts in detecting threats."
                </p>
              </div>
              <div class="grid grid-cols-2 gap-4 mb-4">
                <button class="sedna-btn text-lg py-4 px-6 opacity-80 cursor-default bg-sedna-pale-blue-grey text-sedna-dark-slate-blue border-sedna-pale-blue-grey">🚫 MYTH</button>
                <button class="sedna-btn sedna-btn-accent text-lg py-4 px-6 opacity-80 cursor-default">✅ FACT</button>
              </div>
              <div class="bg-white border border-sedna-orange rounded-lg p-4 mb-2">
                <div class="font-bold text-sedna-orange mb-1">Answer: <span class="text-sedna-cool-blue">MYTH</span></div>
                <div class="font-bold text-sedna-orange mb-1">Explanation:</div>
                <div class="text-gray-700">While AI can assist in threat detection, human analysts are still essential for context, decision-making, and handling complex scenarios that require human judgment.</div>
              </div>
              <div class="bg-blue-50 p-3 rounded-lg">
                <strong class="text-blue-800">💡 Sedna Tip:</strong>
                <div class="text-blue-700 mt-1">AI can help, but not fully replace, human experts in cybersecurity.</div>
              </div>
              <div class="flex justify-center gap-4 mt-6">
                <button class="sedna-btn sedna-btn-accent text-lg py-4 px-8 opacity-80 cursor-default">🎯 NEXT QUESTION</button>
                <button class="sedna-btn text-lg py-4 px-8 opacity-80 cursor-default bg-sedna-pale-blue-grey text-sedna-dark-slate-blue border-sedna-pale-blue-grey">🔄 RESET GAME</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="flex-1 flex flex-col gap-6 justify-center">
        <div class="bg-sedna-muted-gold text-white rounded-lg p-6 shadow-md">
          <h4 class="text-2xl font-retro-bold mb-2">How to Win</h4>
          <ul class="list-disc pl-6 text-lg mb-2">
            <li>Your goal: <span class="font-bold">Reach 100 points</span> by answering questions correctly.</li>
            <li>Each correct answer gives you points based on your chosen difficulty.</li>
            <li>You can change your difficulty at any time for more challenge and higher points per question.</li>
            <li>Check your progress and stats with the <span class="font-bold">📊 STATS</span> button.</li>
            <li>Use <span class="font-bold">RESET GAME</span> to start over at any time.</li>
          </ul>
        </div>
        <div class="bg-sedna-pale-blue-grey border-2 border-sedna-cool-blue rounded-lg p-6">
          <h4 class="text-xl font-retro-bold text-sedna-cool-blue mb-2">Tips</h4>
          <ul class="list-disc pl-6 text-base">
            <li>Look for the <span class="font-bold">⚙️ DIFFICULTY</span> button at the top to change your level.</li>
            <li>Click <span class="font-bold">📊 STATS</span> to see your score, accuracy, and progress.</li>
            <li>Use <span class="font-bold">HOME</span> to return to the start page at any time.</li>
            <li>Try to answer quickly and accurately for the best experience!</li>
          </ul>
        </div>
      </div>
    </div>
    <!-- Centered Play for Real button below both columns -->
    <div class="mt-6 flex flex-col items-center">
      <button
        class="sedna-btn sedna-btn-accent text-2xl py-4 px-10 w-full max-w-xs mx-auto {questionReady ? 'pulse' : ''}"
        on:click={handlePlayForReal}
        disabled={!questionReady}
      >
        {questionReady ? '🎮 PLAY FOR REAL' : '⏳ Generating question...'}
      </button>
      <div class="text-center text-sedna-steel-blue-tint text-base mt-4 max-w-lg">
        After you answer a question, you'll see a <span class="font-bold">Generating...</span> message while the next question is being generated in real time by the AI. When it's ready, the <span class="font-bold">Next Question</span> button will glow to let you know you can continue!
      </div>
    </div>
  </div>
</div> 