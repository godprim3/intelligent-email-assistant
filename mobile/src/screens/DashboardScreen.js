import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ApiService from '../services/ApiService';

export default function DashboardScreen() {
  const [stats, setStats] = useState({
    totalEmails: 0,
    processedToday: 0,
    needsAttention: 0,
    autoResponded: 0,
  });
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);

  const loadStats = async () => {
    setLoading(true);
    try {
      const response = await ApiService.getEmailStats();
      setStats(response.data);
      setLastUpdate(new Date().toLocaleTimeString());
    } catch (error) {
      Alert.alert('Error', 'Failed to load email statistics');
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const triggerEmailProcessing = async () => {
    try {
      await ApiService.triggerEmailProcessing();
      Alert.alert('Success', 'Email processing triggered successfully');
      loadStats(); // Refresh stats
    } catch (error) {
      Alert.alert('Error', 'Failed to trigger email processing');
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={loadStats} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Welcome to your</Text>
        <Text style={styles.titleText}>Email Assistant</Text>
        {lastUpdate && (
          <Text style={styles.updateText}>Last updated: {lastUpdate}</Text>
        )}
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, styles.primaryCard]}>
            <Ionicons name="mail" size={32} color="#2196F3" />
            <Text style={styles.statNumber}>{stats.totalEmails}</Text>
            <Text style={styles.statLabel}>Total Emails</Text>
          </View>

          <View style={[styles.statCard, styles.successCard]}>
            <Ionicons name="checkmark-circle" size={32} color="#4CAF50" />
            <Text style={styles.statNumber}>{stats.processedToday}</Text>
            <Text style={styles.statLabel}>Processed Today</Text>
          </View>

          <View style={[styles.statCard, styles.warningCard]}>
            <Ionicons name="alert-circle" size={32} color="#FF9800" />
            <Text style={styles.statNumber}>{stats.needsAttention}</Text>
            <Text style={styles.statLabel}>Needs Attention</Text>
          </View>

          <View style={[styles.statCard, styles.infoCard]}>
            <Ionicons name="send" size={32} color="#9C27B0" />
            <Text style={styles.statNumber}>{stats.autoResponded}</Text>
            <Text style={styles.statLabel}>Auto-Responded</Text>
          </View>
        </View>
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={triggerEmailProcessing}
        >
          <Ionicons name="refresh" size={24} color="white" />
          <Text style={styles.actionButtonText}>Process Emails</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.infoCard}>
          <Ionicons name="information-circle" size={24} color="#2196F3" />
          <Text style={styles.infoTitle}>How it works</Text>
          <Text style={styles.infoText}>
            Your intelligent email assistant automatically processes incoming emails,
            analyzes them with AI, and either responds automatically or notifies you
            via WhatsApp when your personal attention is needed.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: 'white',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  welcomeText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2196F3',
    textAlign: 'center',
    marginTop: 5,
  },
  updateText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginTop: 10,
  },
  statsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  primaryCard: {
    borderTopColor: '#2196F3',
    borderTopWidth: 4,
  },
  successCard: {
    borderTopColor: '#4CAF50',
    borderTopWidth: 4,
  },
  warningCard: {
    borderTopColor: '#FF9800',
    borderTopWidth: 4,
  },
  infoCard: {
    borderTopColor: '#9C27B0',
    borderTopWidth: 4,
  },
  actionsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  actionButton: {
    backgroundColor: '#2196F3',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  infoContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  infoCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 10,
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});
