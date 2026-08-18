import { createContext, useContext, type ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { getGetCurrentStaffQueryKey, useGetCurrentStaff, useLogin, useLogout, useRegister } from '@workspace/api-client';
import type { StaffAccount } from '@workspace/api-client';

type AuthContextValue = {
  staff: StaffAccount | undefined;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isSubmitting: boolean;
  error: string | null;
  clearError: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const client = useQueryClient();
  const me = useGetCurrentStaff({ query: { queryKey: getGetCurrentStaffQueryKey(), retry: false } });
  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const logoutMutation = useLogout();

  const invalidateSession = () => client.invalidateQueries({ queryKey: getGetCurrentStaffQueryKey() });

  const value: AuthContextValue = {
    staff: me.data,
    isLoading: me.isLoading,
    isSubmitting: loginMutation.isPending || registerMutation.isPending,
    error:
      extractErrorMessage(loginMutation.error) ??
      extractErrorMessage(registerMutation.error) ??
      null,
    clearError: () => {
      loginMutation.reset();
      registerMutation.reset();
    },
    login: async (email, password) => {
      await loginMutation.mutateAsync({ data: { email, password } });
      await invalidateSession();
    },
    register: async (name, email, password) => {
      await registerMutation.mutateAsync({ data: { name, email, password } });
      await invalidateSession();
    },
    logout: async () => {
      await logoutMutation.mutateAsync();
      await invalidateSession();
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}

function extractErrorMessage(error: unknown): string | null {
  if (!error) return null;
  if (error instanceof Error) return error.message;
  return 'Something went wrong. Please try again.';
}
