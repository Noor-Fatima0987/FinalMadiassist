import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@shopify/restyle';

const BackButton = () => {
    const navigation = useNavigation();
    const { colors } = useTheme();

    return (
        <TouchableOpacity
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
            style={{
                marginLeft: 15,
                backgroundColor: 'transparent',
            }}
        >
            <Ionicons name="chevron-back" size={28} color={colors.primary} />
        </TouchableOpacity>
    );
};

export default BackButton;
