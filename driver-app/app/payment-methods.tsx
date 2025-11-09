import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useRouter } from 'expo-router';

export default function PaymentMethodsScreen() {
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');
  const router = useRouter();

  // TODO: Replace with real payment methods from backend
  const paymentMethods = [
    {
      id: 1,
      type: 'card',
      brand: 'Visa',
      last4: '4242',
      expiryMonth: 12,
      expiryYear: 2025,
      isPrimary: true,
    },
    {
      id: 2,
      type: 'card',
      brand: 'Mastercard',
      last4: '8888',
      expiryMonth: 8,
      expiryYear: 2026,
      isPrimary: false,
    },
  ];

  const getCardIcon = (brand: string) => {
    switch (brand.toLowerCase()) {
      case 'visa':
        return 'credit-card';
      case 'mastercard':
        return 'credit-card';
      case 'amex':
        return 'credit-card';
      default:
        return 'credit-card';
    }
  };

  return (
    <ThemedView style={[styles.container, { backgroundColor }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color={textColor} />
        </TouchableOpacity>
        <ThemedText type="title" style={styles.headerTitle}>
          Payment Methods
        </ThemedText>
        <View style={styles.placeholder} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Payment Methods List */}
          {paymentMethods.map((method) => (
            <View key={method.id} style={[styles.paymentCard, { backgroundColor: '#242424' }]}>
              {method.isPrimary && (
                <View style={[styles.primaryBadge, { backgroundColor: tintColor }]}>
                  <ThemedText style={styles.primaryBadgeText}>Default</ThemedText>
                </View>
              )}

              <View style={styles.cardHeader}>
                <View style={[styles.cardIcon, { backgroundColor: tintColor + '15' }]}>
                  <MaterialIcons name={getCardIcon(method.brand) as any} size={28} color={tintColor} />
                </View>
                <View style={styles.cardInfo}>
                  <ThemedText style={[styles.cardBrand, { color: textColor }]}>
                    {method.brand}
                  </ThemedText>
                  <ThemedText style={[styles.cardNumber, { color: textColor }]}>
                    •••• •••• •••• {method.last4}
                  </ThemedText>
                  <ThemedText style={[styles.cardExpiry, { color: textColor }]}>
                    Expires {method.expiryMonth}/{method.expiryYear}
                  </ThemedText>
                </View>
              </View>

              <View style={styles.cardActions}>
                {!method.isPrimary && (
                  <TouchableOpacity style={styles.actionButton}>
                    <MaterialIcons name="star-outline" size={18} color={textColor} />
                    <ThemedText style={[styles.actionButtonText, { color: textColor }]}>
                      Set as Default
                    </ThemedText>
                  </TouchableOpacity>
                )}
                <TouchableOpacity style={styles.actionButton}>
                  <MaterialIcons name="delete-outline" size={18} color="#F44336" />
                  <ThemedText style={[styles.actionButtonText, { color: '#F44336' }]}>
                    Remove
                  </ThemedText>
                </TouchableOpacity>
              </View>
            </View>
          ))}

          {/* Add Payment Method Button */}
          <TouchableOpacity style={[styles.addButton, { backgroundColor: '#242424', borderColor: tintColor }]}>
            <MaterialIcons name="add-circle-outline" size={24} color={tintColor} />
            <ThemedText style={[styles.addButtonText, { color: tintColor }]}>
              Add Payment Method
            </ThemedText>
          </TouchableOpacity>

          {/* Supported Cards */}
          <View style={styles.supportedSection}>
            <ThemedText style={[styles.supportedTitle, { color: textColor }]}>
              Accepted Cards
            </ThemedText>
            <View style={styles.cardBrands}>
              <View style={[styles.brandBadge, { backgroundColor: '#242424' }]}>
                <ThemedText style={[styles.brandText, { color: textColor }]}>Visa</ThemedText>
              </View>
              <View style={[styles.brandBadge, { backgroundColor: '#242424' }]}>
                <ThemedText style={[styles.brandText, { color: textColor }]}>Mastercard</ThemedText>
              </View>
              <View style={[styles.brandBadge, { backgroundColor: '#242424' }]}>
                <ThemedText style={[styles.brandText, { color: textColor }]}>Amex</ThemedText>
              </View>
            </View>
          </View>

          {/* Security Info */}
          <View style={[styles.infoCard, { backgroundColor: 'rgba(76, 175, 80, 0.1)' }]}>
            <MaterialIcons name="lock" size={20} color={tintColor} />
            <ThemedText style={[styles.infoText, { color: textColor }]}>
              Your payment information is encrypted and securely stored. We never share your financial details with third parties.
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
  paymentCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  primaryBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  primaryBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  cardInfo: {
    flex: 1,
  },
  cardBrand: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  cardNumber: {
    fontSize: 16,
    marginBottom: 4,
    letterSpacing: 1,
  },
  cardExpiry: {
    fontSize: 14,
    opacity: 0.7,
  },
  cardActions: {
    flexDirection: 'row',
    gap: 12,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: 20,
    borderRadius: 20,
    borderWidth: 2,
    borderStyle: 'dashed',
    marginBottom: 24,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  supportedSection: {
    marginBottom: 24,
  },
  supportedTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  cardBrands: {
    flexDirection: 'row',
    gap: 12,
  },
  brandBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  brandText: {
    fontSize: 14,
    fontWeight: '500',
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 16,
    borderRadius: 12,
  },
  infoText: {
    fontSize: 13,
    lineHeight: 20,
    flex: 1,
    opacity: 0.8,
  },
  spacer: {
    height: 40,
  },
});
