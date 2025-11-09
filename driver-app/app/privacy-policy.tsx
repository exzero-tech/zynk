import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useRouter } from 'expo-router';

export default function PrivacyPolicyScreen() {
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const router = useRouter();

  return (
    <ThemedView style={[styles.container, { backgroundColor }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color={textColor} />
        </TouchableOpacity>
        <ThemedText type="title" style={styles.headerTitle}>
          Privacy Policy
        </ThemedText>
        <View style={styles.placeholder} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <ThemedText style={[styles.updateDate, { color: textColor }]}>
            Last Updated: November 9, 2025
          </ThemedText>

          <View style={styles.section}>
            <ThemedText style={[styles.sectionTitle, { color: textColor }]}>
              1. Information We Collect
            </ThemedText>
            <ThemedText style={[styles.sectionText, { color: textColor }]}>
              We collect information you provide directly to us, including your name, email address, phone number, payment information, and vehicle details. We also collect location data to help you find nearby charging stations and usage data to improve our services.
            </ThemedText>
          </View>

          <View style={styles.section}>
            <ThemedText style={[styles.sectionTitle, { color: textColor }]}>
              2. How We Use Your Information
            </ThemedText>
            <ThemedText style={[styles.sectionText, { color: textColor }]}>
              We use the information we collect to provide, maintain, and improve our services, process your transactions, send you technical notices and support messages, and communicate with you about products, services, and events.
            </ThemedText>
          </View>

          <View style={styles.section}>
            <ThemedText style={[styles.sectionTitle, { color: textColor }]}>
              3. Information Sharing
            </ThemedText>
            <ThemedText style={[styles.sectionText, { color: textColor }]}>
              We do not share your personal information with third parties except as described in this policy. We may share information with service providers who perform services on our behalf, in response to legal requests, or to protect our rights and safety.
            </ThemedText>
          </View>

          <View style={styles.section}>
            <ThemedText style={[styles.sectionTitle, { color: textColor }]}>
              4. Data Security
            </ThemedText>
            <ThemedText style={[styles.sectionText, { color: textColor }]}>
              We take reasonable measures to help protect your personal information from loss, theft, misuse, unauthorized access, disclosure, alteration, and destruction. We use industry-standard encryption and security protocols.
            </ThemedText>
          </View>

          <View style={styles.section}>
            <ThemedText style={[styles.sectionTitle, { color: textColor }]}>
              5. Your Rights
            </ThemedText>
            <ThemedText style={[styles.sectionText, { color: textColor }]}>
              You have the right to access, update, or delete your personal information at any time. You can also opt out of receiving promotional communications from us by following the instructions in those messages.
            </ThemedText>
          </View>

          <View style={styles.section}>
            <ThemedText style={[styles.sectionTitle, { color: textColor }]}>
              6. Location Data
            </ThemedText>
            <ThemedText style={[styles.sectionText, { color: textColor }]}>
              We collect precise location data when you use our app to help you find nearby charging stations. You can disable location services in your device settings, but this may limit some features of the app.
            </ThemedText>
          </View>

          <View style={styles.section}>
            <ThemedText style={[styles.sectionTitle, { color: textColor }]}>
              7. Payment Information
            </ThemedText>
            <ThemedText style={[styles.sectionText, { color: textColor }]}>
              Payment information is processed securely through our payment service providers. We do not store complete credit card numbers on our servers. All payment transactions are encrypted and comply with PCI DSS standards.
            </ThemedText>
          </View>

          <View style={styles.section}>
            <ThemedText style={[styles.sectionTitle, { color: textColor }]}>
              8. Changes to This Policy
            </ThemedText>
            <ThemedText style={[styles.sectionText, { color: textColor }]}>
              We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last Updated" date.
            </ThemedText>
          </View>

          <View style={styles.section}>
            <ThemedText style={[styles.sectionTitle, { color: textColor }]}>
              9. Contact Us
            </ThemedText>
            <ThemedText style={[styles.sectionText, { color: textColor }]}>
              If you have any questions about this Privacy Policy, please contact us at:{'\n\n'}
              Email: privacy@zynk.app{'\n'}
              Phone: 1-800-ZYNK-HELP{'\n'}
              Address: ZYNK Technologies Inc., 123 EV Street, San Francisco, CA 94105
            </ThemedText>
          </View>
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
  updateDate: {
    fontSize: 14,
    opacity: 0.6,
    marginBottom: 24,
    fontStyle: 'italic',
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  sectionText: {
    fontSize: 14,
    lineHeight: 22,
    opacity: 0.8,
  },
  spacer: {
    height: 40,
  },
});
