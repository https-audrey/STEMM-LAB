import React, { useState } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ImageBackground,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';

type Nav = StackNavigationProp<RootStackParamList, 'RegisterRole'>;

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');
const wp = (percent: number) => (SCREEN_W * percent) / 100;
const hp = (percent: number) => (SCREEN_H * percent) / 100;

const RegisterRoleScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const [selectedRole, setSelectedRole] = useState<'teacher' | 'student' | null>(null);

  const handleChoose = () => {
    if (selectedRole) {
      navigation.navigate('RegisterInfo', { role: selectedRole });
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../assets/OnBoardingAssets/bgImg.png')}
        style={styles.background}
        resizeMode="cover"
      >
        {/* STEMM LAB title logo (like LoginScreen) */}
        <Image
          source={require('../assets/OnBoardingAssets/STEMMLAB.png')}
          style={styles.titleLogo}
          resizeMode="contain"
        />

        {/* ── METEOR 1 ── Role Selection Form */}
        <View style={styles.meteorContainer}>
          <Image
            source={require('../assets/LoginAssets/meteor1.png')}
            style={styles.meteorBg}
            resizeMode="contain"
          />

          {/* Content inside the meteor */}
          <View style={styles.meteorInner}>
            {/* Choose Your Role Title */}
            <Image
              source={require('../assets/ChooseRoleAssets/choose your role.png')}
              style={styles.chooseTitleImage}
              resizeMode="contain"
            />

            {/* Teacher Button (Interactive Toggle) */}
            <TouchableOpacity
              style={styles.roleButton}
              onPress={() => setSelectedRole('teacher')}
              activeOpacity={0.8}
            >
              <Image
                source={
                  selectedRole === 'teacher'
                    ? require('../assets/ChooseRoleAssets/teacher2.png')
                    : require('../assets/ChooseRoleAssets/teacher.png')
                }
                style={styles.fullImage}
                resizeMode="contain"
              />
            </TouchableOpacity>

            {/* Student Button (Interactive Toggle) */}
            <TouchableOpacity
              style={styles.roleButton}
              onPress={() => setSelectedRole('student')}
              activeOpacity={0.8}
            >
              <Image
                source={
                  selectedRole === 'student'
                    ? require('../assets/ChooseRoleAssets/student2.png')
                    : require('../assets/ChooseRoleAssets/student.png')
                }
                style={styles.fullImage}
                resizeMode="contain"
              />
            </TouchableOpacity>

            {/* Choose Button */}
            <TouchableOpacity
              style={styles.chooseButton}
              onPress={handleChoose}
              activeOpacity={0.8}
            >
              <Image
                source={require('../assets/ChooseRoleAssets/chooseBtn.png')}
                style={styles.fullImage}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#08121E',
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
  },

  /* ── Title logo (same as LoginScreen) ── */
  titleLogo: {
    width: wp(55),
    height: hp(15),
    marginTop: hp(9),
  },

  /* ── Meteor layout (same container style as LoginScreen) ── */
  meteorContainer: {
    width: wp(112),
    height: hp(70),
    marginTop: hp(-3),
    alignSelf: 'center',
    left: 6,
  },
  meteorBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  meteorInner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: wp(14),
    paddingTop: hp(4),
    paddingBottom: hp(5),
    gap: hp(1.2),
  },

  /* ── Custom Choose Role Assets ── */
  chooseTitleImage: {
    width: wp(65),
    height: hp(6),
    marginBottom: hp(1),
    marginTop: hp(2)
  },
  roleButton: {
    width: wp(62),
    height: hp(8.5),
  },
  chooseButton: {
    width: wp(35),
    height: hp(5),
    marginTop: hp(2),
  },
  fullImage: {
    width: '100%',
    height: '100%',
  },
});

export default RegisterRoleScreen;
