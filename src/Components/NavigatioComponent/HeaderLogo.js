import React from 'react';
import { Image, StyleSheet } from 'react-native';

const HeaderLogo = () => {
    return (
        <Image
            source={require('../../../assets/assets/MediAssistLogo.png')}
            style={styles.logo}
            resizeMode="contain"
        />
    );
};

const styles = StyleSheet.create({
    logo: {
        width: 44,
        height: 44,
        marginLeft: 14,
        backgroundColor: 'transparent',
    },
});

export default HeaderLogo;
