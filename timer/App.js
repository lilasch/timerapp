import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Text, View, TouchableOpacity, TextInput, ScrollView, Modal, Platform } from 'react-native';
import { startTimer, pauseTimer, exitTimer, formatTime } from './timerNew.js';
import { initializeNotifications, sendNotification, sendNotificationNoisy } from './notifications';
import styles from './style.js';


export default function App() {
  const [timeRemaining, setTimeRemaining] = useState(1200); 
  const [isRunning, setIsRunning] = useState(false);  
  const [intervalId, setIntervalId] = useState(null); 
  const [hasPermission, setHasPermission] = useState(false);  
  const [notificationSent, setNotificationSent] = useState(false); 
  const [inputDuration, setInputDuration] = useState(''); // State for input
  const [timerDuration, setTimerDuration] = useState(1200); // State for timer duration
  const [isPaused, setIsPaused] = useState(false); // State for pause
  const [loudNotificationsEnabled, setLoudNotificationsEnabled] = useState(false); // New state for loud notifications
  const [modalVisible, setModalVisible] = useState(false);
  const [deviceType, setDeviceType] = useState('');

  useEffect(() => {
    initializeNotifications().then(granted => {
      setHasPermission(granted);
    });

    return () => clearInterval(intervalId); 
  }, [intervalId]);

  useEffect(() => {
    if (Platform.OS === 'ios') {
      setDeviceType('iOS');
    } else if (Platform.OS === 'android') {
      setDeviceType('Android');
    } else {
      setDeviceType('Web');
    }
  }, []);

  useEffect(() => {
    if (timeRemaining === 0 && !notificationSent) {
      if (loudNotificationsEnabled) {
        if (typeof window !== "undefined") {
          sendNotificationNoisy(`${timerDuration / 60} minutes completed`);
          
          setTimeout(() => {
            sendNotificationNoisy("20s after");
          }, 20000);
        }
      } else {
        if (typeof window !== "undefined") {
          sendNotification(`${timerDuration / 60} minutes completed`);

          setTimeout(() => {
            sendNotification("20s after");
          }, 20000);
        }
      }

      setNotificationSent(true);

      clearInterval(intervalId);
      setIsRunning(false);

      setTimeout(() => {
        setTimeRemaining(timerDuration); 
        setNotificationSent(false); 
      }, 1000); 
    }
  }, [timeRemaining, notificationSent, intervalId, timerDuration]);

  const handleStartPause = () => {
    if (isRunning) {
      // Pause functionality
      pauseTimer(setIsRunning, intervalId);
      setIsPaused(true);
    } else {
      // Start functionality
      setNotificationSent(false);
      if (!isPaused) {
        startTimer(setHasPermission, setIsRunning, setIntervalId, setTimeRemaining, isRunning, timerDuration);
      } else {
        startTimer(setHasPermission, setIsRunning, setIntervalId, setTimeRemaining, isRunning, timeRemaining);
      }
      setIsPaused(false);
    }
  };

  const handlePause = () => {
    pauseTimer(setIsRunning, intervalId); 
    setIsPaused(true); 
  };

  const handleSetDuration = () => {
    const newDuration = parseInt(inputDuration, 10);
    if (!isNaN(newDuration) && newDuration > 0) {
      setTimerDuration(newDuration); // Update State
      setTimeRemaining(newDuration); // Reset time remaining
      setInputDuration(''); // Clear input after setting duration
    }
  };

  const toggleLoudNotifications = () => {
    setLoudNotificationsEnabled(prev => !prev);
  };

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.deviceTypeText}>Device Type: {deviceType}</Text>
      <Text style={styles.titleText}>20/20/20 Vision Timer</Text>
      
      {/* Timer Display */}
      <View style={styles.timerContainer}>
        <Text style={styles.timerLabel}>Time Remaining:</Text>
        <Text style={styles.timeDisplay}>{formatTime(timeRemaining)}</Text>
      </View>
      
      {/* Notification Permission Warning */}
      {!hasPermission && (
        <Text style={styles.permissionText}>Please enable notifications to receive break reminders</Text>
      )}
      
      {/* Main Control Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleStartPause} style={styles.button}>
          <Text style={styles.buttonText}>{isRunning ? 'Pause' : 'Start'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => exitTimer(setIsRunning, setTimeRemaining, setIntervalId, intervalId)} style={[styles.button, styles.exitButton]}>
          <Text style={styles.buttonText}>Reset</Text>
        </TouchableOpacity>
      </View>

      {/* Timer Duration Setter */}
      <View style={styles.setterContainer}>
        <Text style={styles.setterLabel}>Set Timer Duration:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Seconds"
          keyboardType="numeric"
          value={inputDuration}
          onChangeText={setInputDuration}
        />
        <TouchableOpacity onPress={handleSetDuration} style={styles.setButton}>
          <Text style={styles.buttonText}>Set</Text>
        </TouchableOpacity>
      </View>

      {/* Notification Settings */}
      <View style={styles.notificationContainer}>
        <Text style={styles.notificationLabel}>Notification Settings:</Text>
        <TouchableOpacity onPress={toggleLoudNotifications} style={[styles.button, loudNotificationsEnabled ? styles.loudButton : styles.quietButton]}>
          <Text style={styles.buttonText}>
            {loudNotificationsEnabled ? 'Loud Notifications On' : 'Quiet Notifications On'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* About Section */}
      <TouchableOpacity onPress={toggleModal} style={styles.aboutButton}>
        <Text style={styles.buttonText}>About 20/20/20 Rule</Text>
      </TouchableOpacity>

      {/* Modal for 20/20/20 Rule Information */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={toggleModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>The 20/20/20 Rule</Text>
            <Text style={styles.modalText}>
              The 20/20/20 rule is a simple guideline to reduce eye strain caused by looking at digital screens for extended periods:
            </Text>
            <Text style={styles.modalText}>
              • Every 20 minutes
            </Text>
            <Text style={styles.modalText}>
              • Look at something 20 feet away
            </Text>
            <Text style={styles.modalText}>
              • For at least 20 seconds
            </Text>
            <Text style={styles.modalText}>
              This practice helps relax the eye muscles and reduces the risk of computer vision syndrome and digital eye strain.
            </Text>
            <TouchableOpacity onPress={toggleModal} style={styles.closeButton}>
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <StatusBar style="auto" />
    </ScrollView>
  );
}
