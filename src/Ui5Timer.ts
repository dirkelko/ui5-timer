import UI5Element from "@ui5/webcomponents-base/dist/UI5Element.js";
import customElement from "@ui5/webcomponents-base/dist/decorators/customElement.js";
import property from "@ui5/webcomponents-base/dist/decorators/property.js";
import litRender from "@ui5/webcomponents-base/dist/renderer/LitRenderer.js";
import { getI18nBundle } from "@ui5/webcomponents-base/dist/i18nBundle.js";
import type I18nBundle from "@ui5/webcomponents-base/dist/i18nBundle.js";
import Button from "@ui5/webcomponents/dist/Button.js";
import "@ui5/webcomponents-icons/dist/play.js";
import "@ui5/webcomponents-icons/dist/stop.js";
import "@ui5/webcomponents-icons/dist/sys-back.js";
import "@ui5/webcomponents/dist/Assets.js";
import event from "@ui5/webcomponents-base/dist/decorators/event.js";

import type { Interval } from "@ui5/webcomponents-base/dist/types.js";

// Template
import UI5TimerTemplate from "./generated/templates/Ui5TimerTemplate.lit";

// Styles
import UI5TimerCss from "./generated/themes/Ui5Timer.css";

/**
 * @class
 *
 * <h3 class="comment-api-title">Overview</h3>
 *
 * The <code>ui5-timer</code> component is a demo component that displays some text.
 *
 * @constructor
 * @extends UI5Element
 * @public
 */
@customElement({
	tag: "ui5-timer",
	renderer: litRender,
	styles: UI5TimerCss,
	template: UI5TimerTemplate,
	dependencies: [
		Button,
	],
})

/**
 * Fired when the timer is finished
 *
 * @public
 */
@event("timer-finished", { detail: { nextRound: { type: Number }, nextDuration: { type: Number } } })

/**
 * Fired when the start button is clicked and the timer starts
 *
 * @public
 */
@event("timer-start")

/**
 * Fired when the stop button is clicked and the timer stops
 *
 * @public
 */
@event("timer-stop")

class UI5Timer extends UI5Element {
	static i18nBundle: I18nBundle;

	static async onDefine() {
		UI5Timer.i18nBundle = await getI18nBundle("ui5wc-timer");
	}

	/**
	 * Defines the component count.
	 * @default 0
	 * @public
	 */

	// remaining time in milliseconds
	remTime: number = 30000;

	/**
	 * DESCRIPTION
	 *
	 * @public
	 */
	@property({ type: String })
	title!: string;
	// duration!: number;
	/**
	 * DESCRIPTION
	 *
	 * @public
	 */
	@property({ type: String })
	timerText!: string ;
	/**
	 * DESCRIPTION
	 *
	 * @public
	 */
	@property({ type: String })
	subTitle!: string;
	/**
	 * DESCRIPTION
	 *
	 * @public
	 */
	@property({ type: String })
	subSubTitle!: string;
	/**
	 * DESCRIPTION
	 *
	 * @public
	 */
	@property({ type: String })
	vbox!: string;
	/**
	 * DESCRIPTION
	 *
	 * @public
	 */
	@property({ type: String })
	bgCircleStroke: string = "var(--sapNeutralBackground)";
	/**
	 * DESCRIPTION
	 *
	 * @public
	 */
	@property({ type: String })
	clockCircleStroke: string = "var(--sapLegendColor2)";
	/**
	 * DESCRIPTION
	 *
	 * @public
	 */
	@property({ type: String })
	clockCircleVisibility: string = "visible";
	/**
	 * DESCRIPTION
	 *
	 * @public
	 */
	@property({ type: String })
	clockPathStroke: string = "transparent";
	/**
	 * DESCRIPTION
	 *
	 * @public
	 */
	@property({ type: String })
	clockPathVisibility: string = "visible";
	/**
	 * DESCRIPTION
	 *
	 * @public
	 */
	@property({ noAttribute: true })
	clockPathArc: string = "M 600 100 A 500 500 0 1 0 600 100";

	/**
	 * DESCRIPTION
	 *
	 * @public
	 */
	@property({ type: Number })
	set duration(value: number) {
		// console.log("set Duration: " + value);
		this.Dur = value;
		this.remTime = Number(value) * 1000;
		this.timerText = this.timerString(this.remTime);
		this.resetTimer();
	}

