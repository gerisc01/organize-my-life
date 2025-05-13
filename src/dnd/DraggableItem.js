// DraggableItem.js
import React, { useRef } from "react";
import { StyleSheet } from "react-native";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
} from "react-native-reanimated";
import { GestureDetector, Gesture } from "react-native-gesture-handler";

export const DraggableItem = ({ children, scrollViewRef, scrollY, itemHeight, onDragEnd }) => {
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const isDragging = useSharedValue(false);
    const scrollInterval = useRef(null);
    const startScrollY = useSharedValue(0);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { translateX: translateX.value },
            { translateY: translateY.value },
        ],
    }));

    const startAutoScroll = (direction) => {
        if (scrollInterval.current) return;
        scrollInterval.current = setInterval(() => {
            if (scrollViewRef.current) {
                const newY =
                    direction === "up"
                        ? Math.max(0, scrollY.value - 10)
                        : scrollY.value + 10;

                scrollViewRef.current.scrollTo({
                    y: newY,
                    animated: false,
                });
            }
        }, 50);
    };

    const stopAutoScroll = () => {
        if (scrollInterval.current) {
            clearInterval(scrollInterval.current);
            scrollInterval.current = null;
        }
    };

    const panGesture = Gesture.Pan()
        .onStart(() => {
            isDragging.value = true;
            startScrollY.value = scrollY.value;
        })
        .onUpdate((event) => {
            translateX.value = event.translationX;

            // Compensate for scroll movement
            const scrollDelta = scrollY.value - startScrollY.value;
            translateY.value = event.translationY + scrollDelta;

            // Auto-scroll trigger zones: 50px from top/bottom edge
            if (scrollViewRef.current) {
                scrollViewRef.current.measure((x, y, width, height, pageX, pageY) => {
                    const touchY = pageY + event.absoluteY;

                    if (touchY < pageY + 50) {
                        startAutoScroll("up");
                    } else if (touchY > pageY + height - 50) {
                        startAutoScroll("down");
                    } else {
                        stopAutoScroll();
                    }
                });
            }
        })
        .onEnd((event) => {
            scrollViewRef.current?.measure((x, y, width, height, pageX, pageY) => {
                const dropY = event.absoluteY - pageY + scrollY.value;
                const dropIndex = Math.floor(dropY / itemHeight);

                if (onDragEnd) onDragEnd(dropIndex);

                translateX.value = withSpring(0);
                translateY.value = withSpring(0);
                isDragging.value = false;
                stopAutoScroll();
            });
        });

    return (
        <GestureDetector gesture={panGesture}>
            <Animated.View style={[styles.itemContainer, animatedStyle]}>
                {children}
            </Animated.View>
        </GestureDetector>
    );
};

const styles = StyleSheet.create({
    itemContainer: {
        marginVertical: 4,
    },
});
