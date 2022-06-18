import React, { useCallback, useEffect, useState, useMemo } from "react"
import { Asset } from "expo-asset"
import Constants from "expo-constants"
import * as SplashScreen from "expo-splash-screen"
import Ionicons from "@expo/vector-icons/Ionicons"
import { Animated, View } from "react-native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { NavigationContainer } from "@react-navigation/native"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"

import HomeScreen from "./screens/HomeScreen"

SplashScreen.preventAutoHideAsync().catch(() => {})

const Stack = createNativeStackNavigator()
const Tab = createBottomTabNavigator()

const Main = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName
          switch (route.name) {
            case "Home":
              iconName = "ios-home"
              break
            case "Browse":
              iconName = "ios-search"
              break
            case "Rewards":
              iconName = "ios-gift"
              break
            case "Favorites":
              iconName = "ios-heart"
              break
            case "Account":
              iconName = "ios-person"
              break
            default:
              break
          }
          // You can return any component that you like here!
          return <Ionicons name={iconName} size={size} color={color} />
        },
        tabBarActiveTintColor: "black",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
    </Tab.Navigator>
  )
}

const App = () => {
  const AnimatedSplashScreen = ({ children, image }) => {
    const animation = useMemo(() => new Animated.Value(1), [])
    const [isAppReady, setIsAppReady] = useState(false)
    const [isSplashAnimationComplete, setAnimationComplete] = useState(false)

    useEffect(() => {
      if (isAppReady) {
        Animated.delay(2000).start(() => {
          Animated.timing(animation, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true,
          }).start(() => setAnimationComplete(true))
        })
      }
    }, [isAppReady])

    const onImageLoaded = useCallback(async () => {
      try {
        await SplashScreen.hideAsync()
        await Promise.all([])
      } catch (e) {
        throw e
      } finally {
        setIsAppReady(true)
      }
    }, [])
    return (
      <View>
        {isAppReady && children}
        {!isSplashAnimationComplete && (
          <Animated.View
            pointerEvents="none"
            style={[
              Stylesheet.absoluteFill,
              {
                backgroundColor: Constants.manifest.splash.backgroundColor,
                opacity: animation,
              },
            ]}
          >
            <Animated.Image
              style={{
                width: "100%",
                height: "100%",
                resizeMode: Constants.manifest.splash.resizeMode || "contain",
              }}
              source={image}
              onLoadEnd={onImageLoaded}
              fadeDuration={0}
            />
          </Animated.View>
        )}
      </View>
    )
  }
  const AnimatedAppLoader = ({ children, image }) => {
    const [isLoadingComplete, setLoadingComplete] = useState(false)
    useEffect(() => {
      async function prepare() {
        await Asset.fromURI(image.uri).downloadAsync()
        setLoadingComplete(true)
      }
      prepare()
    }, [image])
    if (!isLoadingComplete) {
      return null
    }
    return <AnimatedSplashScreen image={image}>{children}</AnimatedSplashScreen>
  }

  return (
    <AnimatedAppLoader image={{ uri: Constants.manifest.splash.image }}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            options={{
              headerShown: false,
            }}
            name="Main"
            component={Main}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </AnimatedAppLoader>
  )
}
export default App
