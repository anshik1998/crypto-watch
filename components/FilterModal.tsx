import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  TextInput,
  Platform,
  Keyboard,
  ScrollView
} from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import * as Haptics from 'expo-haptics';
import { X, Check } from 'lucide-react-native';
import { CURRENCY_SYMBOLS } from '@/utils/currencyUtils';

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  filters: {
    minPrice: string;
    maxPrice: string;
    minMarketCap: string;
    sortBy: 'market_cap' | 'price' | 'name' | 'price_change_24h';
    sortDirection: 'asc' | 'desc';
  };
  onApply: (filters: FilterModalProps['filters']) => void;
}

const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  onClose,
  filters,
  onApply
}) => {
  const { colors, currency } = useTheme();
  const [localFilters, setLocalFilters] = useState(filters);

  const handleSortByChange = (sortBy: FilterModalProps['filters']['sortBy']) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setLocalFilters({ ...localFilters, sortBy });
  };

  const handleSortDirectionChange = (sortDirection: 'asc' | 'desc') => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setLocalFilters({ ...localFilters, sortDirection });
  };

  const handleApply = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    onApply(localFilters);
  };

  const handleReset = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    setLocalFilters({
      minPrice: '',
      maxPrice: '',
      minMarketCap: '',
      sortBy: 'market_cap',
      sortDirection: 'desc',
    });
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={() => {
        Keyboard.dismiss();
        onClose();
      }}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={[styles.container, { backgroundColor: colors.card }]}>
              <View style={styles.header}>
                <Text style={[styles.title, { color: colors.text }]}>
                  Filter & Sort
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    Keyboard.dismiss();
                    onClose();
                  }}
                  style={styles.closeButton}
                >
                  <X color={colors.text} size={24} />
                </TouchableOpacity>
              </View>

              <ScrollView
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
              >
                <View style={styles.section}>
                  <Text style={[styles.sectionTitle, { color: colors.text }]}>
                    Price Range
                  </Text>
                  <View style={styles.row}>
                    <View style={styles.inputContainer}>
                      <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
                        Min ({CURRENCY_SYMBOLS[currency]})
                      </Text>
                      <TextInput
                        style={[
                          styles.input,
                          {
                            backgroundColor: colors.inputBackground,
                            color: colors.text,
                          }
                        ]}
                        value={localFilters.minPrice}
                        onChangeText={(text) => setLocalFilters({ ...localFilters, minPrice: text })}
                        keyboardType="numeric"
                        placeholder="Min"
                        placeholderTextColor={colors.textSecondary}
                        returnKeyType="done"
                        onSubmitEditing={Keyboard.dismiss}
                      />
                    </View>
                    <View style={styles.inputContainer}>
                      <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
                        Max ({CURRENCY_SYMBOLS[currency]})
                      </Text>
                      <TextInput
                        style={[
                          styles.input,
                          {
                            backgroundColor: colors.inputBackground,
                            color: colors.text,
                          }
                        ]}
                        value={localFilters.maxPrice}
                        onChangeText={(text) => setLocalFilters({ ...localFilters, maxPrice: text })}
                        keyboardType="numeric"
                        placeholder="Max"
                        placeholderTextColor={colors.textSecondary}
                        returnKeyType="done"
                        onSubmitEditing={Keyboard.dismiss}
                      />
                    </View>
                  </View>
                </View>

                <View style={styles.section}>
                  <Text style={[styles.sectionTitle, { color: colors.text }]}>
                    Market Cap
                  </Text>
                  <View style={styles.inputContainer}>
                    <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
                      Min (in millions {CURRENCY_SYMBOLS[currency]})
                    </Text>
                    <TextInput
                      style={[
                        styles.input,
                        {
                          backgroundColor: colors.inputBackground,
                          color: colors.text,
                        }
                      ]}
                      value={localFilters.minMarketCap}
                      onChangeText={(text) => setLocalFilters({ ...localFilters, minMarketCap: text })}
                      keyboardType="numeric"
                      placeholder="Min market cap"
                      placeholderTextColor={colors.textSecondary}
                      returnKeyType="done"
                      onSubmitEditing={Keyboard.dismiss}
                    />
                  </View>
                </View>

                <View style={styles.section}>
                  <Text style={[styles.sectionTitle, { color: colors.text }]}>
                    Sort By
                  </Text>
                  <View style={styles.optionsContainer}>
                    {[
                      { value: 'market_cap', label: 'Market Cap' },
                      { value: 'price', label: 'Price' },
                      { value: 'name', label: 'Name' },
                      { value: 'price_change_24h', label: '24h Change' },
                    ].map((option) => (
                      <View key={option.value} style={{ width: '48%' }}>
                        <TouchableOpacity
                          style={[
                            styles.option,
                            localFilters.sortBy === option.value && {
                              backgroundColor: colors.primaryLight,
                              borderColor: colors.primary,
                            }
                          ]}
                          onPress={() => handleSortByChange(option.value as any)}
                        >
                          <Text
                            style={[
                              styles.optionText,
                              { color: localFilters.sortBy === option.value ? colors.primary : colors.text }
                            ]}
                            numberOfLines={1}
                          >
                            {option.label}
                          </Text>
                          {localFilters.sortBy === option.value && (
                            <Check color={colors.primary} size={16} />
                          )}
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                </View>

                <View style={styles.section}>
                  <Text style={[styles.sectionTitle, { color: colors.text }]}>
                    Direction
                  </Text>
                  <View style={styles.directionContainer}>
                    <TouchableOpacity
                      style={[
                        styles.directionButton,
                        {
                          backgroundColor: localFilters.sortDirection === 'desc'
                            ? colors.primaryLight
                            : colors.inputBackground,
                          borderTopLeftRadius: 8,
                          borderBottomLeftRadius: 8,
                        }
                      ]}
                      onPress={() => handleSortDirectionChange('desc')}
                    >
                      <Text
                        style={[
                          styles.directionText,
                          {
                            color: localFilters.sortDirection === 'desc'
                              ? colors.primary
                              : colors.textSecondary
                          }
                        ]}
                      >
                        Descending
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.directionButton,
                        {
                          backgroundColor: localFilters.sortDirection === 'asc'
                            ? colors.primaryLight
                            : colors.inputBackground,
                          borderTopRightRadius: 8,
                          borderBottomRightRadius: 8,
                        }
                      ]}
                      onPress={() => handleSortDirectionChange('asc')}
                    >
                      <Text
                        style={[
                          styles.directionText,
                          {
                            color: localFilters.sortDirection === 'asc'
                              ? colors.primary
                              : colors.textSecondary
                          }
                        ]}
                      >
                        Ascending
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={[styles.resetButton, { borderColor: colors.primary }]}
                    onPress={handleReset}
                  >
                    <Text style={[styles.resetButtonText, { color: colors.primary }]}>
                      Reset
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.applyButton, { backgroundColor: colors.primary }]}
                    onPress={handleApply}
                  >
                    <Text style={[styles.applyButtonText, { color: colors.cardText }]}>
                      Apply Filters
                    </Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Inter_600SemiBold',
  },
  closeButton: {
    padding: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputContainer: {
    flex: 1,
    marginHorizontal: 4,
  },
  inputLabel: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    marginBottom: 6,
  },
  input: {
    height: 46,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
    justifyContent: 'space-between',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'transparent',
    margin: 4,
    width: '100%',
  },
  optionText: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    marginRight: 4,
    flexShrink: 1,
  },
  directionContainer: {
    flexDirection: 'row',
    borderRadius: 8,
    overflow: 'hidden',
  },
  directionButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  directionText: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 12,
  },
  resetButton: {
    flex: 1,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    borderWidth: 1,
  },
  resetButtonText: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },
  applyButton: {
    flex: 2,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },
});

export default FilterModal;