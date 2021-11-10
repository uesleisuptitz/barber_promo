import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {COLORS, ICONS} from '../assets';

const Frequency = ({
  frequency = 0,
  promotionFrequency,
  size = 8,
  style,
  freeService,
}) => {
  const s = StyleSheet.create({
    container: {
      backgroundColor: promotionFrequency
        ? COLORS.primary
        : frequency === 0
        ? COLORS.lightGray
        : COLORS.primary,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      width: 12 * size,
      height: 12 * size,
      borderRadius: 20 * size,
      elevation: 3,
    },
    majorFrequency: {
      color: COLORS.white,
      fontSize: 6 * size,
      marginLeft: 1 * size,
      textShadowOffset: {width: 0.5, height: 0.5},
      textShadowRadius: 5,
      textShadowColor: COLORS.gray,
    },
    frequencyLimit: {
      color: COLORS.white,
      fontSize: 2 * size,
      marginBottom: 1 * size,
      textShadowOffset: {width: 0.5, height: 0.5},
      textShadowRadius: 1,
      textShadowColor: COLORS.gray,
    },
    freeService: {tintColor: COLORS.white, height: 40, width: 40},
  });

  return (
    <View style={[s.container, style]}>
      {freeService ? (
        <Image source={ICONS.promotion} style={s.freeService} />
      ) : (
        <>
          <Text style={s.majorFrequency}>{frequency}</Text>
          <Text style={s.frequencyLimit}>/{promotionFrequency}</Text>
        </>
      )}
    </View>
  );
};

export default Frequency;
