import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  useColorScheme,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { SafeAreaView as SafeAreaViewContext } from 'react-native-safe-area-context';

const HomeScreen = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [isFasting, setIsFasting] = useState(false);
  const [fastStartTime, setFastStartTime] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [fastHistory, setFastHistory] = useState([]);
  
  // Updated color palette with different accent color
  const colors = {
    primary: isDarkMode ? '#4287f5' : '#2E6DD1', // Bright blue / Royal blue
    secondary: isDarkMode ? '#61dafb' : '#0096c7', // React blue / Medium blue
    accent: isDarkMode ? '#9370DB' : '#7B68EE', // Medium Purple / Medium Slate Blue
    success: '#3CB371', // Medium Sea Green 
    danger: '#F08080', // Softer red (Light Coral)
    background: isDarkMode ? '#1A1A2E' : '#E9F0F5', // Deep blue-black / Light blue-gray
    headerBg: isDarkMode ? '#202036' : '#D9E6F2', // Slightly lighter than background
    cardBg: isDarkMode ? 'rgba(66, 135, 245, 0.15)' : 'rgba(46, 109, 209, 0.08)', // Subtle blue
    text: isDarkMode ? '#FFFFFF' : '#333333',
    textSecondary: isDarkMode ? '#CCCCCC' : '#666666',
  }
  
  const textColor = {
    color: colors.text,
  };
  
  const secondaryTextColor = {
    color: colors.textSecondary,
  };

  useEffect(() => {
    let interval;
    if (isFasting) {
      interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - fastStartTime) / 1000);
        setCurrentTime(elapsed);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isFasting, fastStartTime]);

  const startFast = () => {
    const startTime = Date.now();
    setFastStartTime(startTime);
    setIsFasting(true);
    setCurrentTime(0);
  };

  const endFast = () => {
    const endTime = Date.now();
    const duration = Math.floor((endTime - fastStartTime) / 1000);
    const newFast = {
      id: Date.now().toString(),
      startTime: fastStartTime,
      endTime,
      duration,
    };
    setFastHistory([newFast, ...fastHistory]);
    setIsFasting(false);
    setFastStartTime(null);
  };

  const deleteFast = (id) => {
    setFastHistory(fastHistory.filter(fast => fast.id !== id));
  };

  const clearHistory = () => {
    setFastHistory([]);
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  // Ensure consistent colors across platforms
  const buttonColors = {
    success: '#3CB371', // Exact Medium Sea Green color
    danger: '#F08080',  // Exact Light Coral color
  };

  const buttonStyle = Platform.select({
    android: {
      paddingVertical: 12,
      paddingHorizontal: 30,
      borderRadius: 25,
      alignItems: 'center',
      justifyContent: 'center',
      marginVertical: 10,
      elevation: 0, // Remove elevation for Android
    },
    ios: {
      paddingVertical: 12,
      paddingHorizontal: 30,
      borderRadius: 25,
      alignItems: 'center',
      justifyContent: 'center',
      marginVertical: 10,
      elevation: 2, // Keep elevation for iOS
    }
  });

  return (
    <SafeAreaViewContext style={styles.container} edges={['top', 'right', 'bottom', 'left']}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />
      
      <View style={[styles.header, { 
        borderBottomWidth: 2, 
        borderBottomColor: colors.secondary,
        backgroundColor: colors.headerBg 
      }]}>
        <Text style={[styles.appTitle, { color: colors.accent }]}>FastwayApp</Text>
        <Text style={[styles.appSubtitle, { color: colors.primary }]}>Track your fasting journey</Text>
      </View>
      
      <View style={[styles.fastingControl, { 
        borderBottomWidth: 2, 
        borderBottomColor: colors.secondary,
        backgroundColor: colors.headerBg
      }]}>
        {isFasting ? (
          <>
            <View style={styles.counterContainer}>
              <Text style={[styles.counterText, { color: colors.accent }]}>
                {formatTime(currentTime)}
              </Text>
            </View>
            <TouchableOpacity 
              style={[
                styles.button, 
                buttonStyle, 
                { backgroundColor: buttonColors.danger }
              ]} 
              onPress={endFast}
            >
              <Text style={styles.buttonText}>End Fast</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity 
            style={[
              styles.button, 
              buttonStyle, 
              { backgroundColor: buttonColors.success }
            ]} 
            onPress={startFast}
          >
            <Text style={styles.buttonText}>Start Fast</Text>
          </TouchableOpacity>
        )}
      </View>
      
      <View style={styles.historyContainer}>
        <Text style={[styles.historyTitle, { color: colors.accent }]}>Fasting History</Text>
        
        <ScrollView 
          style={styles.historyList} 
          contentContainerStyle={{ paddingRight: 2 }}
        >
          {fastHistory.length === 0 ? (
            <Text style={[styles.emptyHistoryText, secondaryTextColor]}>
              No fasting history yet
            </Text>
          ) : (
            fastHistory.map((fast) => (
              <View key={fast.id} style={[
                styles.historyItem, 
                { 
                  backgroundColor: colors.cardBg,
                  borderWidth: 2,
                  borderColor: colors.secondary,
                  borderLeftWidth: 4,
                  borderLeftColor: colors.accent,
                  marginRight: 3  // Small margin to create space between items and scrollbar
                }
              ]}>
                <View style={styles.historyDetails}>
                  <Text style={[styles.historyDate, textColor]}>
                    {formatDate(fast.startTime)}
                  </Text>
                  <Text style={[styles.historyDuration, { color: colors.primary }]}>
                    Duration: {formatTime(fast.duration)}
                  </Text>
                </View>
                <TouchableOpacity 
                  style={[styles.deleteButton, { backgroundColor: 'rgba(240, 128, 128, 0.2)' }]}
                  onPress={() => deleteFast(fast.id)}
                >
                  <Text style={[styles.deleteButtonText, { color: colors.danger }]}>×</Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </ScrollView>
        
        {fastHistory.length > 0 && (
          <TouchableOpacity 
            style={[
              styles.clearButton, 
              { 
                backgroundColor: isDarkMode ? 'rgba(240, 128, 128, 0.15)' : 'rgba(240, 128, 128, 0.1)',
                borderWidth: 2,
                borderColor: colors.danger,
                borderRadius: 8
              }
            ]} 
            onPress={clearHistory}
          >
            <Text style={[styles.clearButtonText, { color: colors.danger }]}>Clear History</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaViewContext>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  appTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  appSubtitle: {
    fontSize: 16,
    opacity: 0.8,
  },
  fastingControl: {
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  button: {
    // Base button styles without elevation
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    // elevation removed from here
  },
  startButton: {
    backgroundColor: '#4caf50',
  },
  endButton: {
    backgroundColor: '#f44336',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  counterContainer: {
    marginVertical: 15,
  },
  counterText: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  historyContainer: {
    flex: 1,
    padding: 20,
  },
  historyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  historyList: {
    flex: 1,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(200, 200, 200, 0.2)',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  historyDetails: {
    flex: 1,
  },
  historyDate: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  historyDuration: {
    fontSize: 14,
  },
  deleteButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  deleteButtonText: {
    fontSize: 18,
    color: '#f44336',
  },
  clearButton: {
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 8,
    marginTop: 15,
  },
  clearButtonText: {
    color: '#f44336',
    fontWeight: 'bold',
  },
  emptyHistoryText: {
    textAlign: 'center',
    padding: 20,
    fontSize: 16,
  },
});

export default HomeScreen;