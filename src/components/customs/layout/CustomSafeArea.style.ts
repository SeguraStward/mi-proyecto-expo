import { AppTheme, getAppTheme, useAppTheme } from "@/src/theme/designSystem";
import { StyleSheet } from "react-native";
import { linear } from "react-native-reanimated";

export const createCustomSafeAreaStyle = (theme: AppTheme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            paddingHorizontal: theme.spacing.xl,
            backgroundColor: theme.colors.background,
        },
    });


    const stylesByMode = {
        light: createUserStyle(getAppTheme('light')),
        dark: createUserStyle(getAppTheme('dark')),
    };


    export function useProfileTheme() {
        const theme = useAppTheme();
        return stylesByMode[theme.mode];
    }