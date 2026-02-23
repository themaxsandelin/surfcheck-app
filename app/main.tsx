// Dependencies
import Constants from 'expo-constants';
import { useState, useRef, useMemo } from 'react';
import { StyleSheet, Text, View, Pressable, Share, Alert, Linking, Dimensions } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { IconLoader, IconReload, IconChartBar, IconShare2 } from '@tabler/icons-react-native';
import * as MediaLibrary from 'expo-media-library';
import { captureRef } from 'react-native-view-shot';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlatList } from 'react-native';
import { DateTime } from 'luxon';
import { File, Paths } from 'expo-file-system';

// Components
import Polygon from './icons/polygon';

interface ApiResponse {
  response: string;
  weatherData: {
    time: string;
    location: {
      name: string;
      lat: number;
      lon: number;
    };
    temperature: {
      value: number;
      unit: string;
    };
    wind: {
      speed: number;
      speedUnit: string;
      direction: string;
    };
    waves: {
      height: number;
      heightUnit: string;
      direction: string;
    };
    swell: {
      height: number;
      heightUnit: string;
      direction: string;
    };
    tide: {
      height: number;
      heightUnit: string;
    };
  };
}

export default function Main() {
  const imageRef = useRef<View>(null);
  const [mediaLibraryPermission, requestMediaLibraryPermission] = MediaLibrary.usePermissions();
  const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

  const [surfKey, setSurfKey] = useState<number>(0);
  const [isDeetsOpen, setIsDeetsOpen] = useState<boolean>(false);
  const [showData, setShowData] = useState<boolean>(false);

  const { data, isLoading } = useQuery<ApiResponse>({
    queryKey: ['surfcheck', surfKey],
    queryFn: async () => {
      const response = await fetch('https://surfcheck-backend-production.up.railway.app/should-i-surf', {
        headers: {
          'x-api-key': Constants.expoConfig?.extra?.apiKey
        }
      });
      return response.json();
    },
    enabled: surfKey > 0 && showData,
  });

  const tideHeight = useMemo(() => {
    if (!data) {
      return '';
    }
    if (data.weatherData.tide.height === 0) {
      return 'Even';
    }

    return data.weatherData.tide.height < 0 ? 'Low' : 'High';
  }, [data]);

  const tideRotate = useMemo(() => {
    return tideHeight === 'Low' ? '180deg' : '0deg';
  }, [tideHeight]);

  const dataTime = useMemo(() => {
    if (!data) {
      return '';
    }

    return DateTime.fromISO(data.weatherData.time, { zone: 'UTC' }).toFormat('h:mm a');
  }, [data]);

  const deets = useMemo(() => {
    if (!data) {
      return [];
    }

    return [
      {
        label: 'Location',
        value: data.weatherData.location.name,
      },
      {
        label: 'Wave Height',
        value: `${data.weatherData.waves.height} ${data.weatherData.waves.heightUnit}`,
      },
      {
        label: 'Swell Direction',
        value: data.weatherData.swell.direction,
      },
      {
        label: 'Wind',
        value: `${data.weatherData.wind.speed} ${data.weatherData.wind.speedUnit} ${data.weatherData.wind.direction}`,
      },
      {
        label: 'Weather',
        value: `${data.weatherData.temperature.value} ${data.weatherData.temperature.unit}`,
      },
      {
        label: 'Tide',
        value: `${data.weatherData.tide.height} ${data.weatherData.tide.heightUnit} / ${tideHeight} @ ${dataTime}`,
      },
      {
        label: 'Conditions',
        value: "It'll do",
      }
    ];
  }, [data]);

  const homeTextDetails = useMemo(() => {
    if (SCREEN_WIDTH < 400) {
      return {
        fontSize: 95,
        lineHeight: 105,
      };
    } else if (SCREEN_WIDTH < 440) {
      return {
        fontSize: 110,
        lineHeight: 120,
      };
    }
    return {
      fontSize: 125,
      lineHeight: 135,
    };
  }, [SCREEN_WIDTH]);

  return (
    <SafeAreaView style={styles.homeContainer}>
      {showData && data && !isLoading && (
        <View style={{
          ...styles.dataContainer,
          opacity: isDeetsOpen ? 0 : 1,
        }}>
          <View style={styles.dataContentContainer}>
            <View style={styles.dataContentWrapper} ref={imageRef} collapsable={false}>
              <Text style={{ fontFamily: 'BebasNeue_400Regular', ...homeTextDetails, color: '#fff', textAlign: 'center', fontWeight: 400 }}>Yes</Text>
              <Text style={{ fontFamily: 'Abel_400Regular', fontSize: 45, lineHeight: 58, color: '#fff', textAlign: 'center', fontWeight: 400 }}>
                {data.response}
              </Text>
            </View>
            <Pressable
              style={({ pressed }) => {
                return {
                  opacity: pressed ? 0.75 : 1,
                };
              }}
              onPress={() => {
                setShowData(false);
                setSurfKey(prev => prev + 1);
              }}
            >
              <View style={{ width: 50, height: 50, borderRadius: 6, borderWidth: 2, borderColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <IconReload size={24} stroke="#fff" />
              </View>
            </Pressable>
          </View>
          <View style={styles.dataButtonContainer}>
            <View style={{...styles.dataButtonWrapper, paddingRight: 8}}>
              <Pressable
                onPress={() => {
                  setIsDeetsOpen(prev => !prev);
                }}
                style={({ pressed }) => {
                  return {
                    ...styles.dataButton,
                    opacity: pressed ? 0.75 : 1,
                  };
                }}
              >
                <IconChartBar size={18} stroke="#fff" />
                <Text style={styles.dataButtonText}>The Deets</Text>
              </Pressable>
            </View>

            <View style={{ ...styles.dataButtonWrapper, paddingLeft: 8 }}>
              <Pressable
                onPress={async () => {
                  if (mediaLibraryPermission) {
                    if (mediaLibraryPermission.status === 'granted') {
                      const screenshot = await captureRef(imageRef, {
                        format: 'jpg',
                      });
                      const namedFile = new File(Paths.cache, 'should-i-surf-today.jpg');
                      if (namedFile.exists) {
                        namedFile.delete();
                      }
                      const sourceFile = new File(screenshot);
                      sourceFile.copy(namedFile);
                      await Share.share({
                        message: "Should I surf today?",
                        url: namedFile.uri,
                      });
                      namedFile.delete();
                    } else if (mediaLibraryPermission.status === 'denied') {
                      if (mediaLibraryPermission.canAskAgain) {
                        await requestMediaLibraryPermission();
                      } else {
                        Alert.alert("Action Required", "Please grant permission to your device's media library to share the screenshot.", [
                          {
                            text: 'Cancel',
                            style: 'cancel',
                          },
                          {
                            text: 'Open Settings',
                            onPress: () => {
                              Linking.openSettings();
                            },
                          }
                        ]);
                      }
                    }
                  } else {
                    await requestMediaLibraryPermission();
                  }
                }}
                style={({ pressed }) => {
                  return {
                    ...styles.dataButton,
                    opacity: pressed ? 0.75 : 1,
                  };
                }}
              >
                <IconShare2 size={18} stroke="#fff" />
                <Text style={styles.dataButtonText}>Share</Text>
              </Pressable>
            </View>
          </View>
        </View>
      )}
      {isDeetsOpen && (
        <View style={styles.deetsContainer}>
          <View style={styles.deetsCard}>
            <Text style={styles.deetsTitle}>Go get some</Text>
            <FlatList
              scrollEnabled={false}
              data={deets}
              keyExtractor={(item) => item.label}
              renderItem={({ item, index }) => (
                <View style={{...styles.deetsItem, borderBottomWidth: index === deets.length - 1 ? 0 : 2}}>
                  <Text style={styles.deetsItemText}>{item.label}</Text>
                  <View style={styles.deetsItemTextWrapper}>
                    {item.label === 'Tide' && (
                      <Polygon
                        color="#fff"
                        size={10}
                        style={{ transform: [{ rotate: tideRotate }] }}
                      />
                    )}
                    <Text style={styles.deetsItemText}>{item.value}</Text>
                  </View>
                </View>
              )}
            />
            <Pressable
              style={({ pressed }) => {
                return {
                  ...styles.deetsButton,
                  opacity: pressed ? 0.75 : 1,
                };
              }}
              onPress={() => {
                setIsDeetsOpen(false);
              }}
            >
              <Text style={styles.deetsButtonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      )}
      {isLoading && (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <IconLoader size={24} stroke="#fff" opacity={0.5} />
        </View>
      )}
      {(!showData || !data) && !isLoading && (
        <Pressable
          style={({ pressed }) => {
            return {
              opacity: pressed ? 0.75 : 1,
            };
          }}
          onPress={() => {
            setSurfKey(prev => prev + 1);
            setShowData(true);
          }}
        >
          <Text style={{ ...styles.homeText, ...homeTextDetails }}>
            Should{"\n"}I surf{"\n"}today?
          </Text>
        </Pressable>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  deetsContainer: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
    alignItems: 'center',
    justifyContent: 'center',
    boxSizing: 'border-box',
    padding: 16
  },
  deetsCard: {
    width: '100%',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#fff',
    borderStyle: 'solid',
    padding: 16,
  },
  deetsTitle: {
    width: '100%',
    fontFamily: 'Abel_400Regular',
    fontSize: 45,
    lineHeight: 58,
    color: '#fff',
    textAlign: 'center',
    fontWeight: 400,
    marginTop: 19,
    marginBottom: 35
  },
  deetsItem: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    boxSizing: 'border-box',
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#fff',
    borderStyle: 'solid'
  },
  deetsItemTextWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4
  },
  deetsItemText: {
    fontFamily: 'Abel_400Regular',
    fontSize: 20,
    lineHeight: 26,
    color: '#fff',
    fontWeight: 400
  },
  deetsButton: {
    width: '100%',
    height: 50,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#fff',
    borderStyle: 'solid',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxSizing: 'border-box',
    marginTop: 32
  },
  deetsButtonText: {
    fontFamily: 'Abel_400Regular',
    fontSize: 20,
    lineHeight: 26,
    color: '#fff',
    fontWeight: 400,
  },
  dataContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 140,
    boxSizing: 'border-box'
  },
  dataContentContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    boxSizing: 'border-box'
  },
  dataContentWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000',
    paddingTop: 40,
    paddingBottom: 40,
    paddingLeft: 16,
    paddingRight: 16,
    boxSizing: 'border-box'
  },
  dataButtonContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    boxSizing: 'border-box',
    paddingHorizontal: 16,
    marginBottom: 50
  },
  dataButtonWrapper: {
    width: '50%',
    boxSizing: 'border-box'
  },
  dataButton: {
    width: '100%',
    height: 50,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#fff',
    borderStyle: 'solid',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    boxSizing: 'border-box',
  },
  dataButtonText: {
    fontFamily: 'Abel_400Regular',
    fontSize: 20,
    lineHeight: 26,
    color: '#fff',
    fontWeight: 400,
  },
  homeContainer: {
    flex: 1,
    backgroundColor: '#000',
    color: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  homeText: {
    width: '100%',
    maxWidth: 270,
    textDecorationLine: 'underline',
    fontFamily: 'BebasNeue_400Regular',
    color: '#fff',
    textAlign: 'center',
  }
});