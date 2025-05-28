import React, { useRef } from "react";
import { StyleSheet } from "react-native";
import Animated, {useSharedValue, useAnimatedScrollHandler, useAnimatedRef} from "react-native-reanimated";

export const DraggableList = ({ data, renderItem, itemHeight = 60, containerStyle }) => {
    const scrollViewRef = useAnimatedRef(null);
    const scrollY = useSharedValue(0);

    const onScroll = useAnimatedScrollHandler((event) => {
        scrollY.value = event.contentOffset.y;
    });

    return (
        <Animated.ScrollView
            ref={scrollViewRef}
            onScroll={onScroll}
            scrollEventThrottle={16}
            style={[styles.container, containerStyle]}
            contentContainerStyle={styles.content}
        >
            {data.map((item, index) =>
                renderItem({
                    item,
                    index,
                    scrollViewRef,
                    scrollY,
                    itemHeight,
                })
            )}
        </Animated.ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        paddingVertical: 8,
    },
});
