import _ from "underscore";
import * as React from "react";
import { View, Pressable } from "react-native";
import {
  useNavigationBuilder,
  createNavigatorFactory,
  StackRouter,
} from "@react-navigation/native";

function CustomStackNavigator(props) {
  const { navigation, state, descriptors, NavigationContent } =
    useNavigationBuilder(StackRouter, {
      children: props.children,
      screenOptions: props.screenOptions,
      initialRouteName: props.initialRouteName,
    });

  const lastChatIndex = _.findLastIndex(state.routes, { name: "Chat" });

  return (
    <NavigationContent>
      <View style={{ flexDirection: "row", flex: 1 }}>
        {state.routes.map((route, i) => {
          if (route.name === "LeftHandNav") {
            return (
              <View
                key={route.key}
                style={{ maxWidth: 350, flex: 1, borderRightWidth: 1 }}
              >
                {descriptors[route.key].render()}
              </View>
            );
          }

          if (route.name === "Chat") {
            return (
              <View key={route.key} style={{ flex: 1, display: lastChatIndex === i ? 'flex' : 'none' }}>
                {descriptors[route.key].render()}
              </View>
            );
          }

          return (
            <View
              key={route.key}
              style={{ width: "100%", height: "100%", position: "absolute", display: state.index === i ? 'flex' : 'none'}}
            >
              <View
                style={{ flexDirection: "row", width: "100%", height: "100%" }}
              >
                <Pressable
                  style={{ flex: 1 }}
                  onPress={() => navigation.goBack()}
                >
                  <View
                    style={{
                      backgroundColor: "rgba(0, 0, 0, 0.4)",
                      flex: 1,
                      width: "100%",
                      height: "100%",
                    }}
                  />
                </Pressable>
                <View style={{ width: 375, backgroundColor: 'white' }}>
                  {descriptors[route.key].render()}
                </View>
              </View>
            </View>
          );
        })}
      </View>
    </NavigationContent>
  );
}

export default createNavigatorFactory(CustomStackNavigator);
