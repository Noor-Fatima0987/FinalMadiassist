import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const BackButton = () => {
    const navigation = useNavigation();

    return (
        <Pressable
            onPress={() => navigation.goBack()}
            style={({ pressed }) => [
                styles.container,
                { opacity: pressed ? 0.5 : 1 }
            ]}
        >
            <Ionicons name="chevron-back" size={28} color="#180991ff" />
        </Pressable>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingLeft: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default BackButton;
