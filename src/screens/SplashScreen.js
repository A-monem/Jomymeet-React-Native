import React from 'react';
import { StyleSheet } from 'react-native';
import SplashScreenMask from 'react-native-splash-screen-mask';
 
import IMAGE from '../assets/logo.png'
 
export default function SplashScreen({ navigation }){

    return (
      <SplashScreenMask
        imageSource={IMAGE}
        navigationAction={() => navigation.navigate('Login')}
        backgroundStyle={styles.backgroundStyle}
        duration={3000}
      />
    )
}
 
const styles = StyleSheet.create({
  backgroundStyle: {
    backgroundColor: '#fff',
  },
});