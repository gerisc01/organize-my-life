import React, { useState } from "react";
import { Text, View, StyleSheet } from "react-native";
import { DraggableList } from "./DraggableList";
import { DraggableItem } from "./DraggableItem";

const TestDraggable = () => {
    const [tasks, setTasks] = useState([
        { id: 1, name: "Item 1" },
        { id: 2, name: "Item 2" },
        { id: 3, name: "Item 3" },
        { id: 4, name: "Item 4" },
        { id: 5, name: "Item 5" },
        { id: 6, name: "Item 6" },
        { id: 7, name: "Item 7" },
        { id: 8, name: "Item 8" },
        { id: 9, name: "Item 9" },
        { id: 10, name: "Item 10" },
        { id: 11, name: "Item 11" },
        { id: 12, name: "Item 12" },
        { id: 13, name: "Item 13" },
        { id: 14, name: "Item 14" },
        { id: 15, name: "Item 15" },
        { id: 16, name: "Item 16" },
        { id: 17, name: "Item 17" },
        { id: 18, name: "Item 18" },
        { id: 19, name: "Item 19" },
        { id: 20, name: "Item 20" },
    ]);

    const handleDragEnd = (index, movedBy) => {
        const newIndex = index + movedBy;
        if (newIndex < 0 || newIndex >= tasks.length) return;

        const updatedTasks = [...tasks];
        const [movedTask] = updatedTasks.splice(index, 1);
        updatedTasks.splice(newIndex, 0, movedTask);
        setTasks(updatedTasks);
    };

    return (
        <View style={{ flex: 1, padding: 20 }}>
            <DraggableList
                data={tasks}
                itemHeight={60}
                renderItem={({ item, index, scrollViewRef, scrollY, itemHeight }) => (
                    <DraggableItem
                        key={item.id}
                        scrollViewRef={scrollViewRef}
                        scrollY={scrollY}
                        itemHeight={itemHeight}
                        onDragEnd={(movedBy) => handleDragEnd(index, movedBy)}
                    >
                        <View style={styles.taskCard}>
                            <Text>{item.name}</Text>
                        </View>
                    </DraggableItem>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    taskCard: {
        backgroundColor: "#f0f0f0",
        padding: 16,
        borderRadius: 8,
    },
});

export default TestDraggable;
