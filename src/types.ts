import type { ReduceMotion } from "react-native-reanimated"

export interface VelocityOptions {
	velocity?: number

	/**
	 * End animation if absolute speed (in units per second) drops below this
	 * value and delta is smaller than `restDelta`. Set to `0.01` by default.
	 *
	 * @public
	 */
	restSpeed?: number

	/**
	 * End animation if distance is below this value and speed is below
	 * `restSpeed`. When animation ends, spring gets "snapped" to. Set to
	 * `0.01` by default.
	 *
	 * @public
	 */
	restDelta?: number
}

export interface DurationSpringOptions {
	/**
	 * The total duration of the animation. Set to `0.3` by default.
	 *
	 * @public
	 */
	duration?: number

	/**
	 * If visualDuration is set, this will override duration.
	 *
	 * The visual duration is a time, set in seconds, that the animation will take to visually appear to reach its target.
	 *
	 * In other words, the bulk of the transition will occur before this time, and the "bouncy bit" will mostly happen after.
	 *
	 * This makes it easier to edit a spring, as well as visually coordinate it with other time-based animations.
	 *
	 * @public
	 */
	visualDuration?: number

	/**
	 * `bounce` determines the "bounciness" of a spring animation.
	 *
	 * `0` is no bounce, and `1` is extremely bouncy.
	 *
	 * If `duration` is set, this defaults to `0.25`.
	 *
	 * Note: `bounce` and `duration` will be overridden if `stiffness`, `damping` or `mass` are set.
	 *
	 * @public
	 */
	bounce?: number
}

export interface MotionSpringOptions
	extends DurationSpringOptions,
		VelocityOptions {
	/**
	 * Stiffness of the spring. Higher values will create more sudden movement.
	 * Set to `100` by default.
	 *
	 * @public
	 */
	stiffness?: number

	/**
	 * Strength of opposing force. If set to 0, spring will oscillate
	 * indefinitely. Set to `10` by default.
	 *
	 * @public
	 */
	damping?: number

	/**
	 * Mass of the moving object. Higher values will result in more lethargic
	 * movement. Set to `1` by default.
	 *
	 * @public
	 */
	mass?: number

	from?: number
	to?: number

	/** How the animation responds to the device's reduced motion accessibility setting. */
	reduceMotion?: ReduceMotion
}
