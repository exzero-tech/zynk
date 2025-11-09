import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useRouter } from 'expo-router';

export default function HelpSupportScreen() {
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const router = useRouter();

  const faqItems = [
    {
      question: 'How do I start a charging session?',
      answer: 'Navigate to a charger on the map, tap on it to view details, and press the "Start Charging" button. Follow the on-screen instructions to connect your vehicle.',
    },
    {
      question: 'What payment methods are accepted?',
      answer: 'We accept all major credit cards, debit cards, and digital wallets. You can add your payment method in the Profile section under Payment Methods.',
    },
    {
      question: 'How do I find nearby chargers?',
      answer: 'Use the Explore tab to view all available chargers on the map. You can filter by charger speed, socket type, and amenities using the filter button.',
    },
    {
      question: 'What if a charger is not working?',
      answer: 'Please report the issue through the app by tapping on the charger and selecting "Report Issue". Our team will investigate and resolve it promptly.',
    },
    {
      question: 'Can I reserve a charging station?',
      answer: 'Yes, select a charger and tap "Reserve" to hold it for up to 15 minutes. This feature may not be available at all locations.',
    },
  ];

  return (
    <ThemedView style={[styles.container, { backgroundColor }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color={textColor} />
        </TouchableOpacity>
        <ThemedText type="title" style={styles.headerTitle}>
          Help & Support
        </ThemedText>
        <View style={styles.placeholder} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Contact Section */}
        <View style={styles.section}>
          <ThemedText style={[styles.sectionTitle, { color: textColor }]}>
            Contact Us
          </ThemedText>
          
          <View style={[styles.contactCard, { backgroundColor: '#242424' }]}>
            <View style={styles.contactItem}>
              <MaterialIcons name="email" size={24} color={textColor} />
              <View style={styles.contactInfo}>
                <ThemedText style={[styles.contactLabel, { color: textColor }]}>
                  Email
                </ThemedText>
                <ThemedText style={[styles.contactValue, { color: textColor }]}>
                  support@zynk.app
                </ThemedText>
              </View>
            </View>

            <View style={[styles.contactItem, styles.contactItemBorder]}>
              <MaterialIcons name="phone" size={24} color={textColor} />
              <View style={styles.contactInfo}>
                <ThemedText style={[styles.contactLabel, { color: textColor }]}>
                  Phone
                </ThemedText>
                <ThemedText style={[styles.contactValue, { color: textColor }]}>
                  (+94) 112685213
                </ThemedText>
              </View>
            </View>

            <View style={[styles.contactItem, styles.contactItemBorder]}>
              <MaterialIcons name="schedule" size={24} color={textColor} />
              <View style={styles.contactInfo}>
                <ThemedText style={[styles.contactLabel, { color: textColor }]}>
                  Hours
                </ThemedText>
                <ThemedText style={[styles.contactValue, { color: textColor }]}>
                  24/7 Support
                </ThemedText>
              </View>
            </View>
          </View>
        </View>

        {/* FAQ Section */}
        <View style={styles.section}>
          <ThemedText style={[styles.sectionTitle, { color: textColor }]}>
            Frequently Asked Questions
          </ThemedText>

          {faqItems.map((faq, index) => (
            <View key={index} style={[styles.faqCard, { backgroundColor: '#242424' }]}>
              <ThemedText style={[styles.faqQuestion, { color: textColor }]}>
                {faq.question}
              </ThemedText>
              <ThemedText style={[styles.faqAnswer, { color: textColor }]}>
                {faq.answer}
              </ThemedText>
            </View>
          ))}
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
  section: {
    marginTop: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
    marginHorizontal: 20,
  },
  contactCard: {
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 16,
  },
  contactItemBorder: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  contactInfo: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 14,
    opacity: 0.6,
    marginBottom: 4,
  },
  contactValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  faqCard: {
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  faqAnswer: {
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.8,
  },
  spacer: {
    height: 40,
  },
});
