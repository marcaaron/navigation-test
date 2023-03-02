import _ from "underscore";
import * as React from "react";
import { View, Pressable, Text, useRef, StyleSheet } from "react-native";
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
  runOnJS,
  interpolate,
} from "react-native-reanimated";

const RIGHT_PANEL_WIDTH = 375;
const LEFT_PANEL_WIDTH = 350;
const RIGHT_PANEL_ANIMATION_DURATION = 200;

const displayIfTrue = (condition) => ({ display: condition ? "flex" : "none" });

const WideView = ({ state, descriptors, navigation }) => {
  const lastChatIndex = _.findLastIndex(state.routes, { name: "Chat" });
  const isRightPanelVisible = React.useMemo(() => {
    const lastRightHandStackIndex = _.findLastIndex(state.routes, {
      name: "RightHandStack",
    });
    if (
      lastRightHandStackIndex === -1 ||
      lastRightHandStackIndex < lastChatIndex
    ) {
      return false;
    }
    return true;
  }, [state.routes]);

  const [animateHidingRightPanel, setAnimateHidingRightPanel] =
    React.useState(false);

  const rightHandModalRef = React.useRef(null);

  const afterCloseAnimation = () => {
    rightHandModalRef.current = null;
    setAnimateHidingRightPanel(false);
  };

  const afterOpenAnimation = () => setAnimateHidingRightPanel(true);

  const animationProgress = useDerivedValue(() => {
    if (isRightPanelVisible) {
      return withTiming(1, { duration: RIGHT_PANEL_ANIMATION_DURATION }, () =>
        runOnJS(afterOpenAnimation)()
      );
    } else {
      return withTiming(0, { duration: RIGHT_PANEL_ANIMATION_DURATION }, () =>
        runOnJS(afterCloseAnimation)()
      );
    }
  }, [isRightPanelVisible]);

  const overlayAnimatedStyle = useAnimatedStyle(() => {
    return { opacity: animationProgress.value };
  });

  const rightPanelAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: interpolate(
            animationProgress.value,
            [0, 1],
            [RIGHT_PANEL_WIDTH, 0]
          ),
        },
      ],
    };
  });

  const renderRightPanel = ({ key, shouldDisplay, children }) => {
    return (
      <Animated.View
        key={key}
        style={[
          styles.rightPanelContainer,
          displayIfTrue(shouldDisplay),
          overlayAnimatedStyle,
        ]}
      >
        <Pressable style={{ flex: 1 }} onPress={() => navigation.goBack()} />
        <Animated.View
          style={[styles.rightPanelInnerContainer, rightPanelAnimatedStyle]}
        >
          {children}
        </Animated.View>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      {state.routes.map((route, i) => {
        if (route.name === "LeftHandNav") {
          return (
            <View key={route.key} style={styles.leftPanelContainer}>
              {descriptors[route.key].render()}
            </View>
          );
        } else if (route.name === "Chat") {
          return (
            <View
              key={route.key}
              style={[
                styles.centralPanelContainer,
                displayIfTrue(lastChatIndex === i),
              ]}
            >
              {descriptors[route.key].render()}
            </View>
          );
        }

        if (state.index === i) {
          rightHandModalRef.current = descriptors[route.key];
        }

        return renderRightPanel({
          key: route.key,
          shouldDisplay: state.index === i,
          children: descriptors[route.key].render(),
        });
      })}
    </View>
  );
};

export default WideView;

const styles = StyleSheet.create({
  container: { flexDirection: "row", flex: 1 },
  leftPanelContainer: {
    flex: 1,
    maxWidth: LEFT_PANEL_WIDTH,
    borderRightWidth: 1,
  },
  centralPanelContainer: { flex: 1 },
  rightPanelContainer: {
    width: "100%",
    height: "100%",
    position: "absolute",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    flexDirection: "row",
  },
  rightPanelInnerContainer: { width: RIGHT_PANEL_WIDTH },
});
