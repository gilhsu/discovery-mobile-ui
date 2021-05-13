import React from 'react';
import { Button } from 'native-base';
import { StyleSheet, Text, View } from 'react-native';
import { useDispatch } from 'react-redux';

import { actionTypes } from '../../redux/action-types';

const OnboardingPage2 = () => {
  const dispatch = useDispatch();
  return (
    <View style={styles.root}>
      <Text>Page2</Text>
      <View>
        <Button
          onPress={() => dispatch({ type: actionTypes.COMPLETE_ONBOARDING })}
          style={{ paddingHorizontal: 20 }}
        >
          <Text>SKIP ONBOARDING</Text>
        </Button>
      </View>
    </View>
  );
};

export default OnboardingPage2;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});