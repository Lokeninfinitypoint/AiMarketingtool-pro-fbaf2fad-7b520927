import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
  Animated,
  Dimensions,
  Easing,
  Image,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import LottieView from 'lottie-react-native';
import { AuthStackParamList } from '../../navigation/AppNavigator';
import { useAuthStore } from '../../store/authStore';
import { Colors, Gradients, Spacing, BorderRadius } from '../../constants/theme';
import AnimatedBackground from '../../components/common/AnimatedBackground';
import { biometricService, BiometricType } from '../../services/biometric';

const { width, height } = Dimensions.get('window');

// Login method options
interface LoginMethod {
  id: string;
  name: string;
  icon: string;
  color: string;
  gradient: string[];
  description: string;
}

const loginMethods: LoginMethod[] = [
  {
    id: 'google',
    name: 'Google',
    icon: 'search',
    color: '#4285F4',
    gradient: ['#4285F4', '#34A853'],
    description: 'Sign in with Google',
  },
  {
    id: 'phone',
    name: 'Phone',
    icon: 'phone',
    color: '#22C55E',
    gradient: ['#22C55E', '#16A34A'],
    description: 'Sign in with OTP',
  },
  {
    id: 'apple',
    name: 'Apple',
    icon: 'monitor',
    color: '#000000',
    gradient: ['#1D1D1F', '#555555'],
    description: 'Sign in with Apple ID',
  },
  {
    id: 'facebook',
    name: 'Facebook',
    icon: 'facebook',
    color: '#1877F2',
    gradient: ['#1877F2', '#3B5998'],
    description: 'Sign in with Facebook',
  },
  {
    id: 'email',
    name: 'Email',
    icon: 'mail',
    color: '#FF6B6B',
    gradient: ['#FF6B6B', '#EE5A5A'],
    description: 'Sign in with email',
  },
];

type NavigationProp = NativeStackNavigationProp<AuthStackParamList>;

const LoginScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { login, loginWithGoogle, loginWithApple, loginWithFacebook, sendPhoneOTP, verifyPhoneOTP, isLoading, error, clearError, biometricPending, authenticateWithBiometric } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpUserId, setOtpUserId] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [biometricType, setBiometricType] = useState<BiometricType>('none');
  const [biometricAvailable, setBiometricAvailable] = useState(false);

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        easing: Easing.out(Easing.back(1.2)),
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Pulse animation for logo
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    pulseLoop.start();
    return () => pulseLoop.stop();
  }, []);

  // Check biometric availability and auto-prompt if pending
  useEffect(() => {
    const checkBiometric = async () => {
      const available = await biometricService.isBiometricAvailable();
      setBiometricAvailable(available);
      if (available) {
        const type = await biometricService.getBiometricType();
        setBiometricType(type);
      }
      // Auto-prompt biometric if session exists and biometric is pending
      if (available && biometricPending) {
        const success = await authenticateWithBiometric();
        if (!success) {
          // Failed or cancelled - user can retry or use another method
        }
      }
    };
    checkBiometric();
  }, [biometricPending]);

  const handleBiometricLogin = async () => {
    const success = await authenticateWithBiometric();
    if (!success) {
      Alert.alert('Authentication Failed', 'Biometric authentication failed. Please try another sign in method.');
    }
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = async () => {
    clearError();
    setEmailError('');
    setPasswordError('');

    if (!email) {
      setEmailError('Email is required');
      return;
    }
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email');
      return;
    }
    if (!password) {
      setPasswordError('Password is required');
      return;
    }
    if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      return;
    }

    try {
      await login(email, password);
    } catch (err: any) {
      Alert.alert('Login Failed', err.message || 'Please check your credentials');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch (err: any) {
      Alert.alert(
        'Google Login Failed',
        err.message || 'Please check your internet connection and try again'
      );
    }
  };

  const handleAppleLogin = async () => {
    try {
      await loginWithApple();
    } catch (err: any) {
      Alert.alert('Apple Login Failed', err.message);
    }
  };

  const handleFacebookLogin = async () => {
    try {
      await loginWithFacebook();
    } catch (err: any) {
      Alert.alert('Facebook Login Failed', err.message || 'Please try again');
    }
  };

  const handleSendOTP = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      Alert.alert('Invalid Number', 'Please enter a valid phone number (10 digits for India)');
      return;
    }
    try {
      let formattedPhone = phoneNumber.replace(/[\s\-()]/g, '');
      // Auto-add +91 for 10-digit Indian numbers
      if (formattedPhone.length === 10 && /^[6-9]\d{9}$/.test(formattedPhone)) {
        formattedPhone = `+91${formattedPhone}`;
      } else if (formattedPhone.startsWith('91') && formattedPhone.length === 12) {
        formattedPhone = `+${formattedPhone}`;
      } else if (!formattedPhone.startsWith('+')) {
        formattedPhone = `+${formattedPhone}`;
      }
      const userId = await sendPhoneOTP(formattedPhone);
      setOtpUserId(userId);
      setOtpSent(true);
    } catch (err: any) {
      Alert.alert('OTP Failed', err.message || 'Failed to send OTP. Please check your number and try again.');
    }
  };

  const handleVerifyOTP = async () => {
    if (!otpCode || otpCode.length < 6) {
      Alert.alert('Invalid OTP', 'Please enter the 6-digit OTP');
      return;
    }
    try {
      await verifyPhoneOTP(otpUserId, otpCode);
      setShowPhoneModal(false);
    } catch (err: any) {
      Alert.alert('Verification Failed', err.message || 'Invalid OTP');
    }
  };

  const handleLoginMethod = (methodId: string) => {
    setSelectedMethod(methodId);
    switch (methodId) {
      case 'google':
        handleGoogleLogin();
        break;
      case 'apple':
        handleAppleLogin();
        break;
      case 'facebook':
        handleFacebookLogin();
        break;
      case 'phone':
        setShowPhoneModal(true);
        setOtpSent(false);
        setPhoneNumber('');
        setOtpCode('');
        break;
      case 'email':
        setShowEmailModal(true);
        break;
    }
    setTimeout(() => setSelectedMethod(null), 1000);
  };

  return (
    <AnimatedBackground variant="default" showParticles={true}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Animated Header */}
          <Animated.View style={[styles.header, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
            <Animated.View style={[styles.logoContainer, { transform: [{ scale: pulseAnim }] }]}>
              <Image
                source={require('../../../assets/icon.png')}
                style={styles.logoImage}
                resizeMode="contain"
              />
            </Animated.View>
            <Text style={styles.title}>MarketingTool</Text>
            <Text style={styles.subtitle}>206+ AI Marketing Tools</Text>
          </Animated.View>

          {/* Biometric Quick Login */}
          {biometricPending && biometricAvailable && (
            <Animated.View style={[styles.biometricSection, { opacity: fadeAnim }]}>
              <TouchableOpacity
                style={styles.biometricButton}
                onPress={handleBiometricLogin}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#6441A5', '#851EFF']}
                  style={styles.biometricGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Feather
                    name={biometricType === 'face' ? 'eye' : 'smartphone'}
                    size={32}
                    color={Colors.white}
                  />
                  <Text style={styles.biometricButtonText}>
                    {biometricType === 'face' ? 'Sign in with Face ID' : 'Sign in with Touch ID'}
                  </Text>
                  <Text style={styles.biometricSubtext}>Tap to authenticate</Text>
                </LinearGradient>
              </TouchableOpacity>
              <View style={styles.biometricDivider}>
                <View style={styles.biometricDividerLine} />
                <Text style={styles.biometricDividerText}>or use another method</Text>
                <View style={styles.biometricDividerLine} />
              </View>
            </Animated.View>
          )}

          {/* Login Methods Grid */}
          <Animated.View style={[styles.methodsSection, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
            <Text style={styles.methodsTitle}>Choose how to sign in</Text>
            <View style={styles.methodsGrid}>
              {loginMethods.map((method, index) => {
                // Skip Apple on Android
                if (method.id === 'apple' && Platform.OS !== 'ios') return null;

                return (
                  <TouchableOpacity
                    key={method.id}
                    style={[
                      styles.methodCard,
                      selectedMethod === method.id && styles.methodCardActive
                    ]}
                    onPress={() => handleLoginMethod(method.id)}
                    activeOpacity={0.8}
                    disabled={isLoading}
                  >
                    <LinearGradient
                      colors={method.gradient as [string, string]}
                      style={styles.methodGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    >
                      {isLoading && selectedMethod === method.id ? (
                        <ActivityIndicator color={Colors.white} size="small" />
                      ) : (
                        <Feather name={method.icon as any} size={28} color={Colors.white} />
                      )}
                    </LinearGradient>
                    <Text style={styles.methodName}>{method.name}</Text>
                    <Text style={styles.methodDesc} numberOfLines={1}>{method.description}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </Animated.View>

          {/* Quick Email Login (collapsed by default) */}
          <Animated.View style={[styles.quickEmailSection, { opacity: fadeAnim }]}>
            <TouchableOpacity
              style={styles.quickEmailToggle}
              onPress={() => setShowEmailModal(true)}
            >
              <View style={styles.quickEmailLeft}>
                <Feather name="mail" size={20} color={Colors.secondary} />
                <Text style={styles.quickEmailText}>Sign in with email & password</Text>
              </View>
              <Feather name="chevron-right" size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
          </Animated.View>

          {/* Features Banner */}
          <View style={styles.featuresBanner}>
            <View style={styles.featureItem}>
              <Feather name="zap" size={18} color={Colors.gold} />
              <Text style={styles.featureText}>206+ Tools</Text>
            </View>
            <View style={styles.featureDivider} />
            <View style={styles.featureItem}>
              <Feather name="shield" size={18} color={Colors.success} />
              <Text style={styles.featureText}>Secure</Text>
            </View>
            <View style={styles.featureDivider} />
            <View style={styles.featureItem}>
              <Feather name="clock" size={18} color={Colors.cyan} />
              <Text style={styles.featureText}>7-Day Trial</Text>
            </View>
          </View>

          {/* Register Link */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.registerLink}>Sign Up Free</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Email Login Modal */}
      <Modal
        visible={showEmailModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowEmailModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Sign in with Email</Text>
              <TouchableOpacity onPress={() => setShowEmailModal(false)} style={styles.modalClose}>
                <Feather name="x" size={24} color={Colors.white} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <View style={[styles.inputContainer, emailError && styles.inputError]}>
                <Feather name="mail" size={20} color={Colors.textTertiary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Email address"
                  placeholderTextColor={Colors.textTertiary}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
              {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

              <View style={[styles.inputContainer, passwordError && styles.inputError]}>
                <Feather name="lock" size={20} color={Colors.textTertiary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor={Colors.textTertiary}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                  <Feather name={showPassword ? 'eye-off' : 'eye'} size={20} color={Colors.textTertiary} />
                </TouchableOpacity>
              </View>
              {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

              <TouchableOpacity
                onPress={() => {
                  setShowEmailModal(false);
                  navigation.navigate('ForgotPassword');
                }}
                style={styles.forgotPassword}
              >
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  handleLogin();
                }}
                disabled={isLoading}
                style={styles.modalLoginBtn}
              >
                <LinearGradient
                  colors={['#FF6B35', '#F7931E']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.loginButtonGradient}
                >
                  {isLoading ? (
                    <ActivityIndicator color={Colors.white} />
                  ) : (
                    <Text style={styles.loginButtonText}>Sign In</Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      {/* Phone OTP Modal */}
      <Modal
        visible={showPhoneModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowPhoneModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{otpSent ? 'Enter OTP' : 'Phone Login'}</Text>
              <TouchableOpacity onPress={() => setShowPhoneModal(false)} style={styles.modalClose}>
                <Feather name="x" size={24} color={Colors.white} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              {!otpSent ? (
                <>
                  <View style={styles.inputContainer}>
                    <Feather name="phone" size={20} color={Colors.textTertiary} style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="Enter 10-digit mobile number"
                      placeholderTextColor={Colors.textTertiary}
                      value={phoneNumber}
                      onChangeText={setPhoneNumber}
                      keyboardType="phone-pad"
                      autoFocus
                      maxLength={15}
                    />
                  </View>
                  <Text style={{ color: Colors.textSecondary, fontSize: 12, marginBottom: 16 }}>
                    Enter your 10-digit number (e.g. 9571312555). Country code +91 is added automatically for Indian numbers.
                  </Text>
                  <TouchableOpacity onPress={handleSendOTP} disabled={isLoading} style={styles.modalLoginBtn}>
                    <LinearGradient colors={['#22C55E', '#16A34A']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.loginButtonGradient}>
                      {isLoading ? <ActivityIndicator color={Colors.white} /> : <Text style={styles.loginButtonText}>Send OTP</Text>}
                    </LinearGradient>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <Text style={{ color: Colors.textSecondary, fontSize: 14, textAlign: 'center', marginBottom: 16 }}>
                    OTP sent to {phoneNumber}
                  </Text>
                  <View style={styles.inputContainer}>
                    <Feather name="lock" size={20} color={Colors.textTertiary} style={styles.inputIcon} />
                    <TextInput
                      style={[styles.input, { textAlign: 'center', letterSpacing: 8, fontSize: 24, fontWeight: 'bold' }]}
                      placeholder="000000"
                      placeholderTextColor={Colors.textTertiary}
                      value={otpCode}
                      onChangeText={(t) => setOtpCode(t.replace(/\D/g, '').slice(0, 6))}
                      keyboardType="number-pad"
                      maxLength={6}
                      autoFocus
                    />
                  </View>
                  <TouchableOpacity onPress={handleVerifyOTP} disabled={isLoading} style={styles.modalLoginBtn}>
                    <LinearGradient colors={['#22C55E', '#16A34A']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.loginButtonGradient}>
                      {isLoading ? <ActivityIndicator color={Colors.white} /> : <Text style={styles.loginButtonText}>Verify & Sign In</Text>}
                    </LinearGradient>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => { setOtpSent(false); setOtpCode(''); }} style={{ marginTop: 12, alignItems: 'center' }}>
                    <Text style={{ color: Colors.secondary, fontSize: 14 }}>Change Number</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        </View>
      </Modal>
    </AnimatedBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#16132B',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: 80,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  logoContainer: {
    marginBottom: Spacing.md,
  },
  logoGradient: {
    width: 80,
    height: 80,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
  },
  logoImage: {
    width: 90,
    height: 90,
    borderRadius: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.white,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  // Biometric Quick Login
  biometricSection: {
    marginBottom: Spacing.lg,
  },
  biometricButton: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
  biometricGradient: {
    paddingVertical: Spacing.xl,
    alignItems: 'center',
    borderRadius: BorderRadius.lg,
  },
  biometricButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.white,
    marginTop: Spacing.sm,
  },
  biometricSubtext: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 4,
  },
  biometricDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.lg,
  },
  biometricDividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  biometricDividerText: {
    fontSize: 13,
    color: Colors.textSecondary,
    paddingHorizontal: Spacing.md,
  },
  // Login Methods Grid
  methodsSection: {
    marginBottom: Spacing.xl,
  },
  methodsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.white,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  methodsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: Spacing.md,
  },
  methodCard: {
    width: (width - Spacing.lg * 2 - Spacing.md) / 2,
    backgroundColor: 'rgba(26, 26, 46, 0.6)',
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#6441A5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  methodCardActive: {
    borderColor: Colors.secondary,
    backgroundColor: 'rgba(247, 84, 30, 0.15)',
    shadowColor: Colors.secondary,
    shadowOpacity: 0.3,
  },
  methodGradient: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  methodName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.white,
    marginBottom: 2,
  },
  methodDesc: {
    fontSize: 11,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  // Quick Email Section
  quickEmailSection: {
    marginBottom: Spacing.xl,
  },
  quickEmailToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(18, 18, 18, 0.7)',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  quickEmailLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  quickEmailText: {
    fontSize: 15,
    color: Colors.white,
  },
  // Features Banner - Glassmorphism
  featuresBanner: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(100, 65, 165, 0.12)',
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.xl,
    borderWidth: 1,
    borderColor: 'rgba(100, 65, 165, 0.25)',
    shadowColor: '#6441A5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: Spacing.md,
  },
  featureText: {
    fontSize: 13,
    color: Colors.white,
    fontWeight: '500',
  },
  featureDivider: {
    width: 1,
    height: 20,
    backgroundColor: Colors.border,
  },
  // Modal Styles - Glassmorphism
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'rgba(12, 11, 24, 0.95)',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 40,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#6441A5',
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.white,
  },
  modalClose: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBody: {
    padding: Spacing.lg,
  },
  modalLoginBtn: {
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
  },
  // Form Inputs
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.md,
  },
  inputError: {
    borderColor: Colors.error,
  },
  inputIcon: {
    marginRight: Spacing.sm,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    color: Colors.white,
  },
  eyeIcon: {
    padding: Spacing.sm,
  },
  errorText: {
    color: Colors.error,
    fontSize: 12,
    marginTop: -8,
    marginBottom: Spacing.sm,
    marginLeft: Spacing.sm,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: Spacing.lg,
  },
  forgotPasswordText: {
    color: Colors.secondary,
    fontSize: 14,
    fontWeight: '500',
  },
  loginButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
    borderRadius: BorderRadius.md,
  },
  loginButtonText: {
    color: Colors.white,
    fontSize: 17,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    color: Colors.textSecondary,
    fontSize: 15,
  },
  registerLink: {
    color: Colors.secondary,
    fontSize: 15,
    fontWeight: '600',
  },
});

export default LoginScreen;
