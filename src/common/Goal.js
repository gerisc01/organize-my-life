import { Text, View } from "react-native";

export const GoalSummary = ({ goal }) => {
    return (<View>
        <Text>4/20/2025</Text>
        <Text>Streak: 5 days</Text>
        <Text>Description text</Text>
        <Text>Footnotes</Text>
    </View>)
}

export const Goal = ({ goal }) => {
    return (<View>
        <Text>Do at least one task from...</Text>
        <Text>Improve Organization Site</Text>
        <Text>Show Big Goals</Text>
    </View>)
}
