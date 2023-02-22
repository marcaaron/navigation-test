import _ from "underscore";
import * as React from "react";
import {
  useNavigationBuilder,
  createNavigatorFactory,
  StackRouter,
} from "@react-navigation/native";
import NarrowView from "./views/NarrowView";
import WideView from "./views/WideView";

function CustomStackNavigator(props) {
  const { navigation, state, descriptors, NavigationContent, ...rest } =
    useNavigationBuilder(StackRouter, {
      children: props.children,
      screenOptions: props.screenOptions,
      initialRouteName: props.initialRouteName,
    });

  if (props.isNarrowLayout) {
    return (
      <NavigationContent>
        <NarrowView
          {...rest}
          state={state}
          descriptors={descriptors}
          navigation={navigation}
        />
      </NavigationContent>
    );
  } else {
    return (
      <NavigationContent>
        <WideView
          {...rest}
          state={state}
          descriptors={descriptors}
          navigation={navigation}
        />
      </NavigationContent>
    );
  }
}

export default createNavigatorFactory(CustomStackNavigator);