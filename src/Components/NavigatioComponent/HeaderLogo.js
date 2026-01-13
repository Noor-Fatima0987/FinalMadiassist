import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

const HeaderLogo = () => {
    return (
        <View style={styles.container}>
            <Image
                source={require('../../../assets/assets/MediAssistLogo.jpeg')}
                style={styles.logo}
                resizeMode="contain"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingLeft: 20,
    },
    logo: {
        width: 40,
        height: 40,
        borderRadius: 20, // Optional: make it circular if it looks better
    },
});

export default HeaderLogo;
