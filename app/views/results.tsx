// Dependencies
import { useMemo, useRef } from 'react';
import { View, Pressable, StyleSheet, Dimensions, Alert, Linking, Share } from 'react-native';
import { IconReload, IconChartBar, IconShare2 } from '@tabler/icons-react-native';
import { captureRef } from 'react-native-view-shot';
import { File, Paths } from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';

// Components
import Text from '../components/text';

// Types
import { ShouldISurfApiResponse } from '../types/api';

interface ResultsViewProps {
  shouldISurfData: ShouldISurfApiResponse;
  isDeetsOpen: boolean;
  onReloadPress: () => void;
  onDeetsPress: () => void;
}

export default function ResultsView({ shouldISurfData, isDeetsOpen, onReloadPress, onDeetsPress }: ResultsViewProps) {
  const imageRef = useRef<View>(null);
  const [mediaLibraryPermission, requestMediaLibraryPermission] = MediaLibrary.usePermissions();
  const { width: SCREEN_WIDTH } = Dimensions.get('window');

  const homeTextDetails = useMemo(() => {
    if (SCREEN_WIDTH < 400) {
      return {
        fontSize: 95,
        lineHeight: 105,
      };
    } else if (SCREEN_WIDTH < 440) {
      return {
        fontSize: 110,
        lineHeight: 132,
        height: 120
      };
    }
    return {
      fontSize: 125,
      lineHeight: 150,
      height: 135
    };
  }, [SCREEN_WIDTH]);
  
  return (
    <View style={{
      ...styles.dataContainer,
      opacity: isDeetsOpen ? 0 : 1,
    }}>
      <View style={styles.dataTopContainer}></View>
      <View style={styles.dataContentContainer}>
        <View style={styles.dataContentWrapper} ref={imageRef} collapsable={false}>
          <Text style={{ ...styles.dataContentYesText, ...homeTextDetails }}>Yes</Text>
          <Text style={{ ...styles.dataContentResultText }}>
            {shouldISurfData.response}
          </Text>
        </View>
        <Pressable
          style={({ pressed }) => {
            return {
              opacity: pressed ? 0.75 : 1,
            };
          }}
          onPress={onReloadPress}
        >
          <View style={styles.dataContentReloadButton}>
            <IconReload size={24} stroke="#fff" />
          </View>
        </Pressable>
      </View>
      <View style={styles.dataButtonContainer}>
        <View style={{ ...styles.dataButtonWrapper, paddingRight: 8 }}>
          <Pressable
            onPress={onDeetsPress}
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
              if (!mediaLibraryPermission) {
                await requestMediaLibraryPermission();
              }
              if (mediaLibraryPermission && mediaLibraryPermission.status !== 'granted') {
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
                  return;
                }
              }

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
  );
}

const styles = StyleSheet.create({
  dataContainer: {
    width: '100%',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    boxSizing: 'border-box'
  },
  dataTopContainer: {
    width: '100%',
    flexGrow: 1
  },
  dataContentContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    boxSizing: 'border-box',
    paddingBottom: 34
  },
  dataContentWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 16,
    paddingRight: 16,
    boxSizing: 'border-box',
    paddingBottom: 27,
    paddingTop: 17,
    backgroundColor: 'black',
  },
  dataContentYesText: {
    fontFamily: 'BebasNeue_400Regular',
    color: '#fff',
    textAlign: 'center',
    fontWeight: 400,
  },
  dataContentResultText: {
    fontFamily: 'Abel_400Regular',
    fontSize: 45,
    lineHeight: 57,
    color: '#fff',
    textAlign: 'center',
    fontWeight: 400
  },
  dataContentReloadButton: {
    width: 50,
    height: 50,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dataButtonContainer: {
    width: '100%',
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    boxSizing: 'border-box',
    paddingHorizontal: 16
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
  }
});
