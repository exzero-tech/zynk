import { StyleSheet, View, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useRouter } from 'expo-router';

export default function PersonalInfoScreen() {
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');
  const router = useRouter();

  // TODO: Replace with real user data from auth/context
  const [firstName, setFirstName] = useState('Shehan');
  const [lastName, setLastName] = useState('Jayasinghe');
  const [email, setEmail] = useState('shehanjay@email.com');
  const [phone, setPhone] = useState('+94 76-568-4521');
  const [address, setAddress] = useState('123 Main Street');
  const [city, setCity] = useState('Colombo');
  const [zipCode, setZipCode] = useState('00100');

  return (
    <ThemedView style={[styles.container, { backgroundColor }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color={textColor} />
        </TouchableOpacity>
        <ThemedText type="title" style={styles.headerTitle}>
          Personal Information
        </ThemedText>
        <View style={styles.placeholder} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Profile Picture */}
          <View style={styles.avatarSection}>
            <View style={[styles.avatar, { backgroundColor: tintColor + '15' }]}>
              <ThemedText style={[styles.avatarText, { color: tintColor }]}>
                {firstName[0]}{lastName[0]}
              </ThemedText>
            </View>
            <TouchableOpacity style={[styles.changePhotoButton, { backgroundColor: '#242424' }]}>
              <MaterialIcons name="camera-alt" size={16} color={textColor} />
              <ThemedText style={[styles.changePhotoText, { color: textColor }]}>
                Change Photo
              </ThemedText>
            </TouchableOpacity>
          </View>

          {/* Basic Information */}
          <View style={styles.section}>
            <ThemedText style={[styles.sectionTitle, { color: textColor }]}>
              Basic Information
            </ThemedText>

            <View style={[styles.card, { backgroundColor: '#242424' }]}>
              <View style={styles.inputGroup}>
                <ThemedText style={[styles.label, { color: textColor }]}>
                  First Name
                </ThemedText>
                <TextInput
                  style={[styles.input, { color: textColor, borderColor: 'rgba(255, 255, 255, 0.1)' }]}
                  value={firstName}
                  onChangeText={setFirstName}
                  placeholder="Enter first name"
                  placeholderTextColor="rgba(255, 255, 255, 0.3)"
                />
              </View>

              <View style={styles.inputGroup}>
                <ThemedText style={[styles.label, { color: textColor }]}>
                  Last Name
                </ThemedText>
                <TextInput
                  style={[styles.input, { color: textColor, borderColor: 'rgba(255, 255, 255, 0.1)' }]}
                  value={lastName}
                  onChangeText={setLastName}
                  placeholder="Enter last name"
                  placeholderTextColor="rgba(255, 255, 255, 0.3)"
                />
              </View>
            </View>
          </View>

          {/* Contact Information */}
          <View style={styles.section}>
            <ThemedText style={[styles.sectionTitle, { color: textColor }]}>
              Contact Information
            </ThemedText>

            <View style={[styles.card, { backgroundColor: '#242424' }]}>
              <View style={styles.inputGroup}>
                <ThemedText style={[styles.label, { color: textColor }]}>
                  Email
                </ThemedText>
                <TextInput
                  style={[styles.input, { color: textColor, borderColor: 'rgba(255, 255, 255, 0.1)' }]}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Enter email"
                  placeholderTextColor="rgba(255, 255, 255, 0.3)"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputGroup}>
                <ThemedText style={[styles.label, { color: textColor }]}>
                  Phone
                </ThemedText>
                <TextInput
                  style={[styles.input, { color: textColor, borderColor: 'rgba(255, 255, 255, 0.1)' }]}
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="Enter phone number"
                  placeholderTextColor="rgba(255, 255, 255, 0.3)"
                  keyboardType="phone-pad"
                />
              </View>
            </View>
          </View>

          {/* Address */}
          <View style={styles.section}>
            <ThemedText style={[styles.sectionTitle, { color: textColor }]}>
              Address
            </ThemedText>

            <View style={[styles.card, { backgroundColor: '#242424' }]}>
              <View style={styles.inputGroup}>
                <ThemedText style={[styles.label, { color: textColor }]}>
                  Street Address
                </ThemedText>
                <TextInput
                  style={[styles.input, { color: textColor, borderColor: 'rgba(255, 255, 255, 0.1)' }]}
                  value={address}
                  onChangeText={setAddress}
                  placeholder="Enter street address"
                  placeholderTextColor="rgba(255, 255, 255, 0.3)"
                />
              </View>

              <View style={styles.inputGroup}>
                <ThemedText style={[styles.label, { color: textColor }]}>
                  City
                </ThemedText>
                <TextInput
                  style={[styles.input, { color: textColor, borderColor: 'rgba(255, 255, 255, 0.1)' }]}
                  value={city}
                  onChangeText={setCity}
                  placeholder="Enter city"
                  placeholderTextColor="rgba(255, 255, 255, 0.3)"
                />
              </View>

              <View style={styles.inputGroup}>
                <ThemedText style={[styles.label, { color: textColor }]}>
                  Zip Code
                </ThemedText>
                <TextInput
                  style={[styles.input, { color: textColor, borderColor: 'rgba(255, 255, 255, 0.1)' }]}
                  value={zipCode}
                  onChangeText={setZipCode}
                  placeholder="Enter zip code"
                  placeholderTextColor="rgba(255, 255, 255, 0.3)"
                  keyboardType="numeric"
                />
              </View>
            </View>
          </View>

          {/* Save Button */}
          <TouchableOpacity style={[styles.saveButton, { backgroundColor: tintColor }]}>
            <ThemedText style={styles.saveButtonText}>
              Save Changes
            </ThemedText>
          </TouchableOpacity>
        </View>

        <View style={styles.spacer} />
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 40,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  avatarText: {
    fontSize: 36,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  changePhotoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  changePhotoText: {
    fontSize: 14,
    fontWeight: '500',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  card: {
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    opacity: 0.7,
  },
  input: {
    fontSize: 16,
    padding: 12,
    borderWidth: 1,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  saveButton: {
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 8,
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  spacer: {
    height: 40,
  },
});
