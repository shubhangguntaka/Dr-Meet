import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { AppHeader } from '../../components/AppHeader'

const ShopScreen = () => {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <AppHeader />
      <View style={styles.content}>
        <Text>ShopScreen</Text>
      </View>
    </SafeAreaView >
  )
}

export default ShopScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
})