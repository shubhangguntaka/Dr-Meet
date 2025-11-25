import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { AppHeader } from '../../components/AppHeader'

const BulletinScreen = () => {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <AppHeader />
      <View style={styles.content}>
        <Text>BulletinScreen</Text>
      </View>
    </SafeAreaView >
  )
}

export default BulletinScreen

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