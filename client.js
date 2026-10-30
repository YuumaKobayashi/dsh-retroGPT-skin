window.__ModuleLoader__.load({
	id: "dsh-retrogpt-skin",
	factory(require) {
		const React = require("react");

		const SOURCE = "dsh-retrogpt-skin";
		const ROOT_ATTR = "data-rgs-skin";
		const STYLE_ATTR = "data-rgs-styles";
		const PREFS_KEY = "dsh-retrogpt-skin:ui:v1";

		/**
		 * Colour layer. Every value is a { light, dark } pair so the host keeps
		 * owning the light/dark switch; the skin never forces a scheme on its own.
		 */
		const TOKENS = {
			"--dsw-alias-bg-base": { light: "#FFFFFF", dark: "#000000" },
			"--dsw-alias-bg-layer-1": { light: "#FFFFFF", dark: "#171717" },
			"--dsw-alias-bg-layer-2": { light: "#F7F7F8", dark: "#212121" },
			"--dsw-alias-bg-overlay": { light: "#FFFFFF", dark: "#2F2F2F" },
			"--dsw-alias-bg-module-platform": { light: "#F7F7F8", dark: "#212121" },
			"--dsw-alias-border-l1": { light: "#E5E5E5", dark: "#333333" },
			"--dsw-alias-border-l2": { light: "#D9D9E3", dark: "#404040" },
			"--dsw-alias-border-l3": { light: "#EFEFF1", dark: "#333333" },
			"--dsw-alias-border-l4": { light: "#ECECF1", dark: "#2A2A2A" },
			"--dsw-alias-label-primary": { light: "#202123", dark: "#ECECEC" },
			"--dsw-alias-label-secondary": { light: "#6E6E80", dark: "#A1A1AA" },
			"--dsw-alias-brand-primary": { light: "#10A37F", dark: "#10A37F" },
			"--dsw-alias-markdown-code-block": { light: "#0D0D0D", dark: "#0D0D0D" },
			"--dsw-alias-state-success": { light: "#10A37F", dark: "#19C37D" },
			"--dsw-alias-state-error": { light: "#EF4146", dark: "#F36C6C" },
			"--dsw-alias-state-warn": { light: "#B8860B", dark: "#F5A623" },
			"--dsw-alias-state-idle": { light: "#8E8EA0", dark: "#A1A1AA" },
			"--dsw-alias-interactive-bg-hover": { light: "#F4F4F5", dark: "#2A2B32" },
			"--dsw-specific-sidebar-fill": { light: "#202123", dark: "#202123" },
			"--dsw-specific-bubble": { light: "#FFFFFF", dark: "#000000" },
			"--dsw-specific-input-major": { light: "#FFFFFF", dark: "#171717" },
			"--dsw-alias-scrollbar-bg-l1": { light: "#E5E5E5", dark: "#333333" },
			"--dsw-alias-scrollbar-hover-l1": { light: "#C5C5D2", dark: "#4A4A4A" },
		};

		/* Assistant marks, inlined as data URIs by tools/inline-art.py. */
		const AI_ART_GPT = "data:image/png;base64,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";
		const AI_ART_WHALE = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAQAAAD/5HvMAAAFJ0lEQVR42u2Zb2hVZRzHv+fs/+Y2ppZr/mk1jBU6zT/LZmBNNNKC7IVhYlGKFhkRagaFiFEkgr6KBN8EgUg07A8l7UVovsjMBJElidgUGTNZsq6369nZuZ9e3LOzc+6f3XPvVhSc53mxu/Pc53k+5/l9n9/z+z3XQP+tYioCioAioAgoAoqAIqAI6H8IZMrI+tz4t4EMTdIibVWPXlJVRuudek4VBY9J2FrGVGbRylzauJdG7qKVlZxgpLRm9HgV2E49KqSG+ZLJPazlAD3cdCe36KcPf4lTk9FvFwBf00ZJllENDIxigGrY4ZvYwcHxfR4pvRmTGuwFLAB2UxFoK6WNdlpoLhyonn1AAgvbN30QJlXWYab13YSNg40FvE0FJhU00MJy3uE8h1hUOFALXYCVMXlmcYBtaUid7nMHCzjMPrro8XoMMp+6woCqOAokCFcsYE0AaRqnvHW1ve/ZxIlh0U1doRpaT5xYiNUZRYrzLpU+Fa3zvZDlM3wM2FDoLmvkuCfKcCWlq7co9cao5ECWMSzgOxoKA6rgoCtHp4A1crCBj33amMK3PoONjLQ3i5PIA7QAiAcsb4cEs4E9vlVayGVP3BDnOgepKtwxjlp/gEHfZGPvuNQKWcB2b9IqDnlmO0sHtdmkPFpLs54nJVogaVg/6jOdUKXmaZmaNFMzJUnDOXpJpkxJ5Upqn1r0moYlWfpdUlLSH1ql/uLOsmq6gMPUu29jUEINzWzkEwaARI516uc4DhY2NrCLx1jKei66htyb4TpDmsykkXPAqixt5TxBb0Cgo+UmT9LIBz7jBfffymIP13Jmcx14NGsXg+ls5WoakgNcZCoGDazhKg4OCWJYrups4P5igaqYQwJYm7ObQQf9ASQHOE+t295OPM1dOMRpCgNkZpVVUrcl1YwhvB/Uqe9latj3dIrudmPEM9rpClzuNjD1lQaLDdBKaaYXeJ18R++FNKd3gTZvjPVpvnlDGElnN5nBVE4D+ynL030xl3yGs4Bj3lk2LSDpOA+MJ2KspAu4xNK8AyzD8XZUSjXPY2JQxuqA7z4ylnfOD1TCfgBOeTLNVUvY4zObjUM/L7OC1XR7QAkcto7tn/MBGWzG4QawOO8QVXzoc5SpvzFigXgb2sMG+WYOpV+RKVNJPZI3t0pol24rqaR7eCQ1rGpNcv+XhlStn/XLeNOgJi5jkeAyM/O+lcGWDDfp+I7j08wZfxpkstk9kc4yOUTOtjvH+R8Htk1MXlbLEXfAN0IIsp7zOeLsk9lC+eISxacBCxuLjgwkk7o0R9eRNaQ9nCtULQaonpPulrZ5PK1tBh+xmsaAA3jRDXlH99sA8wvDyZeXzaPPzapu8lBgRe7gOAOcZXkgy3iKhBdTOsAgD08skHjGl1Vt8kXKTQy4k37pM0oZ72O54aoDWLzi6xOqluwe2yv8qrgeVLlsSZ1CfUooqRrt0AolZeqW5mq6flLM9SG9WqhZuiVHSQ2rRMsU12/6ayKvYwxWuTsmpabPeY9P03ZSL8+6Bi1jS4a4e5gbfoUMwlxLdWqnVmhIQ6p2ffuQyr321Oc3dVS2HDVriaQ/1aD7NEN16tMXOqYbE31hVctOLyFOZOSiKRfaSy+nWU45BsKgnDom5z2ei7iwGhHsEvYHQvfMcoYXfLuuqBrGZP68q06t2qhNgafD6tY3OqdLGpA93vtTo4hfpWs1W+1qV0JDuqJruqhrio0fpXig6OI8AoqAIqAIKAKKgCKgCOgfLH8D6zajHpgw8W0AAAAASUVORK5CYII=";

		/* thin outline paper plane (the retro sender), drawn with strokes so the mask
		   keeps only the outline; both paths are part of the same glyph */
		const SEND_PLANE_SVG =
			"data:image/svg+xml," +
			encodeURIComponent(
				"<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='#000' stroke-width='1.9' stroke-linecap='round' stroke-linejoin='round'>" +
					"<path d='M22 2 11 13'/>" +
					"<path d='M22 2 15 22 11 13 2 9 22 2Z'/>" +
					"</svg>",
			);

		const DEFAULT_PREFS = {
			aiAvatar: "gpt",
			fontSize: 15,
			planeSend: true,
			typewriter: true,
			userAvatarColor: "#6D5AE6",
			userAvatarImage: "",
			/* "" follows the Harness locale; "zh" / "en" pin this skin's own copy. */
			lang: "",
		};
		const FONT_RANGE = { min: 13, max: 18 };
		const AVATAR_COLORS = ["#6D5AE6", "#10A37F", "#2563EB", "#D97706", "#DC2626", "#0F172A"];
		const IMAGE_LIMIT = 400 * 1024;

		/**
		 * Structure/typography layer.
		 *
		 * Version-adaptation layer, pinned to @deepseek-ai/dsh-desktop-runtime 0.2.1-rc.3:
		 *   - `[data-chat-flow-kind]` — stable attribute on every message row
		 *     (values: user, assistant-step, tool-call, turn-process, ...). Preferred hook.
		 *   - `[data-chat-turn]`, `[data-conversation-content]`, `[data-conversation-scroll]`,
		 *     `[data-composer-card]` — stable attributes used for the sheet and the composer.
		 *   - `[class*="_column"]` / `_scroll` / `_userRow` / `_userStack` / `_bubble` — CSS-module
		 *     classes whose hashed prefix changes per build; only the readable suffix is matched.
		 *   - `button[class*="_primary"]:has(> svg > path)` — the send button renders an arrow path
		 *     while idle and a stop `rect` while streaming, so `:has()` keeps stop untouched.
		 * Everything is scoped under `html[data-rgs-skin]`, so removing the attribute (or the
		 * style element) fully reverts the host.
		 */
		const STYLES = `
:root[data-rgs-skin] {
	--rgs-font-size: 15px;
	--rgs-page-band: #FFFFFF;
	--rgs-user-band: #FFFFFF;
	--rgs-ai-band: #ECECEC;
	--rgs-line: #DCDCDC;
	--rgs-ink: #202123;
	--rgs-plane: #8E8E8E;
	--rgs-ai-avatar: #10A37F;
	--rgs-user-avatar: var(--rgs-user-avatar-color, #6D5AE6);
	--rgs-input-bg: #FFFFFF;
	--rgs-ai-image: url("${AI_ART_GPT}");
	--dsh-chat-flow-gap: 0px;
	--dsh-content-font-size: var(--rgs-font-size, 15px);
	--dsh-content-font-delta: 1.5px;
}

:root[data-rgs-skin][data-rgs-ai-avatar="whale"] {
	--rgs-ai-image: url("${AI_ART_WHALE}");
}

:root[data-rgs-skin] body[data-ds-dark-theme] {
	/* the classic dark pair: page/user #343541, reply sheet #444654 */
	--rgs-page-band: #343541;
	--rgs-user-band: #343541;
	--rgs-ai-band: #444654;
	--rgs-line: #4A4B57;
	--rgs-ink: #ECECEC;
	--rgs-plane: #A1A1AA;
	--rgs-input-bg: #40414F;
}

/* ---------- sidebar: always the dark retro column ---------- */

:root[data-rgs-skin] [data-slot="sidebar"] {
	--dsw-alias-label-primary: #ECECEC;
	--dsw-alias-label-secondary: #A1A1AA;
	--dsw-alias-border-l1: #35363C;
	--dsw-alias-border-l3: #35363C;
	--dsw-alias-interactive-bg-hover: #2A2B32;
	--dsw-alias-bg-layer-1: #2A2B32;
	--dsw-alias-bg-layer-2: #2F3037;
	--dsw-specific-sidebar-fill: #202123;
	/* the "HARNESS" badge in the wordmark paints its plate with currentColor
	   (#ECECEC here) and its letters with the inverted label alias, so inside the
	   always-dark column those letters have to be dark ink in both themes — the
	   light theme would otherwise hand them white-on-white. */
	--dsw-alias-label-primary-inverted: #202123;
	color-scheme: dark;
}

/* Light theme only: the new-session row is a white pill here, so its inherited
   light ink turns the label and the plus icon invisible. Only that row is
   re-inked — the brand row keeps the column's light ink. */
:root[data-rgs-skin][data-rgs-theme="light"] [data-slot="sidebar"] [class*="_newSession"],
:root[data-rgs-skin][data-rgs-theme="light"] [data-slot="sidebar"] [class*="_newSession"] * {
	color: #202123;
}

/* ---------- transcript sheet: one continuous AI band ---------- */

/* The chat pane itself is the AI sheet: painting the scrolling element (instead
   of extruding a shadow from the column) makes the AI colour reach both edges of
   the transcript, so nothing shows as a pair of side bars and the host's own row
   gaps, margins and extra row kinds all sit on one continuous block. */
:root[data-rgs-skin] [data-conversation-content] {
	--dsh-chat-content-width: 760px;
}

/* the conversation seat (header + transcript + composer) carries the page colour,
   so the user turns, the composer row and the header all sit on it — in dark mode
   that is the classic #343541, not the host's pure black. The bg-base alias is
   re-mapped inside the subtree too, because the host paints the conversation root
   with that token and would otherwise cover this colour. */
:root[data-rgs-skin] [data-slot="main.conversation"] {
	--dsw-alias-bg-base: var(--rgs-page-band);
	background-color: var(--rgs-page-band);
}

:root[data-rgs-skin] [data-conversation-scroll] {
	background-color: var(--rgs-ai-band);
}

/* every flow row keeps the avatar gutter and stays transparent, so the sheet
   colour shows through the host's own gaps and margins */
:root[data-rgs-skin] [data-chat-flow-kind] {
	position: relative;
	padding-left: 72px;
	padding-right: 24px;
	background: transparent;
	font-size: var(--rgs-font-size, 15px);
}

/* the reply reserves a gutter on the right so the floating actions never sit on
   top of text or code — same idea as the reference layout, where the thumbs live
   outside the text column */
:root[data-rgs-skin] [data-chat-flow-kind="assistant-step"] {
	padding-right: 96px;
}

/* A reply whose FIRST block is a card (the edited-files card, tool output) has
   content against its own top edge, so the lifted action row would sit on the
   card. client.js marks those rows; the strip below is what the actions land in.
   The value lives here, not in JS, so tweaking the gap needs no re-apply. */
:root[data-rgs-skin] [data-chat-flow-kind="assistant-step"][data-rgs-card-first] {
	padding-top: 52px;
}

/* Typewriter caret. While a turn streams, client.js marks the newest reply row
   with [data-rgs-typing] and picks exactly ONE text block inside it — the last one
   in document order — with [data-rgs-caret]. Matching :last-child alone drew a caret
   for every block that happened to close its parent (a paragraph AND the list item
   inside it), so the block is chosen once in JS instead. Nothing inside the host
   markdown is rewritten — the host still owns every character it renders. */
:root[data-rgs-skin][data-rgs-typewriter="on"] [data-rgs-caret]::after {
	content: "";
	display: inline-block;
	width: 0.5em;
	height: 1.05em;
	margin-left: 2px;
	background: currentColor;
	border-radius: 1px;
	vertical-align: -0.18em;
	animation: rgs-caret 1.05s steps(1, end) infinite;
}

@keyframes rgs-caret {
	0%,
	55% {
		opacity: 1;
	}
	56%,
	100% {
		opacity: 0;
	}
}

@media (prefers-reduced-motion: reduce) {
	:root[data-rgs-skin][data-rgs-typewriter="on"] [data-rgs-caret]::after {
		animation: none;
	}
}

/* The host renders the reply's actions (copy / thumbs / regenerate) and its usage
   line ("本轮费用 …") in the turn tail row that follows the answer. The tail row is
   the only element that owns them, so it becomes the anchor: it stays in flow, and
   the actions are lifted to the top of the answer row by a measured offset (the
   distance between the two rows), which client-side code keeps up to date.
   Its own vertical padding keeps that footer from sitting on the rule above it and
   on the band boundary below it. */
:root[data-rgs-skin] [data-turn-tail] {
	position: relative;
	padding-top: 8px;
	padding-bottom: 20px;
}

:root[data-rgs-skin] [data-turn-tail] [class*="_actions"] {
	position: absolute;
	top: 0;
	right: 0;
	margin: 0;
	z-index: 2;
	transform: translateY(calc(-1 * var(--rgs-actions-lift, 0px)));
}

/* user turns break the sheet with a full-bleed band of their own */
:root[data-rgs-skin] [data-chat-flow-kind="user"] {
	padding-top: 16px;
	padding-bottom: 16px;
	background: var(--rgs-user-band);
	box-shadow: 0 0 0 100vmax var(--rgs-user-band);
	clip-path: inset(0 -100vmax);
}

/* a border would stop at the 760px row box while the band reaches the pane edges,
   so the hairline is extruded the same way the band is: one 1px pseudo-line at the
   bottom edge of the user band — exactly where the black band meets the grey sheet */
:root[data-rgs-skin] [data-chat-flow-kind="user"]::after {
	content: "";
	position: absolute;
	bottom: 0;
	left: 0;
	right: 0;
	height: 1px;
	background: var(--rgs-line);
	box-shadow: 0 0 0 100vmax var(--rgs-line);
	clip-path: inset(0 -100vmax);
	pointer-events: none;
}

:root[data-rgs-skin] [data-chat-flow-kind="user"]::before,
:root[data-rgs-skin] [data-chat-flow-kind="assistant-step"]::before {
	content: "";
	position: absolute;
	left: 24px;
	width: 30px;
	height: 30px;
	border-radius: 4px;
	box-sizing: border-box;
	background-repeat: no-repeat;
	background-position: center;
	background-size: 20px 20px;
}

:root[data-rgs-skin] [data-chat-flow-kind="user"]::before {
	content: "U";
	top: calc(16px + (1.6 * var(--rgs-font-size, 15px) - 30px) / 2);
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 14px;
	font-weight: 600;
	line-height: 1;
	color: #FFFFFF;
	background-color: var(--rgs-user-avatar);
	font-family: var(--dsh-font-family-text-default, inherit);
}

/* a picture chosen in the settings panel replaces the letter tile on every user turn */
:root[data-rgs-skin][data-rgs-user-avatar="image"] [data-chat-flow-kind="user"]::before {
	content: "";
	background-color: transparent;
	background-image: var(--rgs-user-image);
	background-size: cover;
	background-position: center;
}

/* One mark per turn, on the turn's FIRST answer row — the reference layout never
   repeats the mark for every step of a thinking turn. client.js marks that row with
   [data-rgs-turn-start] (a turn boundary is the user row, so grouping is only
   expressible in JS; plain CSS cannot scope "first sibling since the last user row").
   The sibling rule below is the CSS-only fallback for the common shape (answer right
   after the user turn), so the mark still shows if the scan ever fails to run.
   Rows without either signal simply keep the text gutter.
   The tile's top centres it on the first text line. The two kinds differ: a user row
   carries 16px of its own vertical padding, an answer row starts its first line at
   the row's top edge (measured: text centre ≈ 12.4px below the row top at 15px font,
   i.e. line-height/2 with no padding). So the offset is derived from the skin's font
   size instead of a constant. */
:root[data-rgs-skin] [data-chat-flow-kind="assistant-step"][data-rgs-turn-start]::before,
:root[data-rgs-skin] [data-chat-flow-kind="user"] + [data-chat-flow-kind="assistant-step"]:not([data-chat-group-part="reasoning"])::before,
:root[data-rgs-skin] [class*="_column"] > [data-chat-flow-kind="assistant-step"]:first-child::before {
	top: calc((1.6 * var(--rgs-font-size, 15px) - 30px) / 2);
	background-color: var(--rgs-ai-avatar);
	background-image: var(--rgs-ai-image);
}

/* the user turn loses its bubble: full-bleed band, same text position as the AI.
   These inner rules are deliberately NOT keyed on [data-chat-flow-kind="user"]:
   a freshly sent message is painted once before its flow row carries the kind (or
   inside the pending wrapper), and keying on the kind let that first frame keep the
   host's right-aligned layout before snapping left. The user node's own module
   classes are unique to it, so matching them alone is both safe and immediate. */
:root[data-rgs-skin] [class*="_userRow"] {
	width: 100%;
	align-items: stretch;
	gap: 0;
}

:root[data-rgs-skin] [class*="_userStack"] {
	max-width: 100%;
	align-items: flex-start;
	gap: 0;
}

:root[data-rgs-skin] [class*="_userRow"] [class*="_bubble"],
:root[data-rgs-skin] [class*="_userStack"] [class*="_bubble"] {
	background: transparent;
	border-radius: 0;
	padding: 0;
	max-width: 100%;
	font-size: var(--rgs-font-size, 15px);
	line-height: 1.6;
}

:root[data-rgs-skin] [data-chat-flow-kind="assistant-step"] [class*="_actions"] {
	margin-top: 10px;
}

/* ---------- scroll area: bands reach the chat edges ---------- */

/* In the active phase the host sticks the composer seat over the transcript with a
   36px vertical gradient (transparent → bg-base) so scrolled text fades out. Over a
   coloured band that fade reads as a stray colour change between the transcript and
   the input row, so the seat is one flat AI-band surface instead; the important flag
   is needed because the host rule is .root[data-phase] .seat (0,3,0) and wins on
   specificity. */
:root[data-rgs-skin] [data-composer-seat] {
	background: var(--rgs-ai-band) !important;
}

:root[data-rgs-skin] [data-chat-flow-kind] + [data-chat-flow-kind] {
	margin-top: 0;
}

:root[data-rgs-skin] [data-conversation-content],
:root[data-rgs-skin] [data-conversation-scroll],
:root[data-rgs-skin] [data-slot="conversation.chat.flow"] {
	overflow-x: hidden;
}

:root[data-rgs-skin] [data-conversation-scroll] [class*="_scroll"],
:root[data-rgs-skin] [data-slot="conversation.chat.flow"] {
	padding-left: 0;
	padding-right: 0;
}

/* ---------- composer: white card, paper-plane send ---------- */

:root[data-rgs-skin] [data-composer-card] {
	background: var(--rgs-input-bg);
	border: 1px solid var(--rgs-line);
	border-radius: 12px;
	box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

:root[data-rgs-skin] [data-composer-card] [class*="_input"] {
	font-size: var(--dsh-content-font-size, 15px);
}

:root[data-rgs-skin][data-rgs-plane="on"] [data-composer-card] button[class*="_primary"]:has(> svg > path) {
	background: transparent;
	color: var(--rgs-plane);
	width: 32px;
	height: 32px;
	border-radius: 8px;
}

:root[data-rgs-skin][data-rgs-plane="on"] [data-composer-card] button[class*="_primary"]:has(> svg > path):hover,
:root[data-rgs-skin][data-rgs-plane="on"] [data-composer-card] button[class*="_primary"]:has(> svg > path):active {
	background: transparent;
	color: var(--rgs-ink);
}

:root[data-rgs-skin][data-rgs-plane="on"] [data-composer-card] button[class*="_primary"]:has(> svg > path) > svg {
	display: none;
}

:root[data-rgs-skin][data-rgs-plane="on"] [data-composer-card] button[class*="_primary"]:has(> svg > path)::after {
	content: "";
	width: 20px;
	height: 20px;
	background-color: currentColor;
	-webkit-mask: url("${SEND_PLANE_SVG}") center / contain no-repeat;
	mask: url("${SEND_PLANE_SVG}") center / contain no-repeat;
}

/* ---------- theme toggle ---------- */

/* the toggle sits in the conversation header's utilities row, immediately to the
   left of the "open in File Explorer" action (that entry is order -10), so it lines
   up with the rest of the header actions instead of floating over the transcript */
.rgs-toggle {
	display: flex;
	flex: none;
	align-items: center;
	justify-content: center;
	width: 28px;
	height: 28px;
	margin-right: 2px;
	padding: 0;
	border: 0;
	border-radius: 6px;
	background: transparent;
	color: var(--dsw-alias-label-secondary);
	cursor: pointer;
	transition: color 120ms ease, background-color 120ms ease;
}

.rgs-toggle:hover {
	color: var(--dsw-alias-label-primary);
	background: var(--dsw-alias-interactive-bg-hover);
}

.rgs-toggle:focus-visible {
	outline: 2px solid var(--dsw-alias-brand-primary);
	outline-offset: 1px;
}

.rgs-toggle svg {
	display: block;
}

/* ---------- settings section: "GPT retro UI" ---------- */

.rgs-set {
	display: flex;
	flex-direction: column;
	gap: 16px;
	width: 100%;
	max-width: 760px;
}

.rgs-set-intro {
	margin: 0;
	padding: 0 2px;
	color: var(--dsw-alias-label-secondary);
	font-size: 13px;
	line-height: 20px;
}

.rgs-set-group {
	display: flex;
	flex-direction: column;
}

.rgs-set-heading {
	padding: 0 2px 6px;
	color: var(--dsw-alias-label-primary);
	font-size: 13px;
	font-weight: 600;
	line-height: 20px;
}

.rgs-set-row {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 16px;
	padding: 12px 2px;
	border-bottom: 1px solid var(--dsw-alias-border-l2);
}

.rgs-set-row:last-child {
	border-bottom: 0;
}

.rgs-set-text {
	display: flex;
	flex-direction: column;
	gap: 4px;
	min-width: 0;
}

.rgs-set-title {
	color: var(--dsw-alias-label-primary);
	font-size: 14px;
	line-height: 22px;
}

.rgs-set-desc {
	color: var(--dsw-alias-label-secondary);
	font-size: 12px;
	line-height: 18px;
}

.rgs-set-control {
	display: flex;
	flex: 0 0 auto;
	align-items: center;
	gap: 8px;
}

.rgs-set-choice {
	display: inline-flex;
	padding: 2px;
	border: 1px solid var(--dsw-alias-border-l2);
	border-radius: 9px;
	background: var(--dsw-alias-bg-layer-1);
}

.rgs-set-choice button {
	display: inline-flex;
	align-items: center;
	gap: 6px;
	padding: 5px 10px;
	border: 0;
	border-radius: 7px;
	background: transparent;
	color: var(--dsw-alias-label-secondary);
	font: inherit;
	font-size: 13px;
	line-height: 18px;
	cursor: pointer;
}

.rgs-set-choice button[aria-pressed="true"] {
	background: var(--dsw-alias-bg-module-platform);
	color: var(--dsw-alias-label-primary);
}

.rgs-set-choice button:focus-visible {
	outline: 2px solid var(--dsw-alias-brand-primary);
	outline-offset: 1px;
}

.rgs-set-swatch {
	width: 16px;
	height: 16px;
	border-radius: 3px;
	background-color: var(--rgs-ai-avatar);
	background-repeat: no-repeat;
	background-position: center;
	background-size: 12px 12px;
}

.rgs-set-swatch[data-art="gpt"] {
	background-image: url("${AI_ART_GPT}");
}

.rgs-set-swatch[data-art="whale"] {
	background-image: url("${AI_ART_WHALE}");
}

.rgs-set-colors {
	display: inline-flex;
	align-items: center;
	gap: 6px;
}

.rgs-set-color {
	box-sizing: border-box;
	width: 22px;
	height: 22px;
	padding: 0;
	border: 1px solid var(--dsw-alias-border-l2);
	border-radius: 5px;
	cursor: pointer;
}

.rgs-set-color[aria-pressed="true"] {
	box-shadow: 0 0 0 2px var(--dsw-alias-brand-primary);
}

.rgs-set-color:focus-visible,
.rgs-set-color-input:focus-visible {
	outline: 2px solid var(--dsw-alias-brand-primary);
	outline-offset: 2px;
}

.rgs-set-color-input {
	box-sizing: border-box;
	width: 30px;
	height: 22px;
	padding: 0;
	border: 1px solid var(--dsw-alias-border-l2);
	border-radius: 5px;
	background: var(--dsw-alias-bg-layer-1);
	cursor: pointer;
}

.rgs-set-upload {
	display: inline-flex;
	align-items: center;
	gap: 8px;
}

.rgs-set-preview {
	box-sizing: border-box;
	width: 26px;
	height: 26px;
	border: 1px solid var(--dsw-alias-border-l2);
	border-radius: 5px;
	background-position: center;
	background-repeat: no-repeat;
	background-size: cover;
}

.rgs-set-file {
	position: relative;
	display: inline-flex;
	align-items: center;
	padding: 5px 10px;
	border: 1px solid var(--dsw-alias-border-l2);
	border-radius: 7px;
	background: var(--dsw-alias-bg-layer-1);
	color: var(--dsw-alias-label-primary);
	font-size: 13px;
	line-height: 18px;
	cursor: pointer;
}

.rgs-set-file input {
	position: absolute;
	width: 1px;
	height: 1px;
	margin: 0;
	opacity: 0;
}

.rgs-set-file:focus-within {
	outline: 2px solid var(--dsw-alias-brand-primary);
	outline-offset: 1px;
}

.rgs-set-clear {
	padding: 5px 8px;
	border: 0;
	border-radius: 7px;
	background: transparent;
	color: var(--dsw-alias-label-secondary);
	font: inherit;
	font-size: 13px;
	line-height: 18px;
	cursor: pointer;
}

.rgs-set-clear:hover {
	background: var(--dsw-alias-interactive-bg-hover);
	color: var(--dsw-alias-label-primary);
}

.rgs-set-error {
	color: var(--dsw-alias-state-error-primary);
	font-size: 12px;
	line-height: 18px;
}

.rgs-set-switch {
	position: relative;
	display: inline-flex;
	flex: 0 0 auto;
	cursor: pointer;
}

.rgs-set-switch input {
	position: absolute;
	width: 1px;
	height: 1px;
	margin: 0;
	opacity: 0;
}

.rgs-set-switch-track {
	display: inline-flex;
	align-items: center;
	box-sizing: border-box;
	width: 36px;
	height: 20px;
	padding: 2px;
	border: 1px solid var(--dsw-alias-border-l2);
	border-radius: 10px;
	background: var(--dsw-alias-bg-layer-2);
	transition: background-color 150ms ease, border-color 150ms ease;
}

.rgs-set-switch-thumb {
	display: block;
	width: 14px;
	height: 14px;
	border-radius: 50%;
	background: var(--dsw-alias-label-secondary);
	transition: transform 150ms ease, background-color 150ms ease;
}

.rgs-set-switch input:checked + .rgs-set-switch-track {
	border-color: var(--dsw-alias-brand-primary);
	background: var(--dsw-alias-brand-primary);
}

.rgs-set-switch input:checked + .rgs-set-switch-track .rgs-set-switch-thumb {
	background: #FFFFFF;
	transform: translateX(16px);
}

.rgs-set-switch input:focus-visible + .rgs-set-switch-track {
	outline: 2px solid var(--dsw-alias-brand-primary);
	outline-offset: 2px;
}

.rgs-set-number {
	display: inline-flex;
	align-items: center;
	gap: 6px;
}

.rgs-set-number input {
	box-sizing: border-box;
	width: 64px;
	height: 30px;
	padding: 0 8px;
	border: 1px solid var(--dsw-alias-border-l2);
	border-radius: 8px;
	background: var(--dsw-alias-bg-layer-1);
	color: var(--dsw-alias-label-primary);
	font: inherit;
	font-size: 13px;
	text-align: center;
}

.rgs-set-number span {
	color: var(--dsw-alias-label-secondary);
	font-size: 12px;
}

.rgs-set-reset {
	align-self: flex-start;
	padding: 6px 12px;
	border: 1px solid var(--dsw-alias-border-l2);
	border-radius: 8px;
	background: transparent;
	color: var(--dsw-alias-label-primary);
	font: inherit;
	font-size: 13px;
	line-height: 18px;
	cursor: pointer;
}

.rgs-set-reset:hover {
	background: var(--dsw-alias-interactive-bg-hover);
}

.rgs-set-reset:focus-visible {
	outline: 2px solid var(--dsw-alias-brand-primary);
	outline-offset: 1px;
}

@media (prefers-reduced-motion: reduce) {
	.rgs-toggle,
	.rgs-set-switch-track,
	.rgs-set-switch-thumb {
		transition: none;
	}
}

@media (max-width: 720px) {
	:root[data-rgs-skin] [data-chat-flow-kind] {
		padding-left: 56px;
		padding-right: 14px;
	}

	:root[data-rgs-skin] [data-chat-flow-kind="user"] {
		padding-top: 14px;
		padding-bottom: 14px;
	}

	:root[data-rgs-skin] [data-chat-flow-kind="user"]::before,
	:root[data-rgs-skin] [data-chat-flow-kind="assistant-step"]::before {
		left: 14px;
		width: 26px;
		height: 26px;
		background-size: 17px 17px;
	}

	:root[data-rgs-skin] [data-chat-flow-kind="user"]::before {
		top: calc(14px + (1.6 * var(--rgs-font-size, 15px) - 26px) / 2);
	}

	:root[data-rgs-skin] [data-chat-flow-kind="assistant-step"]::before {
		top: calc((1.6 * var(--rgs-font-size, 15px) - 26px) / 2);
	}

	.rgs-set-row {
		align-items: flex-start;
		flex-direction: column;
		gap: 8px;
	}
}
`;

		const STRINGS = {
			en: {
				toDark: "Switch to dark mode",
				toLight: "Switch to light mode",
				label: "Retro skin",
				settingsIntro:
					"The classic chat layout: both roles on one column, a mark per role, and a full-bleed band for every turn. Changes apply immediately.",
				settingsLook: "Appearance",
				avatarTitle: "Assistant mark",
				avatarDesc: "The logo shown next to each assistant answer.",
				avatarGpt: "GPT",
				avatarWhale: "DeepSeek",
				userColorTitle: "Your avatar colour",
				userColorDesc: "The tile beside your own messages.",
				userColorCustom: "Custom colour",
				userImageTitle: "Your avatar picture",
				userImageDesc: "Use an image instead of the letter U.",
				upload: "Upload",
				removeImage: "Remove",
				uploadFailed: "That image could not be read.",
				fontTitle: "Message text size",
				fontDesc: "Applies to messages and the composer.",
				planeTitle: "Paper-plane send button",
				planeDesc: "Replace the send arrow with a paper plane while idle.",
				typewriterTitle: "Typewriter caret",
				typewriterDesc:
					"While an answer streams, a blinking block caret follows the last character.",
				languageHeading: "Interface",
				languageTitle: "Language",
				languageDesc: "Only this skin's own settings copy and tooltips — the rest of Harness keeps its language.",
				languageZh: "中文",
				languageEn: "English",
				reset: "Reset to defaults",
			},
			zh: {
				toDark: "切换到深色模式",
				toLight: "切换到浅色模式",
				label: "复古皮肤",
				settingsIntro:
					"经典对话排版：双方同列对齐，每轮都有角色图标，用户与 AI 各自独占整行色带。改动立即生效。",
				settingsLook: "外观",
				avatarTitle: "AI 图标",
				avatarDesc: "每条 AI 回复左侧显示的标志。",
				avatarGpt: "GPT",
				avatarWhale: "DeepSeek",
				userColorTitle: "用户头像颜色",
				userColorDesc: "你自己消息左侧的方块颜色。",
				userColorCustom: "自定义颜色",
				userImageTitle: "用户头像图片",
				userImageDesc: "用图片替换字母 U。",
				upload: "上传",
				removeImage: "移除",
				uploadFailed: "这张图片读不出来。",
				fontTitle: "正文字号",
				fontDesc: "作用于消息正文与输入框。",
				planeTitle: "纸飞机发送按钮",
				planeDesc: "空闲状态用纸飞机替换原来的发送箭头。",
				typewriterTitle: "打字机光标",
				typewriterDesc: "AI 回答流式输出时，在最后一个字符后面跟一个闪烁的方块光标。",
				languageHeading: "界面",
				languageTitle: "界面语言",
				languageDesc: "只切换本皮肤自己的设置文案与按钮提示，Harness 其余界面保持不变。",
				languageZh: "中文",
				languageEn: "English",
				reset: "恢复默认",
			},
		};

		const strings = (localeId) => STRINGS[localeId] || STRINGS.en;


		const clampFont = (value) => {
			const size = Math.round(Number(value));
			if (!Number.isFinite(size)) return DEFAULT_PREFS.fontSize;
			return Math.min(FONT_RANGE.max, Math.max(FONT_RANGE.min, size));
		};

		const isHexColor = (value) => /^#[0-9a-fA-F]{6}$/.test(String(value || ""));

		const normalizeColor = (value) =>
			isHexColor(value) ? String(value).toLowerCase() : DEFAULT_PREFS.userAvatarColor;

		const normalizeImage = (value) => {
			const raw = typeof value === "string" ? value : "";
			if (!raw.startsWith("data:image/")) return "";
			if (raw.length > IMAGE_LIMIT * 1.4) return "";
			return raw;
		};

		function normalizePrefs(value) {
			const parsed = value && typeof value === "object" ? value : {};
			return {
				aiAvatar: parsed.aiAvatar === "whale" ? "whale" : "gpt",
				fontSize: clampFont(parsed.fontSize),
				planeSend: parsed.planeSend !== false,
				typewriter: parsed.typewriter !== false,
				userAvatarColor: normalizeColor(parsed.userAvatarColor),
				userAvatarImage: normalizeImage(parsed.userAvatarImage),
				lang: parsed.lang === "zh" || parsed.lang === "en" ? parsed.lang : "",
			};
		}

		/* the skin's own copy language: an explicit pick wins, otherwise follow the
		   Harness locale (the host only knows "zh" and "en", same as STRINGS). */
		const pickLang = (localeId) => prefs.lang || (STRINGS[localeId] ? localeId : "en");

		function loadPrefs() {
			try {
				const raw = window.localStorage.getItem(PREFS_KEY);
				if (!raw) return { ...DEFAULT_PREFS };
				return normalizePrefs(JSON.parse(raw));
			} catch (error) {
				void error;
				return { ...DEFAULT_PREFS };
			}
		}

		let prefs = { ...DEFAULT_PREFS };
		const prefsListeners = new Set();
		let scheduleActions = () => {};

		function applyPrefs(next) {
			const root = document.documentElement;
			root.setAttribute("data-rgs-ai-avatar", next.aiAvatar);
			root.setAttribute("data-rgs-plane", next.planeSend ? "on" : "off");
			root.setAttribute("data-rgs-typewriter", next.typewriter ? "on" : "off");
			root.style.setProperty("--rgs-font-size", `${next.fontSize}px`);
			root.style.setProperty("--rgs-user-avatar-color", next.userAvatarColor);
			if (next.userAvatarImage) {
				root.setAttribute("data-rgs-user-avatar", "image");
				root.style.setProperty("--rgs-user-image", `url("${next.userAvatarImage}")`);
			} else {
				root.removeAttribute("data-rgs-user-avatar");
				root.style.removeProperty("--rgs-user-image");
			}
			scheduleActions();
			return next;
		}

		function savePrefs(next) {
			try {
				window.localStorage.setItem(
					PREFS_KEY,
					JSON.stringify({ schema: 1, ...next }),
				);
			} catch (error) {
				void error;
			}
		}

		function setPrefs(patch) {
			prefs = applyPrefs(normalizePrefs({ ...prefs, ...patch }));
			savePrefs(prefs);
			for (const listener of prefsListeners) listener(prefs);
			return prefs;
		}

		function subscribePrefs(listener) {
			prefsListeners.add(listener);
			return () => prefsListeners.delete(listener);
		}

		function installStyles() {
			for (const stale of document.querySelectorAll(`style[${STYLE_ATTR}]`)) stale.remove();
			const style = document.createElement("style");
			style.setAttribute(STYLE_ATTR, "");
			style.textContent = STYLES;
			document.head.appendChild(style);
			return () => style.remove();
		}

		function markRoot() {
			const root = document.documentElement;
			root.setAttribute(ROOT_ATTR, "");
			prefs = applyPrefs(loadPrefs());
			return () => {
				root.removeAttribute(ROOT_ATTR);
				root.removeAttribute("data-rgs-ai-avatar");
				root.removeAttribute("data-rgs-plane");
				root.removeAttribute("data-rgs-typewriter");
				root.removeAttribute("data-rgs-user-avatar");
				root.style.removeProperty("--rgs-font-size");
				root.style.removeProperty("--rgs-user-avatar-color");
				root.style.removeProperty("--rgs-user-image");
			};
		}

		/* The reply's actions (copy, thumbs, regenerate) live in the turn-tail row
		   that FOLLOWS the answer, so lifting them to the top-right of the reply
		   needs an offset CSS cannot know: the distance between the tail row and the
		   answer row above it. Measure it per row, publish it as --rgs-actions-lift,
		   and let the stylesheet do the rest. */
		/* Rows that begin with a card (an edited-files block, a tool result) have
		   content right against their top edge, so the lifted action row would sit
		   on top of the card. Those rows get a reserved strip instead. A text-first
		   reply needs no strip: the icons float beside its first line. */
		const TEXT_BLOCKS = /^(P|UL|OL|PRE|H[1-6]|BLOCKQUOTE|TABLE|HR|DL)$/;
		const paddedAnchors = new Set();

		function firstBlock(row) {
			let element = row;
			while (element && element.children.length === 1) {
				element = element.firstElementChild;
			}
			return element;
		}

		/* Streaming is readable from the composer: the primary button swaps its
		   arrow path for a stop rect while a turn runs. The newest reply row then
		   carries [data-rgs-typing], and exactly one text block inside it carries
		   [data-rgs-caret] so the stylesheet draws a single blinking caret right
		   after the last streamed character. */
		const CARET_BLOCKS = [
			"p",
			"li",
			"pre",
			"h1",
			"h2",
			"h3",
			"h4",
			"h5",
			"h6",
			"blockquote",
			"td",
			"th",
			"dt",
			"dd",
		].join(", ");

		function markTyping() {
			const rows = document.querySelectorAll('[data-chat-flow-kind="assistant-step"]');
			let target = null;
			if (prefs.typewriter && document.querySelector('[class*="_primary"] > svg > rect')) {
				for (let index = rows.length - 1; index >= 0; index -= 1) {
					const row = rows[index];
					if (row.getAttribute("data-chat-group-part") !== "reasoning") {
						target = row;
						break;
					}
				}
			}
			for (const row of document.querySelectorAll("[data-rgs-typing]")) {
				if (row !== target) row.removeAttribute("data-rgs-typing");
			}
			/* Only the LAST block in document order gets the caret: blocks nest
			   (a <p> holding a list, a <ul> holding <li>), and one caret per nesting
			   level is what made two cursors appear. */
			let caret = null;
			if (target) {
				target.setAttribute("data-rgs-typing", "");
				const blocks = target.querySelectorAll(CARET_BLOCKS);
				caret = blocks.length === 0 ? target : blocks[blocks.length - 1];
			}
			for (const node of document.querySelectorAll("[data-rgs-caret]")) {
				if (node !== caret) node.removeAttribute("data-rgs-caret");
			}
			if (caret) caret.setAttribute("data-rgs-caret", "");
		}

		/* One mark per turn: among the reply rows of a turn (everything after the
		   user row up to the next one), only the first non-reasoning answer row
		   keeps [data-rgs-turn-start]. A turn boundary is the user row, which plain
		   CSS cannot express, hence the scan. */
		function markTurnStarts() {
			const keep = new Set();
			let waiting = true;
			let currentRoot = null;
			for (const row of document.querySelectorAll("[data-chat-flow-kind]")) {
				/* a window can hold more than one transcript (split view, an
				   inactive view kept mounted), so the turn scan is restarted per
				   transcript instead of trusting one scope element */
				const root =
					row.closest("[data-conversation-scroll]") ||
					row.closest("[data-conversation-content]") ||
					document.body;
				if (root !== currentRoot) {
					currentRoot = root;
					waiting = true;
				}
				const kind = row.getAttribute("data-chat-flow-kind");
				if (kind === "user") {
					waiting = true;
					continue;
				}
				if (kind !== "assistant-step") continue;
				if (row.getAttribute("data-chat-group-part") === "reasoning") continue;
				if (!waiting) continue;
				waiting = false;
				keep.add(row);
			}
			for (const row of document.querySelectorAll("[data-rgs-turn-start]")) {
				if (!keep.has(row)) row.removeAttribute("data-rgs-turn-start");
			}
			for (const row of keep) {
				if (!row.hasAttribute("data-rgs-turn-start")) {
					row.setAttribute("data-rgs-turn-start", "");
				}
			}
		}

		function placeTurnActions() {
			/* the tail node may either be the flow row itself or sit inside one, and
			   the same is true of its siblings, so resolve both ends through the
			   nearest flow row before measuring. */
			const flowRow = (element) => {
				if (!element) return null;
				if (element.hasAttribute("data-chat-flow-kind")) return element;
				return element.querySelector("[data-chat-flow-kind]");
			};
			const used = new Set();
			for (const tail of document.querySelectorAll("[data-turn-tail]")) {
				const tailRow = flowRow(tail) || tail;
				let row = tailRow.previousElementSibling;
				let anchor = null;
				while (row) {
					const candidate = flowRow(row);
					if (
						candidate &&
						candidate.getAttribute("data-chat-flow-kind") === "assistant-step" &&
						candidate.getAttribute("data-chat-group-part") !== "reasoning"
					) {
						anchor = candidate;
						break;
					}
					row = row.previousElementSibling;
				}
				if (!anchor) {
					tail.style.removeProperty("--rgs-actions-lift");
					continue;
				}
				used.add(anchor);
				const block = firstBlock(anchor);
				const textFirst = !!block && TEXT_BLOCKS.test(block.tagName);
				if (textFirst) {
					anchor.removeAttribute("data-rgs-card-first");
					paddedAnchors.delete(anchor);
				} else {
					anchor.setAttribute("data-rgs-card-first", "");
					paddedAnchors.add(anchor);
				}
				const lift =
					tailRow.getBoundingClientRect().top - anchor.getBoundingClientRect().top;
				if (lift > 0) {
					tail.style.setProperty("--rgs-actions-lift", `${Math.round(lift)}px`);
				} else {
					tail.style.removeProperty("--rgs-actions-lift");
				}
			}
			for (const anchor of Array.from(paddedAnchors)) {
				if (!used.has(anchor)) {
					anchor.removeAttribute("data-rgs-card-first");
					paddedAnchors.delete(anchor);
				}
			}
		}

		function watchTurnActions() {
			let timer = 0;
			const schedule = () => {
				if (timer) return;
				timer = window.setTimeout(() => {
					timer = 0;
					placeTurnActions();
					markTyping();
					markTurnStarts();
				}, 150);
			};
			const observer = new MutationObserver(() => {
				/* marks are cheap attribute writes and must land in the same frame the
				   row mounts, otherwise a new turn renders its first paint unmarked
				   (the debounce is only for the layout-dependent measurement) */
				markTurnStarts();
				markTyping();
				schedule();
			});
			observer.observe(document.body, {
				childList: true,
				subtree: true,
				characterData: true,
			});
			window.addEventListener("resize", schedule);
			scheduleActions = schedule;
			schedule();
			return () => {
				observer.disconnect();
				window.removeEventListener("resize", schedule);
				if (timer) window.clearTimeout(timer);
				scheduleActions = () => {};
				for (const tail of document.querySelectorAll("[data-turn-tail]")) {
					tail.style.removeProperty("--rgs-actions-lift");
				}
				for (const anchor of paddedAnchors) {
					anchor.removeAttribute("data-rgs-card-first");
				}
				paddedAnchors.clear();
				for (const row of document.querySelectorAll("[data-rgs-typing]")) {
					row.removeAttribute("data-rgs-typing");
				}
				for (const node of document.querySelectorAll("[data-rgs-caret]")) {
					node.removeAttribute("data-rgs-caret");
				}
				for (const row of document.querySelectorAll("[data-rgs-turn-start]")) {
					row.removeAttribute("data-rgs-turn-start");
				}
			};
		}




		function MoonIcon() {
			return React.createElement(
				"svg",
				{ width: 16, height: 16, viewBox: "0 0 20 20", "aria-hidden": true },
				React.createElement("path", {
					fill: "currentColor",
					d: "M10 1.5a8.5 8.5 0 1 0 8.5 8.5A6.5 6.5 0 0 1 10 1.5Z",
				}),
			);
		}

		function SunIcon() {
			return React.createElement(
				"svg",
				{
					width: 16,
					height: 16,
					viewBox: "0 0 20 20",
					"aria-hidden": true,
					fill: "none",
					stroke: "currentColor",
					strokeWidth: 1.6,
					strokeLinecap: "round",
				},
				React.createElement("circle", { cx: 10, cy: 10, r: 3.7 }),
				React.createElement("path", {
					d: "M10 1.8v1.7M10 16.5v1.7M1.8 10h1.7M16.5 10h1.7M4.2 4.2l1.2 1.2M14.6 14.6l1.2 1.2M15.8 4.2l-1.2 1.2M5.4 14.6l-1.2 1.2",
				}),
			);
		}

		function ThemeToggle(props) {
			const theme = props.theme;
			const dark = props.dark;
			const t = strings(props.lang);
			const label = dark ? t.toLight : t.toDark;
			return React.createElement(
				"button",
				{
					type: "button",
					className: "rgs-toggle",
					title: label,
					"aria-label": label,
					onClick: () => theme.setTheme(dark ? "light" : "dark"),
				},
				React.createElement(dark ? SunIcon : MoonIcon, null),
			);
		}

		const el = React.createElement;

		/* Uploads are re-encoded through a canvas so the stored preference stays a small
		   square PNG data URI instead of the original (possibly multi-megabyte) file. */
		const readAvatarImage = (file) =>
			new Promise((resolve, reject) => {
				const url = URL.createObjectURL(file);
				const image = new Image();
				image.onload = () => {
					try {
						const size = 128;
						const canvas = document.createElement("canvas");
						canvas.width = size;
						canvas.height = size;
						const context = canvas.getContext("2d");
						const scale = Math.max(size / image.width, size / image.height);
						const width = image.width * scale;
						const height = image.height * scale;
						context.drawImage(image, (size - width) / 2, (size - height) / 2, width, height);
						resolve(canvas.toDataURL("image/png"));
					} catch (error) {
						reject(error);
					} finally {
						URL.revokeObjectURL(url);
					}
				};
				image.onerror = () => {
					URL.revokeObjectURL(url);
					reject(new Error("unreadable image"));
				};
				image.src = url;
			});

		function SettingRow(title, description, control) {
			return el(
				"div",
				{ className: "rgs-set-row", key: title },
				el(
					"span",
					{ className: "rgs-set-text" },
					el("span", { className: "rgs-set-title" }, title),
					el("span", { className: "rgs-set-desc" }, description),
				),
				el("span", { className: "rgs-set-control" }, control),
			);
		}

		function SettingsSection(props) {
			const locale = props.locale;
			const [localeId, setLocaleId] = React.useState(() => locale.getLocale());
			const [state, setState] = React.useState(() => ({ ...prefs }));

			React.useEffect(() => {
				const offLocale = locale.subscribe(() => setLocaleId(locale.getLocale()));
				const offPrefs = subscribePrefs((next) => setState({ ...next }));
				setState({ ...prefs });
				return () => {
					offLocale();
					offPrefs();
				};
			}, []);

			const t = strings(pickLang(localeId));
			const [uploadError, setUploadError] = React.useState(false);

			const onPickImage = async (event) => {
				const input = event.currentTarget;
				const file = input.files && input.files[0];
				input.value = "";
				if (!file) return;
				try {
					const data = await readAvatarImage(file);
					setUploadError(false);
					setPrefs({ userAvatarImage: data });
				} catch (error) {
					void error;
					setUploadError(true);
				}
			};

			const colorButton = (color) =>
				el("button", {
					type: "button",
					key: color,
					className: "rgs-set-color",
					style: { background: color },
					title: color,
					"aria-label": color,
					"aria-pressed": state.userAvatarColor === color,
					onClick: () => setPrefs({ userAvatarColor: color }),
				});

			const choice = (id, art, label) =>
				el(
					"button",
					{
						type: "button",
						key: id,
						"aria-pressed": state.aiAvatar === id,
						onClick: () => setPrefs({ aiAvatar: id }),
					},
					el("span", { className: "rgs-set-swatch", "data-art": art }),
					label,
				);

			const langChoice = (id, label) =>
				el(
					"button",
					{
						type: "button",
						key: id,
						"aria-pressed": (state.lang || pickLang(localeId)) === id,
						onClick: () => setPrefs({ lang: id }),
					},
					label,
				);

			return el(
				"div",
				{ className: "rgs-set" },
				el("p", { className: "rgs-set-intro" }, t.settingsIntro),
				el(
					"div",
					{ className: "rgs-set-group" },
					el("div", { className: "rgs-set-heading" }, t.languageHeading),
					SettingRow(
						t.languageTitle,
						t.languageDesc,
						el(
							"span",
							{ className: "rgs-set-choice" },
							langChoice("zh", t.languageZh),
							langChoice("en", t.languageEn),
						),
					),
				),
				el(
					"div",
					{ className: "rgs-set-group" },
					el("div", { className: "rgs-set-heading" }, t.settingsLook),
					SettingRow(
						t.avatarTitle,
						t.avatarDesc,
						el(
							"span",
							{ className: "rgs-set-choice" },
							choice("gpt", "gpt", t.avatarGpt),
							choice("whale", "whale", t.avatarWhale),
						),
					),
					SettingRow(
						t.userColorTitle,
						t.userColorDesc,
						el(
							"span",
							{ className: "rgs-set-colors" },
							...AVATAR_COLORS.map(colorButton),
							el("input", {
								type: "color",
								className: "rgs-set-color-input",
								value: state.userAvatarColor,
								"aria-label": t.userColorCustom,
								title: t.userColorCustom,
								onChange: (event) => setPrefs({ userAvatarColor: event.currentTarget.value }),
							}),
						),
					),
					SettingRow(
						t.userImageTitle,
						t.userImageDesc,
						el(
							"span",
							{ className: "rgs-set-upload" },
							el("span", {
								className: "rgs-set-preview",
								"aria-hidden": "true",
								style: state.userAvatarImage
									? { backgroundImage: `url(${JSON.stringify(state.userAvatarImage)})` }
									: { background: state.userAvatarColor },
							}),
							el(
								"label",
								{ className: "rgs-set-file" },
								t.upload,
								el("input", {
									type: "file",
									accept: "image/png,image/jpeg,image/webp,image/gif",
									onChange: onPickImage,
								}),
							),
							state.userAvatarImage
								? el(
										"button",
										{
											type: "button",
											className: "rgs-set-clear",
											onClick: () => setPrefs({ userAvatarImage: "" }),
										},
										t.removeImage,
									)
								: null,
							uploadError ? el("span", { className: "rgs-set-error" }, t.uploadFailed) : null,
						),
					),
					SettingRow(
						t.fontTitle,
						t.fontDesc,
						el(
							"span",
							{ className: "rgs-set-number" },
							el("input", {
								type: "number",
								min: FONT_RANGE.min,
								max: FONT_RANGE.max,
								step: 1,
								value: state.fontSize,
								"aria-label": t.fontTitle,
								onChange: (event) => {
									const raw = event.currentTarget.value;
									if (raw === "") return;
									setPrefs({ fontSize: clampFont(raw) });
								},
							}),
							el("span", null, "px"),
						),
					),
					SettingRow(
						t.planeTitle,
						t.planeDesc,
						el(
							"label",
							{ className: "rgs-set-switch" },
							el("input", {
								type: "checkbox",
								checked: state.planeSend,
								"aria-label": t.planeTitle,
								onChange: (event) => setPrefs({ planeSend: event.currentTarget.checked }),
							}),
							el(
								"span",
								{ className: "rgs-set-switch-track", "aria-hidden": "true" },
								el("span", { className: "rgs-set-switch-thumb" }),
							),
						),
					),
					SettingRow(
						t.typewriterTitle,
						t.typewriterDesc,
						el(
							"label",
							{ className: "rgs-set-switch" },
							el("input", {
								type: "checkbox",
								checked: state.typewriter,
								"aria-label": t.typewriterTitle,
								onChange: (event) => setPrefs({ typewriter: event.currentTarget.checked }),
							}),
							el(
								"span",
								{ className: "rgs-set-switch-track", "aria-hidden": "true" },
								el("span", { className: "rgs-set-switch-thumb" }),
							),
						),
					),
				),
				el(
					"button",
					{
						type: "button",
						className: "rgs-set-reset",
						onClick: () => setPrefs({ ...DEFAULT_PREFS }),
					},
					t.reset,
				),
			);
		}

		return {
			inject: ["slots", "locale", "theme"],
			apply(ctx) {
				ctx.effect(() => ctx.theme.overrideTokens(SOURCE, TOKENS));
				ctx.effect(installStyles);
				ctx.effect(markRoot);
				ctx.effect(watchTurnActions);

				/* mirrors the painted colour scheme onto the root so stylesheet rules can
				   tell light from dark (the host only marks the dark case, on <body>). */
				ctx.effect(() => {
					const root = document.documentElement;
					const sync = () => {
						const snapshot = ctx.theme.getTheme();
						const active = snapshot && snapshot.active;
						root.setAttribute(
							"data-rgs-theme",
							active && active.colorScheme === "dark" ? "dark" : "light",
						);
					};
					sync();
					const off = ctx.on("theme/change", sync);
					return () => {
						off();
						root.removeAttribute("data-rgs-theme");
					};
				});

				const theme = ctx.theme;
				const locale = ctx.locale;

				const Wrapped = () => {
					const [snapshot, setSnapshot] = React.useState(() => theme.getTheme());
					const [localeId, setLocaleId] = React.useState(() => locale.getLocale());
					const [lang, setLang] = React.useState(() => pickLang(locale.getLocale()));
					React.useEffect(() => {
						const offTheme = ctx.on("theme/change", (next) => setSnapshot(next));
						const offLocale = locale.subscribe(() => {
							setLocaleId(locale.getLocale());
							setLang(pickLang(locale.getLocale()));
						});
						const offPrefs = subscribePrefs(() => setLang(pickLang(locale.getLocale())));
						setSnapshot(theme.getTheme());
						return () => {
							offTheme();
							offLocale();
							offPrefs();
						};
					}, []);
					const active = snapshot && snapshot.active;
					const dark = !!(active && active.colorScheme === "dark");
					return React.createElement(ThemeToggle, { theme, dark, lang });
				};

				const OpenSection = () => el(SettingsSection, { locale });

				ctx.slots.inject("conversation.session.header.utilities", () =>
					ctx.slots.register(
						{
							name: "conversation.session.header.utilities",
							id: "retrogpt-skin-toggle",
							order: -20,
							label: () => strings(pickLang(locale.getLocale())).label,
						},
						Wrapped,
					),
				);

				/* The nav entry keeps a fixed English name: it sits in the settings
				   sidebar next to the host's own entries, so it must not follow the
				   skin's copy language. */
				ctx.slots.inject("settings.section", () =>
					ctx.slots.register(
						{
							name: "settings.section",
							id: "retro-ui",
							order: 200,
							label: () => "GPT retro UI",
						},
						OpenSection,
					),
				);
			},
		};
	},
});
