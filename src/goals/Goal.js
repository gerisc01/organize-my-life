import {Pressable, StyleSheet, Text, View} from "react-native";

export const GoalSummary = ({ goal }) => {
    return (<View>
        <Text>4/20/2025</Text>
        <Text>Streak: 5 days</Text>
        <Text>Description text</Text>
        <Text>Footnotes</Text>
    </View>)
}

export const Goal = ({ goal }) => {
    return (<View style={styles.goal}>
        <Text>{goal.name}</Text>
    </View>)
}

export const GoalEmpty = ({ addGoal }) => {
    return (<Pressable style={styles.emptyGoal} onPress={() => addGoal()}>
        <Text>Press to add focused goal</Text>
    </Pressable>)
}

const styles = StyleSheet.create({
    goal: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyGoal: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
