import type { WithSpringConfig } from "react-native-reanimated"
import type { MotionSpringOptions } from "./types.js"

export function motionSpringToReanimated(
	options?: MotionSpringOptions,
): WithSpringConfig {
	const {
		stiffness,
		damping,
		mass,
		velocity = 0,
		duration,
		bounce,
		restSpeed,
		restDelta,
		from,
		to,
	} = options ?? {}

	const delta =
		typeof from === "number" && typeof to === "number"
			? Math.abs(to - from)
			: Number.POSITIVE_INFINITY

	const restSpeedThreshold =
		restSpeed ??
		(delta < 5
			? SPRING_DEFAULTS.restSpeed.granular
			: SPRING_DEFAULTS.restSpeed.default)

	const restDisplacementThreshold =
		restDelta ??
		(delta < 5
			? SPRING_DEFAULTS.restDelta.granular
			: SPRING_DEFAULTS.restDelta.default)

	const isDurationBased = duration !== undefined || bounce !== undefined

	let finalStiffness: number
	let finalDamping: number
	let finalMass: number

	if (isDurationBased) {
		const derived = findSpring({ duration, bounce, velocity, mass: 1 })
		finalStiffness = derived.stiffness
		finalDamping = derived.damping
		finalMass = 1
	} else {
		finalStiffness = stiffness ?? SPRING_DEFAULTS.stiffness
		finalDamping = damping ?? SPRING_DEFAULTS.damping
		finalMass = mass ?? SPRING_DEFAULTS.mass
	}

	return {
		stiffness: finalStiffness,
		damping: finalDamping,
		mass: finalMass,
		velocity,
		restDisplacementThreshold,
		restSpeedThreshold,
		overshootClamping: false, // let it overshoot – matches Framer default
	}
}

const SPRING_DEFAULTS = {
	stiffness: 100,
	damping: 10,
	mass: 1,
	velocity: 0,
	duration: 800, // in ms
	bounce: 0.3,
	restSpeed: { granular: 0.01, default: 2 },
	restDelta: { granular: 0.005, default: 0.5 },

	// Limits used by Framer’s solver
	minDuration: 0.01, // in seconds
	maxDuration: 10, // in seconds
	minDamping: 0.05,
	maxDamping: 1,
}

/**
 * Re-implementation of framer-motion’s `findSpring`.
 * Converts (duration, bounce, velocity) → (stiffness, damping)
 */
function findSpring({
	duration = SPRING_DEFAULTS.duration,
	bounce = SPRING_DEFAULTS.bounce,
	velocity = SPRING_DEFAULTS.velocity,
	mass = SPRING_DEFAULTS.mass,
}: {
	duration?: number
	bounce?: number
	velocity?: number
	mass?: number
}) {
	// Helper conversions
	const msToSec = (ms: number) => ms / 1000
	const secToMs = (s: number) => s * 1000
	const clamp = (min: number, max: number, v: number) =>
		Math.min(Math.max(v, min), max)
	const calcAngularFreq = (undampedFreq: number, dampingRatio: number) =>
		undampedFreq * Math.sqrt(1 - dampingRatio * dampingRatio)

	// 1. Normalise + clamp input
	let dampingRatio = 1 - bounce
	dampingRatio = clamp(
		SPRING_DEFAULTS.minDamping,
		SPRING_DEFAULTS.maxDamping,
		dampingRatio,
	)
	const durationSec = clamp(
		SPRING_DEFAULTS.minDuration,
		SPRING_DEFAULTS.maxDuration,
		msToSec(duration),
	)

	// 2. Build envelope/derivative functions for Newton iteration
	const safeMin = 0.001
	type Fn = (n: number) => number
	let envelope: Fn
	let derivative: Fn

	if (dampingRatio < 1) {
		envelope = (undampedFreq) => {
			const exponentialDecay = undampedFreq * dampingRatio
			const delta = exponentialDecay * durationSec
			const a = exponentialDecay - velocity
			const b = calcAngularFreq(undampedFreq, dampingRatio)
			const c = Math.exp(-delta)
			return safeMin - (a / b) * c
		}
		derivative = (undampedFreq) => {
			const exponentialDecay = undampedFreq * dampingRatio
			const delta = exponentialDecay * durationSec
			const d = delta * velocity + velocity
			const e = dampingRatio ** 2 * undampedFreq ** 2 * durationSec
			const f = Math.exp(-delta)
			const g = calcAngularFreq(undampedFreq ** 2, dampingRatio)
			const factor = -envelope(undampedFreq) + safeMin > 0 ? -1 : 1
			return (factor * ((d - e) * f)) / g
		}
	} else {
		envelope = (undampedFreq) => {
			const a = Math.exp(-undampedFreq * durationSec)
			const b = (undampedFreq - velocity) * durationSec + 1
			return -safeMin + a * b
		}
		derivative = (undampedFreq) => {
			const a = Math.exp(-undampedFreq * durationSec)
			const b = (velocity - undampedFreq) * (durationSec * durationSec)
			return a * b
		}
	}

	// 3. Newton–Raphson to find undamped frequency
	const ITERATIONS = 12
	let undampedFreq = 5 / durationSec
	for (let i = 0; i < ITERATIONS; i++) {
		undampedFreq -=
			(undampedFreq - envelope(undampedFreq)) / derivative(undampedFreq)
	}

	// 4. Convert to stiffness/damping
	if (Number.isNaN(undampedFreq)) {
		return {
			stiffness: SPRING_DEFAULTS.stiffness,
			damping: SPRING_DEFAULTS.damping,
			duration,
		}
	}

	const stiffness = undampedFreq ** 2 * mass
	const damping = dampingRatio * 2 * Math.sqrt(mass * stiffness)
	return { stiffness, damping, duration: secToMs(durationSec) }
}
