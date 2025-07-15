
import { expect, it } from "bun:test"
// @ts-expect-error No types for internal findSpring function
import { findSpring as findMotionSpring } from "../node_modules/motion-dom/dist/es/animation/generators/spring/find.mjs"
import { motionSpringToReanimated } from "./index.js"

it.each([
	{ duration: 700 },
	{ bounce: 0.4 },
	{ duration: 300, bounce: 0.4 },
	{ bounce: 0 },
	{ bounce: 1 },
	{ bounce: 1.5, duration: 500 },
	{ duration: 150, bounce: 0.2 },
	{ duration: 800, bounce: 0.6 },
	{ duration: 1000, bounce: 0 },
	{ duration: 250, bounce: 1 },
	{ duration: 600, bounce: 0.8 },
	{ duration: 100, bounce: 0.1 },
])("handles duration-based %j", (options) => {
	const motionSpring = findMotionSpring(options)
	const reanimatedSpring = motionSpringToReanimated(options)

	expect(reanimatedSpring.damping).toBeCloseTo(motionSpring.damping, 10)
	expect(reanimatedSpring.stiffness).toBeCloseTo(motionSpring.stiffness, 10)
	expect(reanimatedSpring.mass).toBe(1)
	expect(reanimatedSpring.velocity).toBe(0)
})

it.each([
	[{}, { stiffness: 100, damping: 10, mass: 1, velocity: 0 }],
	[
		{ stiffness: 100, damping: 10, mass: 1, velocity: 0 },
		{ stiffness: 100, damping: 10, mass: 1, velocity: 0 },
	],
	[
		{ stiffness: 100, damping: 10, mass: 1, velocity: 0 },
		{ stiffness: 100, damping: 10, mass: 1, velocity: 0 },
	],
])("handles physics-based %j", (options, expected) => {
	const reanimatedSpring = motionSpringToReanimated(options)

	expect(reanimatedSpring.damping).toBeCloseTo(expected.damping, 10)
	expect(reanimatedSpring.stiffness).toBeCloseTo(expected.stiffness, 10)
	expect(reanimatedSpring.mass).toBe(expected.mass)
	expect(reanimatedSpring.velocity).toBe(expected.velocity)
})