	get duration() {
		return this.Dur;
	}

	private Dur: number = 30;

	@property({ type: Boolean, noAttribute: true })
	startDisabled!: boolean;
	@property({ type: Boolean, noAttribute: true })
	stopDisabled!: boolean;
	@property({ type: Boolean, noAttribute: true })
	resetDisabled!: boolean;

	intervalIndex: number = 0;
	isRunning: boolean = false;
	interval: Interval | null = null;

	/* get subSubTitleText() {
		return this.subSubTitle;
	} */

	/**
	 * DESCRIPTION
	 *
	 * @public
	 */
	stopTimer() {
		if (this.isRunning) {
			// test comment
			clearInterval(this.interval!);
			this.isRunning = false;
			this.startDisabled = false;
			this.stopDisabled = true;
			this.resetDisabled = false;
			this.fireEvent("timer-stop");
			// this.timerText = "";
			// this.timerText = this.timerString(this.remTime);
		}
	}

	/**
	 * DESCRIPTION
	 *
	 * @public
	 */
	resetTimer() {
		if (!this.isRunning) {
			this.remTime = Number(this.duration) * 1000;
			this.timerText = this.timerString(this.remTime);
			this.clockCircleVisibility = "visible";
			this.clockPathVisibility = "hidden";
			this.startDisabled = false;
			this.stopDisabled = true;
			this.resetDisabled = true;
		}
	}

	/**
	 * DESCRIPTION
	 *
	 * @public
	 */
	startTimer() {
		if (!this.isRunning) {
			const r = 500;
			const mX = 600;
			const mY = 100;
			let lastRemTime = "";
			const milliSeconds = this.duration * 1000;
			// console.log(`Timer: ${milliSeconds}`);
			const dt = 50; // timer intervall for clock path
			const endTime = Date.now() + this.remTime;
			this.clockCircleVisibility = "hidden";
			this.clockPathVisibility = "visible";
			this.isRunning = true;
			this.startDisabled = true;
			this.stopDisabled = false;
			this.resetDisabled = true;
			this.fireEvent("timer-start");

			this.interval = setInterval(() => {
				this.remTime = endTime - Date.now();
				if (lastRemTime !== this.timerString(this.remTime)) {
					lastRemTime = this.timerString(this.remTime);
					this.timerText = lastRemTime;
				}
				const alpha = ((milliSeconds - this.remTime) / milliSeconds) * 2 * Math.PI;
				const dx = r * Math.sin(alpha);
				const dy = r * Math.cos(alpha);
				const laf = (this.remTime > milliSeconds / 2) ? 1 : 0;
				const sArc = `M ${mX - dx} ${mY + r - dy} A ${r} ${r} 0 ${laf} 0 ${mX} ${mY}`;
				// this.shadowRoot!.querySelector("#clockPath")!.setAttribute("d", sArc);
				this.clockPathArc = sArc;
				if (this.remTime <= 0) {
					// bellTriple.play();
					this.clockPathVisibility = "hidden";
					this.stopTimer();
					clearInterval(this.interval!);
					this.fireEvent("timer-finished", { nextRound: 3, nextDuration: 44 });
				}
			}, dt);
		}
	}

	onEnterDOM(): void {
		// console.log("onEnterDOM");
		this.startDisabled = false;
		this.stopDisabled = true;
		this.resetDisabled = true;
		// this.remTime = Number(this.duration) * 1000;
		// this.timerText = this.timerString(this.remTime);
	}

	onExitDOM(): void {
		// console.log("onExitDOM");
		if (this.isRunning) {
			clearInterval(this.interval!);
		}
	}

	onBeforeRendering(): void {
	}

	// helper function to format time
	timerString(remTime: number): string {
		const iSeconds = Math.floor(remTime / 1000 + 0.9);
		if (iSeconds > 60) {
			let sMin = ((iSeconds - (iSeconds % 60)) / 60).toString();
			let sSec = (iSeconds % 60).toString();
			sSec = (sSec.length === 1) ? `0${sSec}` : sSec;
			sMin = (sMin.length === 1) ? `0${sMin}` : sMin;
			return `${sMin}:${sSec}`;
		}
		return iSeconds.toString();
	}
}

UI5Timer.define();

export default UI5Timer;
