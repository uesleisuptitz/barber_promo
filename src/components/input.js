import React, {useState} from 'react';
import {
  StyleSheet,
  TextInput,
  Image,
  View,
  TouchableOpacity,
  Keyboard,
} from 'react-native';
import {COLORS, ICONS} from '../assets';
import {useTheme} from '../context';

const Input = ({
  secure,
  search,
  style,
  disabled,
  onChangeText = () => {},
  onBlur = () => {},
  ...rest
}) => {
  const [showPassword, setShowPassword] = useState(true);
  const [focus, setFocus] = useState(false);
  const {text} = useTheme();

  return (
    <View>
      <TextInput
        {...rest}
        secureTextEntry={secure ? showPassword : false}
        style={[
          s.input,
          (secure || search) && s.paddingRight,
          focus ? s.focus : {...s.blur, borderColor: text, color: text},
          disabled && s.disabled,
          style,
        ]}
        placeholderTextColor={disabled ? COLORS.lightGray : text}
        onFocus={() => !disabled && setFocus(true)}
        onBlur={() => {
          setFocus(false);
          onBlur();
        }}
        onChangeText={v => !disabled && onChangeText(v)}
        focusable={!disabled}
      />
      {secure && (
        <TouchableOpacity
          style={s.button}
          onPress={() => setShowPassword(!showPassword)}>
          <Image
            source={showPassword ? ICONS.secure : ICONS.notSecure}
            style={{tintColor: focus ? COLORS.primary : text}}
          />
        </TouchableOpacity>
      )}
      {search && (
        <TouchableOpacity
          style={s.button}
          onPress={() => setShowPassword(!showPassword)}>
          <Image
            source={ICONS.search}
            style={{
              tintColor: disabled
                ? COLORS.lightGray
                : focus
                ? COLORS.primary
                : COLORS.gray,
            }}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Input;

const s = StyleSheet.create({
  input: {
    width: 320,
    height: 55,
    display: 'flex',
    alignItems: 'center',
    fontSize: 16,
    fontWeight: '500',
    backgroundColor: 'transparent',
    borderRadius: 5,
    marginBottom: 15,
    paddingRight: 16,
    paddingLeft: 16,
  },
  paddingRight: {
    paddingRight: 42,
  },
  focus: {
    borderColor: COLORS.primary,
    borderWidth: 2,
    color: COLORS.primary,
  },
  blur: {
    borderWidth: 1,
  },
  add: {
    tintColor: COLORS.black,
    width: 20,
    height: 20,
  },
  button: {
    position: 'absolute',
    width: 40,
    height: 55,
    alignItems: 'center',
    justifyContent: 'center',
    right: 0,
  },
  disabled: {
    color: COLORS.lightGray,
    borderColor: COLORS.lightGray,
  },
});
