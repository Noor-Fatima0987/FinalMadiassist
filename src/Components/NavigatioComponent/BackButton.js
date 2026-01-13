import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const BackButton = () => {
    const navigation = useNavigation();

    return (
        <TouchableOpacity
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
            style={{
                marginLeft: 15,
                backgroundColor: 'transparent',
            }}
        >
            <Ionicons name="chevron-back" size={28} color="#180991ff" />
        </TouchableOpacity>
    );
};

export default BackButton;
