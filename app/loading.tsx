// Dependencies
import { StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

// Components
import Text from './components/text';

export default function Loading() {
  return (
    <View style={styles.loadingContainer}>
      <Text style={styles.loadingText}>Loading...</Text>
      <StatusBar style="dark" />
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontFamily: 'BebasNeue_400Regular',
    color: '#fff',
    fontSize: 16,
    fontWeight: 400,
  },
});