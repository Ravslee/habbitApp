import React, { useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Animated, {
    useSharedValue,
    withTiming,
    useAnimatedStyle,
    interpolate,
    Extrapolation,
    AnimatableValue,
    WithTimingConfig,
} from 'react-native-reanimated';

interface CircularProgressProps {
    progress: number; // 0 to 1
    size?: number;
    strokeWidth?: number;
    color?: string;
    backgroundColor?: string;
    containerColor?: string;
    children?: React.ReactNode;
}

const CircularProgress: React.FC<CircularProgressProps> = ({
    progress,
    size = 200,
    strokeWidth = 15,
    color = '#8b56fc', // Default purple
    backgroundColor = '#333',
    containerColor = 'transparent',
    children,
}) => {
    const progressValue = useSharedValue(0);

    useEffect(() => {
        progressValue.value = withTiming(progress, { duration: 1000 });
    }, [progress]);

    const halfSize = size / 2;

    // First Half (0-50%): Fills the Right side (12 -> 6 o'clock)
    // Inner Circle is a LEFT semi-circle (Bottom+Left borders)
    // Container is Right Half.
    // We rotate the Inner Circle 0 -> 180.
    const firstHalfStyle = useAnimatedStyle(() => {
        const theta = interpolate(
            progressValue.value,
            [0, 0.5],
            [0, 180],
            Extrapolation.CLAMP
        );
        // Base rotation 45deg aligns the Left+Bottom borders to be distinct "Left Semi Circle"
        // Then we add theta to rotate it into view from the left side (hidden) to right side (visible)
        return {
            transform: [{ rotate: `${45 + theta}deg` }],
            opacity: interpolate(progressValue.value, [0, 0.01], [0, 1], Extrapolation.CLAMP),
        };
    });

    // Second Half (50-100%): Fills the Left side (6 -> 12 o'clock)
    // Inner Circle is a RIGHT semi-circle (Top+Right borders)
    // Container is Left Half.
    // We rotate the Inner Circle 0 -> 180.
    const secondHalfStyle = useAnimatedStyle(() => {
        const theta = interpolate(
            progressValue.value,
            [0.5, 1],
            [0, 180],
            Extrapolation.CLAMP
        );
        return {
            transform: [{ rotate: `${45 + theta}deg` }],
            opacity: interpolate(progressValue.value, [0.5, 0.51], [0, 1], Extrapolation.CLAMP),
        };
    });

    // End Cap Rotation
    const endCapStyle = useAnimatedStyle(() => {
        const theta = interpolate(
            progressValue.value,
            [0, 1],
            [0, 360],
            Extrapolation.CLAMP
        );
        return {
            transform: [{ rotate: `${theta}deg` }],
            opacity: interpolate(progressValue.value, [0, 0.001], [0, 1], Extrapolation.CLAMP),
        };
    });

    return (
        <View style={{
            width: size,
            height: size,
            borderRadius: size / 2, // Make container circular
            backgroundColor: containerColor, // Needed for shadow on Android
            justifyContent: 'center',
            alignItems: 'center',
            // Add elevation/shadow
            shadowColor: color,
            shadowOffset: { width: 0, height: 15 },
            shadowOpacity: 0.8,
            shadowRadius: 30,
            elevation: 40,
        }}>
            {/* Background Track */}
            <View
                style={{
                    width: size,
                    height: size,
                    borderRadius: size / 2,
                    borderWidth: strokeWidth,
                    borderColor: backgroundColor,
                    position: 'absolute',
                }}
            />

            {/* Right Half Container (0-50%) */}
            <View
                style={{
                    width: halfSize + 1, // Overlap to prevent gap
                    height: size,
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    overflow: 'hidden',
                }}
            >
                {/* Rotating Inner Circle for Right Half */}
                <Animated.View
                    style={[
                        {
                            width: size,
                            height: size,
                            borderRadius: size / 2,
                            borderWidth: strokeWidth,
                            borderColor: 'transparent',
                            borderLeftColor: color,   // Left
                            borderBottomColor: color, // Bottom
                            position: 'absolute',
                            top: 0,
                            right: 0,
                        },
                        firstHalfStyle,
                    ]}
                />
            </View>

            {/* Left Half Container (50-100%) */}
            <View
                style={{
                    width: halfSize + 1, // Overlap to prevent gap
                    height: size,
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    overflow: 'hidden',
                    // zIndex: 1,
                }}
            >
                {/* Rotating Inner Circle for Left Half */}
                <Animated.View
                    style={[
                        {
                            width: size,
                            height: size,
                            borderRadius: size / 2,
                            borderWidth: strokeWidth,
                            borderColor: 'transparent',
                            borderTopColor: color,   // Top
                            borderRightColor: color, // Right
                            position: 'absolute',
                            top: 0,
                            left: 0,
                        },
                        secondHalfStyle,
                    ]}
                />
            </View>

            {/* Start Cap (Static) */}
            <View
                style={{
                    width: strokeWidth,
                    height: strokeWidth,
                    borderRadius: strokeWidth / 2,
                    backgroundColor: color,
                    position: 'absolute',
                    top: 0,
                    left: (size - strokeWidth) / 2,
                    opacity: progress > 0 ? 1 : 0,
                }}
            />

            {/* End Cap (Rotated) */}
            <Animated.View
                style={[
                    {
                        width: size,
                        height: size,
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        justifyContent: 'flex-start', // Cap at top
                        alignItems: 'center', // Centered horizontally
                    },
                    endCapStyle
                ]}
            >
                <View
                    style={{
                        width: strokeWidth,
                        height: strokeWidth,
                        borderRadius: strokeWidth / 2,
                        backgroundColor: color,
                        marginTop: 0, // Top of container
                    }}
                />
            </Animated.View>

            {/* Inner Content */}
            <View style={{ position: 'absolute', alignItems: 'center', justifyContent: 'center' }}>
                {children}
            </View>
        </View>
    );
};

export default CircularProgress;
