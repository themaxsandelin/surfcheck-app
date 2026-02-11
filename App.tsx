// Dependencies
import { StatusBar } from 'expo-status-bar';
import { useFonts } from '@expo-google-fonts/bebas-neue/useFonts';
import { BebasNeue_400Regular } from '@expo-google-fonts/bebas-neue/400Regular';
import { Abel_400Regular } from '@expo-google-fonts/abel/400Regular';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Views
import LoadingScreen from './app/loading';
import MainScreen from './app/main';

export default function App() {
  const queryClient = new QueryClient();

  let [fontsLoaded] = useFonts({
    BebasNeue_400Regular,
    Abel_400Regular
  });
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        {fontsLoaded ? <MainScreen /> : <LoadingScreen />}
      </SafeAreaProvider>
      <StatusBar style="light" />
    </QueryClientProvider>
  );
}


