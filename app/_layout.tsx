import { SavingsProvider } from "@/hooks/savings-store";
import { ThemeProvider, useTheme } from "@/hooks/theme-store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  const { theme } = useTheme();
  
  return (
    <>
      <StatusBar style={theme.isDark ? "light" : "dark"} />
      <Stack 
        screenOptions={{ 
          headerBackTitle: "Back",
          headerStyle: {
            backgroundColor: theme.colors.surface,
          },
          headerTintColor: theme.colors.text,
          headerTitleStyle: {
            color: theme.colors.text,
          },
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen 
          name="create-goal" 
          options={{ 
            presentation: "modal",
            title: "Create Goal"
          }} 
        />
        <Stack.Screen 
          name="edit-goal/[id]" 
          options={{ 
            presentation: "modal",
            title: "Edit Goal"
          }} 
        />
        <Stack.Screen name="goal/[id]" />
        <Stack.Screen 
          name="add-transaction/[id]" 
          options={{ 
            presentation: "modal",
            title: "Add Transaction"
          }} 
        />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <SavingsProvider>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <RootLayoutNav />
          </GestureHandlerRootView>
        </SavingsProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}