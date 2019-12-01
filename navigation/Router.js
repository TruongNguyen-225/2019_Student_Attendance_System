import {
  createStackNavigator,
  createAppContainer,
  createDrawerNavigator,
  createBottomTabNavigator,
  DrawerNavigator,
  createSwitchNavigator,
} from 'react-navigation';
import {Dimensions,Image} from 'react-native';
import React from 'react';

const {width: WIDTH} = Dimensions.get ('window');
const {height: HEIGHT} = Dimensions.get ('window');

import home from '../assets/icons/icons8-home-page-90.png';
import user from '../assets/icons/icons8-user-menu-male-100.png';
import iconsClass from '../assets/icons/icons8-numbered-list-100.png';

import HomeScreen from '../screens/Home/HomeScreen';
// import CheckWelcome from '../screens/Home/CheckWelcome';

// AUTHENTICATION
import SignUp from '../screens/HandleAuthentication/SignUp';
import LogIn from '../screens/HandleAuthentication/LogIn';
import Loading from '../screens/HandleAuthentication/Loading';

//HANDLE CLASS
import CreateClass from '../screens/Class/CreateClass';
import Attendance from '../screens/Class/Attendance';
import Detail_Class from '../screens/Class/Detail_Class';
import FollowClass from '../screens/Class/FollowClass';
import ListClass from '../screens/Class/ListClass';
import Main from '../screens/HandleAuthentication/Main';

import Class_Joined from '../screens/Student_Attendance/Class_Joined';
import List_Attendanced from '../screens/Student_Attendance/List_Attendanced';
import QrCode_Attendance from '../screens/Student_Attendance/QrCode_Attendance';
import List_Day_Attendance from '../screens/Student_Attendance/List_Day_Attendance';

import Update_Manage_Class from '../screens/Class/Update_Manage_Class';
import ShowStudentJoin from '../screens/Class/ShowStudentJoin';

// SEARCH
import SearchScreen from '../screens/Search/SearchScreen';

//HANDLE RECOGNITION
import Camera from '../screens/Class/Attendance_handle/Camera';
import Screen_Handle from '../screens/Class/Attendance_handle/Screen_Handle';
 
//HANDLE INFORMATION
import Update_Info from '../screens/Update/Update_Info';
import OpenDrawer from '../screens/Header/OpenDrawer';

// STUDENT 
import QrCode_Join_Class  from '../screens/Student_Attendance/QrCode_Join_Class';
// import OpenDrawer from '../screens/Home/HomeScreen';
export const AuthenticationStack = createStackNavigator (
  {
    LogIn,
    SignUp,
  },
  {
    initialRouteName: 'LogIn',
  }
);

export const RootStack = createStackNavigator (
  {
    HomeScreen,
    Update_Manage_Class,
    SearchScreen,
    CreateClass,
    Detail_Class,
    FollowClass,
    ListClass,
    Attendance,
    Screen_Handle,
    Camera,
    Main,
    Update_Info,
    ShowStudentJoin,
    /* START  */
    QrCode_Join_Class,
    Class_Joined,
    List_Attendanced,
    QrCode_Attendance,
    List_Day_Attendance,
  },
  {
    initialRouteName: 'HomeScreen',
  }
);
export const StackLoading = createSwitchNavigator (
  {
    Loading: Loading,
    AuthenticationStack,
    RootStack,
  },
  {
    initialRouteName: 'Loading',
  }
);
// export const StackManageClass = createStackNavigator (
//   {
//     CreateClass,
//     Detail_Class,
//     FollowClass,
//     ListClass,
//     Attendance,
//     Screen_Handle,
//     Camera,
//     OpenDrawer,
    
    
//   },
//   {
//     // initialRouteName: 'HomeScreen',
//   }
// );
export const StackManageInfo = createStackNavigator (
  {
    Main,
    Update_Info,
    Update_Manage_Class,
    // HomeScreen,
  
  },
  {
    // initialRouteName: 'HomeScreen',
  }
);
export const StackSearch = createStackNavigator ({
  SearchScreen,
});

export const StackSearchBig = createSwitchNavigator ({
  RootStack,
  // StackManageClass,
  StackSearch,
  // StackManageInfo,
  
});
let routeConfig = {
  'Trang Chủ': {
    screen: RootStack,
    navigationOptions: {drawerIcon: <Image 
			source = {home}
			style = {{ width: 26, height: 26, tintColor:'blue'}}>
	   </Image>  }
  },
  'Quản Lý Tài Khoản': {
    screen: StackManageInfo,
    navigationOptions: { drawerIcon: <Image 
    source = {user}
    style = {{ width: 26, height: 26, tintColor:'blue'}}>
   </Image>  }
  },
  'Quản Lý Lớp Học': {
    screen: Update_Manage_Class,
    navigationOptions: { drawerIcon: <Image 
      source = {iconsClass}
      style = {{ width: 26, height: 26, tintColor:'blue'}}>
     </Image>  }
  },
};
let drawerNavConfig = {
  unmountInactiveRoutes: true,
  //drawerWidth : screenWidth /2,
  drawerPosition: 'left',
  contentOptions: {
    activeTintColor: 'crimson',
  },
  //order: [Welcome, Login, TrangChu, UpLoadImg, Basic, Todo, DBCom]
};
const drawera = createDrawerNavigator (routeConfig, drawerNavConfig);
//----------------Switch Navigation----------------------------------------
const SwithNav = createSwitchNavigator (
  {
    Loading,
    Auth: AuthenticationStack,
    App: drawera,
    StackSearchBig,
    
  },
  {
    initialRouteName: 'Loading',
  }
);
export const AppContainer = createAppContainer (SwithNav);
