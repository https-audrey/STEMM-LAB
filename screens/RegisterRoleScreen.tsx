import React, { useState } from 'react';
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';
import { FONTS, COLORS } from '../utils/theme';

type Nav = StackNavigationProp<RootStackParamList, 'RegisterRole'>;

const { width: SCREEN_W } = Dimensions.get('window');
const SCALE = SCREEN_W / 440;
const s = (v: number) => v * SCALE;

const roleOptions = [
  {
    id: 'teacher',
    label: 'Teacher',
    imageSrc: require('../assets/image-10.png'),
    wrapperTop: s(381),
    wrapperLeft: s(87),
    imageTop: s(376),
    imageLeft: s(261),
    textTop: s(402),
    textLeft: s(131),
  },
  {
    id: 'student',
    label: 'Student',
    imageSrc: require('../assets/image-7.png'),
    wrapperTop: s(473),
    wrapperLeft: s(87),
    imageTop: s(467),
    imageLeft: s(102),
    textTop: s(495),
    textLeft: s(189),
  },
];

const RegisterRoleScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const [selectedRole, setSelectedRole] = useState<string>('teacher');

  const handleChoose = () => {
    navigation.navigate('RegisterInfo', { role: selectedRole });
  };

  return (
    <View style={styles.container}>
      {/* Background */}
      <Image
        source={require('../assets/download-1-1.png')}
        style={styles.background}
        resizeMode="cover"
      />

      {/* Planet decoration */}
      <View style={styles.planetWrapper}>
        <Image
          source={require('../assets/image.png')}
          style={{ position: 'absolute', top: s(19), left: s(-3), width: s(440), height: s(407) }}
          resizeMode="contain"
        />
        <Image
          source={require('../assets/vector-14.png')}
          style={{ position: 'absolute', top: s(20), left: s(-3), width: s(440), height: s(405) }}
          resizeMode="contain"
        />

        <Image source={require('../assets/vector-19.png')} style={{ position: 'absolute', top: s(260), left: s(134), width: s(112), height: s(115), tintColor: '#6b6b6b' }} resizeMode="contain" />

      </View>

      {/* STEMM LAB title */}
      <Text style={styles.title}>{'STEMM\nLAB'}</Text>

      {/* "Choose Your Role" section */}
      <Image
        source={require('../assets/vector-30.png')}
        style={styles.chooseTitleBg}
        resizeMode="contain"
      />
      <Text style={styles.chooseTitle}>Choose Your Role</Text>

      {/* Role options */}
      {roleOptions.map((role, index) => {
        const isSelected = selectedRole === role.id;

        return (
          <React.Fragment key={role.id}>
            <Image
              source={require('../assets/vector-22.png')}
              style={{
                position: 'absolute',
                top: role.wrapperTop - s(5),
                left: role.wrapperLeft - s(10),
                width: s(297),
                height: s(83),
              }}
              resizeMode="contain"
            />
            <TouchableOpacity
              style={[
                styles.roleWrapper,
                { top: role.wrapperTop, left: role.wrapperLeft },
              ]}
              onPress={() => setSelectedRole(role.id)}
              activeOpacity={0.7}
            />
            <Image
              source={role.imageSrc}
              style={{
                position: 'absolute',
                top: role.imageTop,
                left: role.imageLeft,
                width: s(83),
                height: s(83),
              }}
              resizeMode="cover"
            />
            <Text
              style={[
                styles.roleText,
                { top: role.textTop, left: role.textLeft },
                isSelected && styles.roleTextSelected,
              ]}
            >
              {role.label}
            </Text>
          </React.Fragment>
        );
      })}

      {/* CHOOSE button */}
      <TouchableOpacity style={styles.chooseButton} onPress={handleChoose} activeOpacity={0.8}>
        <Image source={require('../assets/vector-24.png')} style={styles.chooseButtonBg} resizeMode="contain" />
        <Text style={styles.chooseButtonText}>CHOOSE</Text>
      </TouchableOpacity>

      {/* Bottom bar */}
      <View style={styles.bottomBar} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgGray,
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: s(440),
    height: s(956),
  },
  planetWrapper: {
    position: 'absolute',
    top: s(251),
    left: s(4),
    width: s(447),
    height: s(423),
  },

  title: {
    position: 'absolute',
    top: s(77),
    left: s(106),
    fontFamily: FONTS.title,
    fontSize: s(64),
    color: COLORS.darkText,
    textAlign: 'center',
  },

  chooseTitleBg: {
    position: 'absolute',
    top: s(316),
    left: s(55),
    width: s(330),
    height: s(50),
  },
  chooseTitle: {
    position: 'absolute',
    top: s(328),
    left: s(83),
    fontFamily: FONTS.heading,
    fontSize: s(26),
    color: COLORS.darkText,
    letterSpacing: s(4.16),
  },
  roleWrapper: {
    position: 'absolute',
    width: s(277),
    height: s(73),
  },

  roleText: {
    position: 'absolute',
    fontFamily: FONTS.heading,
    fontSize: s(24),
    color: COLORS.darkText,
    letterSpacing: s(3.84),
  },
  roleTextSelected: {
    textDecorationLine: 'underline',
  },
  chooseButton: {
    position: 'absolute',
    top: s(577),
    left: s(155),
    width: s(130),
    height: s(41),
  },
  chooseButtonBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: s(130),
    height: s(41),
  },
  chooseButtonText: {
    position: 'absolute',
    top: s(11),
    left: s(31),
    fontFamily: FONTS.title,
    fontSize: s(16),
    color: COLORS.bodyText,
  },
  bottomBar: {
    position: 'absolute',
    top: s(939),
    left: s(117),
    width: s(206),
    height: s(8),
    backgroundColor: COLORS.white,
    borderRadius: 4,
  },
});

export default RegisterRoleScreen;
