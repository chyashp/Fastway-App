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
} from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';

const HomeScreen = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [isFasting, setIsFasting] = useState(false);
  const [fastStartTime, setFastStartTime] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [fastHistory, setFastHistory] = useState([]);
  
  // ... existing code ...
  const textColor = {
    color: isDarkMode ? Colors.white : Colors.black,
  };
  
  const secondaryTextColor = {
    color: isDarkMode ? Colors.light : Colors.dark,
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

  return (
    <SafeAreaView style={[
      styles.container,
      { backgroundColor: isDarkMode ? Colors.darker : Colors.lighter }
    ]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={isDarkMode ? Colors.darker : Colors.lighter}
      />
      
      <View style={styles.header}>
        <Text style={[styles.appTitle, textColor]}>FastwayApp</Text>
        <Text style={[styles.appSubtitle, secondaryTextColor]}>Track your fasting journey</Text>
      </View>
      
      <View style={styles.fastingControl}>
        {isFasting ? (
          <>
            <View style={styles.counterContainer}>
              <Text style={[styles.counterText, textColor]}>
                {formatTime(currentTime)}
              </Text>
            </View>
            <TouchableOpacity 
              style={[styles.button, styles.endButton]} 
              onPress={endFast}
            >
              <Text style={styles.buttonText}>End Fast</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity 
            style={[styles.button, styles.startButton]} 
            onPress={startFast}
          >
            <Text style={styles.buttonText}>Start Fast</Text>
          </TouchableOpacity>
        )}
      </View>
      
      <View style={styles.historyContainer}>
        <Text style={[styles.historyTitle, textColor]}>Fasting History</Text>
        
        <ScrollView style={styles.historyList}>
          {fastHistory.length === 0 ? (
            <Text style={[styles.emptyHistoryText, secondaryTextColor]}>
              No fasting history yet
            </Text>
          ) : (
            fastHistory.map((fast) => (
              <View key={fast.id} style={styles.historyItem}>
                <View style={styles.historyDetails}>
                  <Text style={[styles.historyDate, textColor]}>
                    {formatDate(fast.startTime)}
                  </Text>
                  <Text style={[styles.historyDuration, secondaryTextColor]}>
                    Duration: {formatTime(fast.duration)}
                  </Text>
                </View>
                <TouchableOpacity 
                  style={styles.deleteButton}
                  onPress={() => deleteFast(fast.id)}
                >
                  <Text style={styles.deleteButtonText}>×</Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </ScrollView>
        
        {fastHistory.length > 0 && (
          <TouchableOpacity 
            style={styles.clearButton} 
            onPress={clearHistory}
          >
            <Text style={styles.clearButtonText}>Clear History</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
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
  // ... existing code ...
  fastingControl: {
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    elevation: 2,
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