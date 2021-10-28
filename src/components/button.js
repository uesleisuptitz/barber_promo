import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {COLORS, SHADOW} from '../assets';

const Button = ({
  loading,
  label,
  onPress = () => {},
  style,
  disabled = false,
  size,
  ...rest
}) => {
  const getSizeButton = () => {
    switch (size) {
      case 'small':
        return {
          maxWidth: 320,
          paddingHorizontal: 35,
          height: 35,
        };
      default:
        return {
          width: 320,
          height: 55,
        };
    }
  };
  const getSizeButtonText = () => {
    switch (size) {
      case 'small':
        return {
          fontSize: 14,
        };
      default:
        return {
          fontSize: 16,
        };
    }
  };

  let shadow = !disabled ? SHADOW : {};
  const s = StyleSheet.create({
    button: {
      ...getSizeButton(size),
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: disabled ? COLORS.lightGray : COLORS.primary,
      borderRadius: 5,
      ...shadow,
    },
    text: {
      ...getSizeButtonText(size),
      textTransform: 'uppercase',
      color: disabled ? COLORS.gray : COLORS.white,
    },
  });

  return (
    <TouchableOpacity
      style={[s.button, style]}
      disabled={disabled}
      {...rest}
      onPress={!disabled ? () => onPress() : () => {}}>
      {loading ? (
        <ActivityIndicator color={COLORS.white} />
      ) : (
        <Text style={s.text}>{label || 'Label'}</Text>
      )}
    </TouchableOpacity>
  );
};

export default Button;
