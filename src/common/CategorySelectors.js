import {Pressable, StyleSheet, Text, View} from "react-native";
import React from "react";
import {Separator} from "./ListButtons";

export const CategorySelector = ({ weeklyGoalsCategoryId, categories, disabledCategories, selectCategory }) => {
    const isDisabled = (categoryId) => {
        if (!disabledCategories || disabledCategories.length === 0) return false;
        return disabledCategories.includes(categoryId);
    }
    return (<View style={styles.selectorContainer}>
        <SelectorButton key="weekly-planning" text="Weekly Planning" onPress={() => selectCategory(weeklyGoalsCategoryId)}
                        disabled={isDisabled(weeklyGoalsCategoryId)} />
        <Separator />
        {Object.keys(categories).map((categoryId) => {
            const disabled = isDisabled(categoryId);
            return (
                <SelectorButton key={categoryId} text={categories[categoryId]?.name}
                                onPress={() => selectCategory(categoryId)} disabled={disabled} />
            )
        })}
    </View>)
}

export const GoalSelector = ({ tasks, goalIds, selectGoal, setSelectingNewGoal }) => {
    return (<View style={styles.selectorContainer}>
        {goalIds.map((goalId, index) => {
            const goalTask = tasks[goalId];
            return goalTask
                ? <SelectorButton key={goalId} name={tasks[goalId]?.name} onPress={() => selectGoal(goalId)} />
                : <SelectorButton key={`empty${index}`} name='Add a new goal' onPress={() => setSelectingNewGoal(true)} />
        })}
    </View>)
}

const SelectorButton = ({ text, onPress, color, disabled }) => {
    return (
        <Pressable style={[styles.goalButton, { backgroundColor: color }]} onPress={onPress} disabled={disabled}>
            <Text>{text}</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    selectorContainer: {
        flex: 1,
        padding: 10,
        flexDirection: 'column',
    },
    newGoalButton: {
        padding: 10,
        borderWidth: 1,
        borderColor: 'black',
        margin: 5,
        borderRadius: 5,
        backgroundColor: 'lightgreen',
    },
    goalButton: {
        padding: 10,
        borderWidth: 1,
        borderColor: 'black',
        margin: 5,
        borderRadius: 5,
    },
});
