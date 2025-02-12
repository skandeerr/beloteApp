import Animated from 'react-native-reanimated';

const AnimatedCard = Animated.createAnimatedComponent(Card);

const CardAnimation = ({ card, onPress, style }) => {
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: withSpring(-10) }],
  }));

  return (
    <AnimatedCard
      card={card}
      onPress={onPress}
      style={[style, animatedStyle]}
    />
  );
};