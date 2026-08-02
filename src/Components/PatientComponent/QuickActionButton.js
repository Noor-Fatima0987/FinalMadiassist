import React from "react";
import { Pressable, Text, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@shopify/restyle";

const QuickActionButton = ({ icon, text, onPress, color = "#180991" }) => {
    const { colors } = useTheme();
    const activeColor = color === "#180991" ? colors.primary : color;
    return (
        <Pressable style={styles.container} onPress={onPress}>
            <View style={[styles.iconContainer, { backgroundColor: `${activeColor}15` }]}>
                <Ionicons name={icon} size={24} color={activeColor} />
            </View>
            <Text style={[styles.text, { color: colors.mainText }]}>{text}</Text>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        width: "22%",
        marginBottom: 10,
    },
    iconContainer: {
        width: 60,
        height: 60,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 8,
    },
    text: {
        fontSize: 12,
        fontWeight: "600",
        color: "#333",
        textAlign: "center",
    },
});

export default QuickActionButton;
