import { create } from 'zustand';
import { Models, Query } from 'react-native-appwrite';
import { authService, dbService, COLLECTIONS } from '../services/appwrite';
import { biometricService } from '../services/biometric';

interface UserProfile {
  $id: string;
  userId: string;
  name: string;
  email: string;
  avatar?: string;
  subscription: 'free' | 'starter' | 'pro' | 'alltools';
  generationsUsed: number;
  generationsLimit: number;
  credits?: number;
  generationsCount?: number;
  savedCount?: number;
  toolsUsed?: number;
  createdAt: string;
}

interface AuthState {
  user: Models.User<Models.Preferences> | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  biometricEnabled: boolean;
  biometricPending: boolean;

  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithApple: () => Promise<void>;
  loginWithFacebook: () => Promise<void>;
  sendPhoneOTP: (phone: string) => Promise<string>;
  verifyPhoneOTP: (userId: string, otp: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  clearError: () => void;
  fetchOrCreateProfile: (user: Models.User<Models.Preferences>) => Promise<UserProfile>;
  enableBiometric: () => Promise<boolean>;
  disableBiometric: () => Promise<void>;
  authenticateWithBiometric: () => Promise<boolean>;
  loadBiometricState: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  isLoading: true,
  isAuthenticated: false,
  error: null,
  biometricEnabled: false,
  biometricPending: false,

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });

    try {
      // Add timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Login timeout')), 5000)
      );
      await Promise.race([authService.login(email, password), timeoutPromise]);
      const user = await Promise.race([authService.getCurrentUser(), timeoutPromise]) as any;
      if (user) {
        // Fetch or create user profile
        const profile = await get().fetchOrCreateProfile(user);
        set({ user, profile, isAuthenticated: true, isLoading: false });
      }
    } catch (error: any) {
      set({ error: error.message || 'Login failed', isLoading: false });
      throw error;
    }
  },

  register: async (email: string, password: string, name: string) => {
    set({ isLoading: true, error: null });
    try {
      await authService.createAccount(email, password, name);
      const user = await authService.getCurrentUser();
      if (user) {
        const profile = await get().fetchOrCreateProfile(user);
        set({ user, profile, isAuthenticated: true, isLoading: false });
      }
    } catch (error: any) {
      set({ error: error.message || 'Registration failed', isLoading: false });
      throw error;
    }
  },

  loginWithGoogle: async () => {
    set({ isLoading: true, error: null });
    try {
      const session = await authService.loginWithGoogle();
      if (session) {
        const user = await authService.getCurrentUser();
        if (user) {
          const profile = await get().fetchOrCreateProfile(user);
          set({ user, profile, isAuthenticated: true, isLoading: false });
          return;
        }
      }
      set({ isLoading: false, error: 'Google login was cancelled or failed' });
    } catch (error: any) {
      set({ error: error.message || 'Google login failed', isLoading: false });
      throw error;
    }
  },

  loginWithApple: async () => {
    set({ isLoading: true, error: null });
    try {
      const session = await authService.loginWithApple();
      if (session) {
        const user = await authService.getCurrentUser();
        if (user) {
          const profile = await get().fetchOrCreateProfile(user);
          set({ user, profile, isAuthenticated: true, isLoading: false });
          return;
        }
      }
      set({ isLoading: false, error: 'Apple login was cancelled or failed' });
    } catch (error: any) {
      set({ error: error.message || 'Apple login failed', isLoading: false });
      throw error;
    }
  },

  loginWithFacebook: async () => {
    set({ isLoading: true, error: null });
    try {
      const session = await authService.loginWithFacebook();
      if (session) {
        const user = await authService.getCurrentUser();
        if (user) {
          const profile = await get().fetchOrCreateProfile(user);
          set({ user, profile, isAuthenticated: true, isLoading: false });
          return;
        }
      }
      set({ isLoading: false, error: 'Facebook login was cancelled or failed' });
    } catch (error: any) {
      set({ error: error.message || 'Facebook login failed', isLoading: false });
      throw error;
    }
  },

  sendPhoneOTP: async (phone: string): Promise<string> => {
    set({ isLoading: true, error: null });
    try {
      const token = await authService.sendPhoneOTP(phone);
      set({ isLoading: false });
      return token.userId;
    } catch (error: any) {
      set({ error: error.message || 'Failed to send OTP', isLoading: false });
      throw error;
    }
  },

  verifyPhoneOTP: async (userId: string, otp: string): Promise<void> => {
    set({ isLoading: true, error: null });
    try {
      await authService.verifyPhoneOTP(userId, otp);
      const user = await authService.getCurrentUser();
      if (user) {
        const profile = await get().fetchOrCreateProfile(user);
        set({ user, profile, isAuthenticated: true, isLoading: false });
      }
    } catch (error: any) {
      set({ error: error.message || 'OTP verification failed', isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await authService.logout();
      set({
        user: null,
        profile: null,
        isAuthenticated: false,
        isLoading: false,
        biometricPending: false,
      });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  checkAuth: async () => {
    set({ isLoading: true });
    try {
      // Add timeout to prevent hanging on unreachable API
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Auth check timeout')), 5000)
      );
      const user = await Promise.race([
        authService.getCurrentUser(),
        timeoutPromise
      ]) as any;
      if (user) {
        // Check if biometric is enabled
        const bioEnabled = await biometricService.isBiometricEnabled();
        if (bioEnabled) {
          // Session exists + biometric enabled: wait for biometric before restoring
          set({ user, biometricEnabled: true, biometricPending: true, isLoading: false, isAuthenticated: false });
          return;
        }
        const profile = await get().fetchOrCreateProfile(user);
        set({ user, profile, isAuthenticated: true, isLoading: false });
      } else {
        set({ user: null, profile: null, isAuthenticated: false, isLoading: false });
      }
    } catch (error) {
      // On error or timeout, proceed as not authenticated
      set({ user: null, profile: null, isAuthenticated: false, isLoading: false });
    }
  },

  resetPassword: async (email: string) => {
    set({ isLoading: true, error: null });
    try {
      await authService.resetPassword(email);
      set({ isLoading: false });
    } catch (error: any) {
      set({ error: error.message || 'Password reset failed', isLoading: false });
      throw error;
    }
  },

  updateProfile: async (data: Partial<UserProfile>) => {
    const { profile } = get();
    if (!profile) return;

    set({ isLoading: true });
    try {
      const updated = await dbService.updateDocument<UserProfile & Models.Document>(
        COLLECTIONS.USERS,
        profile.$id,
        data
      );
      set({ profile: updated as UserProfile, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  clearError: () => set({ error: null }),

  enableBiometric: async (): Promise<boolean> => {
    const available = await biometricService.isBiometricAvailable();
    if (!available) return false;
    const success = await biometricService.authenticate('Verify to enable biometric login');
    if (success) {
      await biometricService.setBiometricEnabled(true);
      set({ biometricEnabled: true });
      return true;
    }
    return false;
  },

  disableBiometric: async () => {
    await biometricService.setBiometricEnabled(false);
    set({ biometricEnabled: false });
  },

  authenticateWithBiometric: async (): Promise<boolean> => {
    const success = await biometricService.authenticate('Sign in to MarketingTool');
    if (success) {
      const { user } = get();
      if (user) {
        const profile = await get().fetchOrCreateProfile(user);
        set({ profile, isAuthenticated: true, biometricPending: false });
        return true;
      }
    }
    return false;
  },

  loadBiometricState: async () => {
    const enabled = await biometricService.isBiometricEnabled();
    set({ biometricEnabled: enabled });
  },

  // Helper function to fetch or create user profile
  fetchOrCreateProfile: async (user: Models.User<Models.Preferences>): Promise<UserProfile> => {
    try {
      // Try to fetch existing profile
      const profiles = await dbService.listDocuments<UserProfile & Models.Document>(
        COLLECTIONS.USERS,
        [Query.equal('userId', user.$id)]
      );

      if (profiles.documents.length > 0) {
        return profiles.documents[0] as UserProfile;
      }

      // Create new profile
      const newProfile = await dbService.createDocument<UserProfile & Models.Document>(
        COLLECTIONS.USERS,
        {
          userId: user.$id,
          name: user.name || '',
          email: user.email,
          subscription: 'free',
          generationsUsed: 0,
          generationsLimit: 10,
          createdAt: new Date().toISOString(),
        }
      );

      return newProfile as UserProfile;
    } catch (error) {
      // Return a default profile if database operations fail
      return {
        $id: user.$id,
        userId: user.$id,
        name: user.name || '',
        email: user.email,
        subscription: 'free',
        generationsUsed: 0,
        generationsLimit: 10,
        createdAt: new Date().toISOString(),
      };
    }
  },
}));

export default useAuthStore;
