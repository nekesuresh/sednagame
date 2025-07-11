import { h as head, k as attr, m as attr_class, e as escape_html, c as pop, p as push, j as stringify } from "../../../chunks/index.js";
import "../../../chunks/client.js";
import "../../../chunks/AnswerHandler.js";
import "../../../chunks/userdb.js";
function _page($$payload, $$props) {
  push();
  let name = "";
  let occupation = "";
  let aiConcern = "";
  let difficulty = "";
  let isSubmitting = false;
  let phone = "";
  let email = "";
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>Setup - Sedna AI Gameshow</title>`;
  });
  $$payload.out += `<div class="sedna-section-bg min-h-screen"><div class="max-w-2xl mx-auto py-12 md:py-16 lg:py-20"><div class="text-center mb-12"><h1 class="sedna-header mb-6">🎮 PLAYER SETUP</h1> <p class="sedna-subheader">Tell us about yourself to personalize your AI learning experience</p></div> <div class="sedna-card"><form class="space-y-8"><div><label class="block text-xl font-retro-bold text-sedna-navy mb-3">🎯 Choose your difficulty level:</label> <div class="grid grid-cols-1 md:grid-cols-3 gap-4"><label class="cursor-pointer block"><input type="radio"${attr("checked", difficulty === "easy", true)} value="easy" class="sr-only"/> <div${attr_class(`bg-white border-2 rounded-xl p-4 text-center transition-all duration-200 hover:shadow-lg ${stringify("border-sedna-dark-slate-blue hover:border-sedna-bright-yellow")}`)}><div class="text-3xl mb-2">🌱</div> <div class="font-retro-bold text-lg text-sedna-dark-slate-blue">EASY</div> <div class="text-sm text-sedna-steel-blue-tint">Basic concepts</div> <div class="text-xs text-sedna-bright-yellow mt-1 font-bold">10 pts</div></div></label> <label class="cursor-pointer block"><input type="radio"${attr("checked", difficulty === "medium", true)} value="medium" class="sr-only"/> <div${attr_class(`bg-white border-2 rounded-xl p-4 text-center transition-all duration-200 hover:shadow-lg ${stringify("border-sedna-dark-slate-blue hover:border-sedna-bright-yellow")}`)}><div class="text-3xl mb-2">🎯</div> <div class="font-retro-bold text-lg text-sedna-dark-slate-blue">MEDIUM</div> <div class="text-sm text-sedna-steel-blue-tint">Moderate complexity</div> <div class="text-xs text-sedna-bright-yellow mt-1 font-bold">20 pts</div></div></label> <label class="cursor-pointer block"><input type="radio"${attr("checked", difficulty === "hard", true)} value="hard" class="sr-only"/> <div${attr_class(`bg-white border-2 rounded-xl p-4 text-center transition-all duration-200 hover:shadow-lg ${stringify("border-sedna-dark-slate-blue hover:border-sedna-bright-yellow")}`)}><div class="text-3xl mb-2">🔥</div> <div class="font-retro-bold text-lg text-sedna-dark-slate-blue">HARD</div> <div class="text-sm text-sedna-steel-blue-tint">Advanced concepts</div> <div class="text-xs text-sedna-bright-yellow mt-1 font-bold">30 pts</div></div></label></div> `;
  {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--></div> <div><label for="name" class="block text-xl font-retro-bold text-sedna-navy mb-3">👤 What's your name?</label> <input id="name" type="text"${attr("value", name)} class="sedna-input w-full text-xl" placeholder="Enter your name..." required autocomplete="name"/></div> <div><label for="occupation" class="block text-xl font-retro-bold text-sedna-navy mb-3">💼 What's your job title?</label> <input id="occupation" type="text"${attr("value", occupation)} class="sedna-input w-full text-xl" placeholder="Enter your occupation..." required/></div> <div><label for="aiConcern" class="block text-xl font-retro-bold text-sedna-navy mb-3">🤔 What's your biggest concern about AI?</label> <input id="aiConcern" type="text"${attr("value", aiConcern)} class="sedna-input w-full text-xl" placeholder="Enter your main concern about AI..." required/></div> <div><label for="phone" class="block text-xl font-retro-bold text-sedna-navy mb-3">📱 Phone Number</label> <input id="phone" type="tel"${attr("value", phone)} class="sedna-input w-full text-xl" placeholder="Enter your phone number..." required autocomplete="tel"/></div> <div><label for="email" class="block text-xl font-retro-bold text-sedna-navy mb-3">✉️ Email Address</label> <input id="email" type="email"${attr("value", email)} class="sedna-input w-full text-xl" placeholder="Enter your email address..." required autocomplete="email"/></div> <div class="text-center pt-6"><button type="submit" class="sedna-btn sedna-btn-accent text-2xl py-6 px-12"${attr("disabled", isSubmitting, true)}>${escape_html("🚀 START GAME")}</button></div></form></div></div></div>`;
  pop();
}
export {
  _page as default
};
