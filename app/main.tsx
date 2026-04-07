// Dependencies
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { useState, useRef, useEffect, useCallback } from 'react';
import { StyleSheet, Alert, View } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

// Views
import LandingView from './views/landing';
import LocationPickerView from './views/location-picker';
import DeetsView from './views/deets';
import ResultsView from './views/results';
import LoadingView from './views/loading';

// Components
import Footer from './components/footer';

// Types
import { LocationsApiResponse, ShouldISurfApiResponse, ApiLocation } from './types/api';
import DisclaimerView from './views/disclaimer';

const API_URI = process.env.EXPO_PUBLIC_API_URI;
const CACHE_KEY = 'shouldisurf-responses';

export default function Main() {
  const lastCachedKey = useRef<number>(-1);

  const [previousResponses, setPreviousResponses] = useState<string[]>([]);
  const [surfKey, setSurfKey] = useState<number>(0);
  const [isDeetsOpen, setIsDeetsOpen] = useState<boolean>(false);
  const [showData, setShowData] = useState<boolean>(false);
  const [showDisclaimer, setShowDisclaimer] = useState<boolean>(false);

  const [showLocationPicker, setShowLocationPicker] = useState<boolean>(false);
  const [locationAsked, setLocationAsked] = useState<boolean>(false);
  const [userLocationData, setUserLocationData] = useState<Location.LocationObject | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<ApiLocation | null>(null);

  const { data: shouldISurfData, isLoading: shouldISurfIsLoading } = useQuery<ShouldISurfApiResponse>({
    queryKey: ['surfcheck', surfKey, selectedLocation],
    queryFn: async () => {
      if (!selectedLocation) {
        return null;
      }

      try {
        const response = await fetch(`${API_URI}/should-i-surf`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': Constants.expoConfig?.extra?.apiKey
          },
          body: JSON.stringify({
            previousResponses,
            location: selectedLocation?.name
          }),
        });
        if (!response.ok) {
          Alert.alert("Error", "Ooops. Looks like we're having some technical difficulties. Please try again later.");
          return null;
        }
        const responseData = await response.json();
        return responseData;
      } catch (error) {
        console.error(error);
        Alert.alert("Error", "Ooops. Looks like we're having some technical difficulties. Please try again later.");
        return null;
      }
    },
    enabled: surfKey > 0 && showData,
  });

  const { data: locations, isLoading: locationsLoading } = useQuery<ApiLocation[] | null>({
    queryKey: ['locations'],
    queryFn: async () => {
      const response = await fetch(`${API_URI}/locations`, {
        method: 'GET',
        headers: {
          'x-api-key': Constants.expoConfig?.extra?.apiKey
        }
      });
      if (!response.ok) {
        Alert.alert("Error", "Ooops. Looks like we're having some technical difficulties. Please try again later.");
        return null;
      }
      const responseData: LocationsApiResponse = await response.json();
      return responseData.locations;
    }
  });

  // Load cached previous responses on mount
  useEffect(() => {
    AsyncStorage.getItem(CACHE_KEY).then((cached) => {
      if (cached) {
        setPreviousResponses(JSON.parse(cached));
      }
    });
  }, []);

  useEffect(() => {
    if (shouldISurfData?.response && surfKey !== lastCachedKey.current) {
      lastCachedKey.current = surfKey;
      const updated = [...previousResponses, shouldISurfData.response];
      if (updated.length > 20) {
        updated.shift();
      }
      setPreviousResponses(updated);
      AsyncStorage.setItem(CACHE_KEY, JSON.stringify(updated));
    }
  }, [shouldISurfData, surfKey]);

  const shouldISurfPress = useCallback(async () => {
    async function getCurrentLocation() {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const userLocationData = await Location.getCurrentPositionAsync({});
        setUserLocationData(userLocationData);
      }
    }
    if (!locationAsked) {
      await getCurrentLocation();
      setLocationAsked(true);
    }
    if (!selectedLocation) {
      setShowLocationPicker(true);
    } else {
      setSurfKey(prev => prev + 1);
      setShowData(true);
    }
  }, [locationAsked, selectedLocation, setShowLocationPicker, setSurfKey, setShowData]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentWrapper}>
        {showDisclaimer && (
          <Animated.View
            key="disclaimer"
            entering={FadeIn.duration(200)}
            exiting={FadeOut.duration(200)}
            style={StyleSheet.absoluteFill}
          >
            <DisclaimerView
              onClose={() => {
                setShowDisclaimer(false);
              }}
            />
          </Animated.View>
        )}
        {showLocationPicker && locations && !showDisclaimer && (
          <Animated.View
            key="location-picker"
            entering={FadeIn.duration(200)}
            exiting={FadeOut.duration(200)}
            style={StyleSheet.absoluteFill}
          >
            <LocationPickerView
              locations={locations}
              selectedLocation={selectedLocation}
              userLocationData={userLocationData}
              onSelectLocation={(location) => {
                if (!selectedLocation) {
                  setSelectedLocation(location);
                  setSurfKey(prev => prev + 1);
                  setShowLocationPicker(false);
                  setShowData(true);
                } else {
                  setSelectedLocation(location);
                  setShowLocationPicker(false);
                }
              }}
            />
          </Animated.View>
        )}
        {showData && shouldISurfData && !isDeetsOpen && !shouldISurfIsLoading && !showDisclaimer && (
          <Animated.View
            key="results"
            entering={FadeIn.duration(200)}
            exiting={FadeOut.duration(200)}
            style={StyleSheet.absoluteFill}
          >
            <ResultsView
              shouldISurfData={shouldISurfData}
              isDeetsOpen={isDeetsOpen}
              onReloadPress={() => {
                setShowData(false);
                setSurfKey(prev => prev + 1);
              }}
              onDeetsPress={() => {
                setIsDeetsOpen(prev => !prev);
              }}
            />
          </Animated.View>
        )}
        {shouldISurfData && isDeetsOpen && !showDisclaimer && (
          <Animated.View
            key="deets"
            entering={FadeIn.duration(200)}
            exiting={FadeOut.duration(200)}
            style={StyleSheet.absoluteFill}
          >
            <DeetsView
              shouldISurfData={shouldISurfData}
              onClose={() => {
                setIsDeetsOpen(false);
              }}
            />
          </Animated.View>
        )}
        {shouldISurfIsLoading && !showDisclaimer && (
          <Animated.View
            key="loading"
            entering={FadeIn.duration(200)}
            exiting={FadeOut.duration(200)}
            style={StyleSheet.absoluteFill}
          >
            <LoadingView />
          </Animated.View>
        )}
        {(!showData || !shouldISurfData) && !shouldISurfIsLoading && !showLocationPicker && !showDisclaimer && (
          <Animated.View
            key="landing"
            entering={FadeIn.duration(200)}
            exiting={FadeOut.duration(200)}
            style={StyleSheet.absoluteFill}
          >
            <LandingView
              shouldISurfPress={shouldISurfPress}
              selectedLocation={selectedLocation}
              setShowLocationPicker={setShowLocationPicker}
            />
          </Animated.View>
        )}
      </View>
      <Footer
        onPress={() => {
          setShowDisclaimer((current) => !current);
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    color: '#fff',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  contentWrapper: {
    width: '100%',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    position: 'relative',
  }
});