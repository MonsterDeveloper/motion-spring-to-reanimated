# motion-spring-to-reanimated

[![npm version](https://badge.fury.io/js/motion-spring-to-reanimated.svg)](https://badge.fury.io/js/motion-spring-to-reanimated)
[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)

A small utility to convert [framer-motion](https://motion.dev/) spring options to [react-native-reanimated](https://github.com/software-mansion/react-native-reanimated) spring configuration.

## Installation

```bash
npm install motion-spring-to-reanimated
# or
yarn add motion-spring-to-reanimated
# or
bun add motion-spring-to-reanimated
```

## Usage

```typescript
import { motionSpringToReanimated } from 'motion-spring-to-reanimated';
import { useSharedValue } from 'react-native-reanimated';
import { withSpring } from 'react-native-reanimated';

const rotation = useSharedValue(0);

// Simple bounce animation
rotation.value = withSpring(180, motionSpringToReanimated({ bounce: 0.3 }));

// Duration-based spring
rotation.value = withSpring(180, motionSpringToReanimated({ 
  duration: 800, 
  bounce: 0.2 
}));

// Physics-based spring with custom parameters
rotation.value = withSpring(180, motionSpringToReanimated({ 
  stiffness: 100, 
  damping: 15,
  mass: 1
}));

// With velocity and from/to for better mapping
rotation.value = withSpring(180, motionSpringToReanimated({ 
  bounce: 0.4,
  velocity: 2,
  from: 0,
  to: 180
}));
```

## API

### `motionSpringToReanimated(options?)`

Converts framer-motion spring options to react-native-reanimated spring configuration.

#### Parameters

- `options` (optional): Motion spring options object

#### Motion Spring Options

| Property | Type | Description |
|----------|------|-------------|
| `bounce` | `number` | Controls the "bounciness" of the spring (0-1). Creates duration-based spring when specified. |
| `duration` | `number` | Duration of the animation in milliseconds. Creates duration-based spring when specified. |
| `stiffness` | `number` | Spring stiffness (default: 100). Used for physics-based springs. |
| `damping` | `number` | Spring damping (default: 10). Used for physics-based springs. |
| `mass` | `number` | Spring mass (default: 1). |
| `velocity` | `number` | Initial velocity (default: 0). |
| `restSpeed` | `number` | Speed threshold for when the animation is considered at rest. |
| `restDelta` | `number` | Displacement threshold for when the animation is considered at rest. |
| `from` | `number` | Starting value (used for better rest threshold calculation). |
| `to` | `number` | Target value (used for better rest threshold calculation). |

#### Returns

A `WithSpringConfig` object compatible with react-native-reanimated's `withSpring`.

## Spring Types

### Physics-based Springs (Default)
When no `duration` or `bounce` is specified, the library uses physics-based defaults:
- `stiffness: 100`
- `damping: 10` 
- `mass: 1`

### Duration-based Springs
When `duration` or `bounce` is specified, the library automatically calculates the appropriate `stiffness` and `damping` values to achieve the desired duration and bounce characteristics.

## Visualizing Springs

For a better understanding of spring animations, check out this excellent [spring visualization tool](https://emilkowal.ski/ui/great-animations#great-animations-feel-natural) by Emil Kowalski.

## Motion Documentation

For more information about framer-motion spring options, see the [official documentation](https://motion.dev/docs/react-transitions#spring).

## License

GPL-3.0-only

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.


