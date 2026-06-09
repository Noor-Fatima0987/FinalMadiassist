import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { moderateScale } from '../../utils/responsive';

export default function CountryCodePicker({ selectedValue, onValueChange }) {
  return (
    <View style={styles.container}>
      <Picker
        selectedValue={selectedValue}
        onValueChange={onValueChange}
        style={styles.picker}
        dropdownIconColor="#180991ff"
      >
        <Picker.Item label="🇵🇰 +92" value="+92" />
        <Picker.Item label="🇺🇸 +1" value="+1" />
        <Picker.Item label="🇬🇧 +44" value="+44" />
        <Picker.Item label="🇸🇦 +966" value="+966" />
        <Picker.Item label="🇦🇪 +971" value="+971" />
      </Picker>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: moderateScale(10),
    marginRight: moderateScale(8),
    width: moderateScale(115),
    justifyContent: 'center',
    height: moderateScale(50),
    backgroundColor: '#fff',
  },
  picker: {
    height: moderateScale(50),
    color: "#180991ff",
  }
});
