import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Text, View, TouchableOpacity, TextInput, ScrollView, Modal, Platform } from 'react-native';
import { startTimer, pauseTimer, exitTimer, formatTime } from './timerNew.js';
import { Ionicons } from '@expo/vector-icons';
import { colorThemes, getThemeStyles, getThemeColors } from './style.js';
import { getTranslation, getAvailableLanguages } from './language';

export default function App() {
  const [timeRemaining, setTimeRemaining] = useState(1200);  // State for time remaining
  const [isRunning, setIsRunning] = useState(false);  // State for timer running
  const [intervalId, setIntervalId] = useState(null); // State for interval ID
  const [hasPermission, setHasPermission] = useState(false);  // State for permission
  const [notificationSent, setNotificationSent] = useState(false); // State for notification sent
  const [inputDuration, setInputDuration] = useState(''); // State for input
  const [timerDuration, setTimerDuration] = useState(1200); // State for timer duration
  const [isPaused, setIsPaused] = useState(false); // State for pause
  const [loudNotificationsEnabled, setLoudNotificationsEnabled] = useState(false); // New state for loud notifications
  const [modalVisible, setModalVisible] = useState(false); // State for modal visibility
  const [deviceType, setDeviceType] = useState(''); // State for device type
  const [currentLanguage, setCurrentLanguage] = useState('en'); // Default language
  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  const [notificationModule, setNotificationModule] = useState({
    initialize: () => {},
    sendNotification: () => {},
    sendNoisyNotification: () => {},
    sendAfterNotification: () => {}
  });
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);
  const [themeIndex, setThemeIndex] = useState(2); // Starting with dark mode (index 4)

  // Initialize notifications based on platform
  useEffect(() => {
    let initializeNotifications, sendNotification, sendNoisyNotification, sendAfterNotification;

    if (Platform.OS === 'ios') {
      setDeviceType('iOS');
      ({ initializeIOSNotifications: initializeNotifications, sendIOSNotification: sendNotification, sendIOSNotificationNoisy: sendNoisyNotification, sendIOSNotification: sendAfterNotification } = require('./iosNotifications'));
    } else if (Platform.OS === 'android') {
      setDeviceType('Android');
      ({ initializeAndroidNotifications: initializeNotifications, sendAndroidNotification: sendNotification, sendAndroidNotificationNoisy: sendNoisyNotification, sendAndroidNotification: sendAfterNotification } = require('./androidNotifications'));
    } else {
      setDeviceType('Web');
      ({ initializeWebNotifications: initializeNotifications, sendWebNotification: sendNotification, sendWebNotificationNoisy: sendNoisyNotification, sendWebAfterNotification: sendAfterNotification } = require('./webNotifications'));
    }

    setNotificationModule({
      initialize: (lang) => initializeNotifications(lang), // Pass language to initialization
      sendNotification: (msg) => sendNotification(msg, currentLanguage), // Pass current language
      sendNoisyNotification: (msg) => sendNoisyNotification(msg, currentLanguage), // Pass current language
      sendAfterNotification: (msg) => sendAfterNotification(msg, currentLanguage), // Pass current language
    });    

    initializeNotifications(currentLanguage).then(granted => {
      setHasPermission(granted);
    });

    return () => clearInterval(intervalId); 
  }, [intervalId]);

  useEffect(() => {
    if (timeRemaining === 0 && !notificationSent) {
      const message = `${Math.floor(timerDuration / 60)} ${getTranslation(currentLanguage, 'minutes')} ${timerDuration % 60} ${getTranslation(currentLanguage, 'seconds')} ${getTranslation(currentLanguage, 'completed')}`;
      
      if (loudNotificationsEnabled) {
        notificationModule.sendNoisyNotification(message, currentLanguage);
        setTimeout(() => {
          notificationModule.sendNoisyNotification(getTranslation(currentLanguage, 'goodToGo'), currentLanguage);
        }, 20000);
      } else {
        notificationModule.sendNotification(message, currentLanguage);
        setTimeout(() => {
          notificationModule.sendAfterNotification(getTranslation(currentLanguage, 'goodToGo'), currentLanguage);
        }, 20000);
      }      

      setNotificationSent(true);
      setTimeRemaining(timerDuration); // Reset timeRemaining to timer duration for screen display

      // Reset notificationSent to allow notifications in the next cycle
      setTimeout(() => {
        setNotificationSent(false);
      }, 1000); // Small delay to reset notificationSent
    }
  }, [timeRemaining, notificationSent, timerDuration, loudNotificationsEnabled, notificationModule]);

  useEffect(() => {
    if (notificationModule.initialize) {
      notificationModule.initialize(currentLanguage); // Reinitialize notifications with the new language
    }
  }, [currentLanguage, notificationModule]);  

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

  const handleThemeChange = (index) => {
    setThemeIndex(index);
    setSettingsModalVisible(false);
  };

  // Get current styles and colors based on theme
  const styles = getThemeStyles(themeIndex);
  const colors = getThemeColors(themeIndex);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Settings Button */}
      <TouchableOpacity 
        style={styles.settingsButton}
        onPress={() => setSettingsModalVisible(true)}
      >
        <Text style={styles.buttonText}>{getTranslation(currentLanguage, 'settings')}</Text>
      </TouchableOpacity>

      {/* Language Selection */}
      <View style={styles.languageContainer}>
        {getAvailableLanguages().map((lang) => (
          <TouchableOpacity
            key={lang}
            onPress={() => setCurrentLanguage(lang)}
            style={styles.languageButton}
          >
            <Text style={styles.buttonText}>{lang.toUpperCase()}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Title */}
      <Text style={styles.titleText}>{getTranslation(currentLanguage, 'timerTitle')}</Text>
      
      {/* Timer Display */}
      <View style={styles.timerContainer}>
        <Text style={styles.timerLabel}>{getTranslation(currentLanguage, 'timeRemaining')}:</Text>
        <Text style={styles.timeDisplay}>{formatTime(timeRemaining)}</Text>
      </View>
      
      {/* Notification Permission Warning */}
      {!hasPermission && (
        <Text style={styles.permissionText}>{getTranslation(currentLanguage, 'permissionWarning')}</Text>
      )}
      
      {/* Main Control Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleStartPause} style={styles.button}>
          <Text style={styles.buttonText}>
            {isRunning ? getTranslation(currentLanguage, 'pause') : getTranslation(currentLanguage, 'start')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => exitTimer(setIsRunning, setTimeRemaining, setIntervalId, intervalId)} style={[styles.button, styles.exitButton]}>
          <Text style={styles.buttonText}>{getTranslation(currentLanguage, 'reset')}</Text>
        </TouchableOpacity>
      </View>

      {/* Timer Duration Setter */}
      <View style={styles.setterContainer}>
        <Text style={styles.setterLabel}>{getTranslation(currentLanguage, 'setDuration')}</Text>
        <TextInput
          style={styles.input}
          placeholder={getTranslation(currentLanguage, 'enterSeconds')}
          keyboardType="numeric"
          value={inputDuration}
          onChangeText={setInputDuration}
        />
        <TouchableOpacity onPress={handleSetDuration} style={styles.setButton}>
          <Text style={styles.buttonText}>{getTranslation(currentLanguage, 'set')}</Text>
        </TouchableOpacity>
      </View>

      {/* Notification Settings */}
      {deviceType === 'Web' && (
        <View style={styles.notificationContainer}>
          <Text style={styles.notificationLabel}>{getTranslation(currentLanguage, 'notificationSettings')}:</Text>
          <TouchableOpacity onPress={toggleLoudNotifications} style={[styles.button, loudNotificationsEnabled ? styles.loudButton : styles.quietButton]}>
            <Text style={styles.buttonText}>
              {loudNotificationsEnabled
                ? getTranslation(currentLanguage, 'loudOn')
                : getTranslation(currentLanguage, 'quietOn')}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* About Section */}
      <TouchableOpacity onPress={toggleModal} style={styles.aboutButton}>
        <Text style={styles.buttonText}>{getTranslation(currentLanguage, 'about')}</Text>
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
            <Text style={styles.modalTitle}>{getTranslation(currentLanguage, 'ruleTitle')}</Text>
            <Text style={styles.modalText}>{getTranslation(currentLanguage, 'ruleDescription')}</Text>
            <Text style={styles.modalText}>{getTranslation(currentLanguage, 'ruleStep1')}</Text>
            <Text style={styles.modalText}>{getTranslation(currentLanguage, 'ruleStep2')}</Text>
            <Text style={styles.modalText}>{getTranslation(currentLanguage, 'ruleStep3')}</Text>
            <Text style={styles.modalText}>{getTranslation(currentLanguage, 'ruleFooter')}</Text>
            <TouchableOpacity onPress={toggleModal} style={styles.closeButton}>
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Settings Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={settingsModalVisible}
        onRequestClose={() => setSettingsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{getTranslation(currentLanguage, 'settings')}</Text>
            <View style={styles.themeListContainer}>
              <Text style={styles.modalText}>{getTranslation(currentLanguage, 'chooseTheme')}</Text>
              {colorThemes.map((theme, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.themeOptionContainer,
                    themeIndex === index && styles.selectedTheme
                  ]}
                  onPress={() => handleThemeChange(index)}
                >
                  <View 
                    style={[
                      styles.themeColorPreview,
                      { backgroundColor: theme.background }
                    ]}
                  />
                  <Text style={styles.themeOptionText}>
                    {getTranslation(currentLanguage, `theme_${theme.name.toLowerCase().replace(/\s+/g, '_')}`)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity 
              onPress={() => setSettingsModalVisible(false)} 
              style={styles.closeButton}
            >
              <Text style={styles.buttonText}>{getTranslation(currentLanguage, 'close')}</Text>
            </TouchableOpacity>

            {/* Language Selection Button */}
            <TouchableOpacity 
              onPress={() => setLanguageModalVisible(true)} 
              style={styles.settingsButton}>
              <Text style={styles.buttonText}>{getTranslation(currentLanguage, 'changeLanguage')}</Text>
            </TouchableOpacity>

          </View>
        </View>
      </Modal>

      {/* Language Selection Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={languageModalVisible}
        onRequestClose={() => setLanguageModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{getTranslation(currentLanguage, 'chooseLanguage')}</Text>
            <View style={styles.languageListContainer}>
              {getAvailableLanguages().map((lang) => (
                <TouchableOpacity
                  key={lang}
                  onPress={() => {
                    setCurrentLanguage(lang);
                    setLanguageModalVisible(false);
                  }}
                  style={styles.languageButton}
                >
                  <Text style={styles.buttonText}>{lang.toUpperCase()}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity 
              onPress={() => setLanguageModalVisible(false)} 
              style={styles.closeButton}
            >
              <Text style={styles.buttonText}>{getTranslation(currentLanguage, 'close')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <StatusBar style="auto" />
    </ScrollView>
  );
}
