import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import loginScreen from './screens/loginScreen'
import createAccountScreen from './screens/createAccountScreen'
import homeScreen from './screens/homeScreen'
import profileScreen from './screens/profileScreen'
import followingScreen from './screens/followingScreen'
import followersScreen from './screens/followersScreen'
import updateProfileScreen from './screens/updateProfileScreen'
import otherUserProfile from './screens/otherUserProfile'
import otherUserFollowing from './screens/otherUserFollowing'
import otherUserFollowers from './screens/otherUserFollowers'
import searchScreen from './screens/searchScreen'
import newChitScreen from './screens/newChitScreen'
import uploadProfilePhoto from './screens/uploadProfilePhoto'
import viewChitScreen from './screens/viewChitScreen'
import displayDraftsScreen from './screens/displayDraftsScreen'
import './global'


//The stack for the creation of an account and logging in
const AppStackNav = createStackNavigator({
  Login: {
    screen: loginScreen,
    navigationOptions: {
      headerShown: false
    }
  },

  CreateAccount: {
    screen: createAccountScreen,
    navigationOptions: {
      headerShown: false
    },
  },

  uploadProfilePhoto: {
    screen: uploadProfilePhoto,
    navigationOptions: {
      headerShown: false
    },
  },
});


//Profile - Following stack
const AppStackNav2 = createStackNavigator({
  Following: {
    screen: followingScreen,
    navigationOptions: {
      headerShown: false
    },
  },
});

//Profile - OtherUser stack
const AppStackNav3 = createStackNavigator({
  otherUserProfile: {
    screen: otherUserProfile,
    navigationOptions: {
      headerShown: false
    },
  }
});



//Creating the 3 screens for the bottom navigation
const AppTabNav = createBottomTabNavigator({
  Home: {
    screen: homeScreen,
    navigationOptions: {
      headerShown: false
    },
  },

  Profile: {
    screen: profileScreen
  },

  Search: {
    screen: searchScreen
  }
});




//The main stack of the application
const MainAppStackNav = createStackNavigator({
  //This will be the first page that loads when app boots
  Login: {
    screen: AppStackNav,
    navigationOptions: {
      headerShown: false
    },
  },

  //This will be the first page that loads when the user has logged in
  Home: {
    screen: AppTabNav,
    navigationOptions: {
      headerShown: false
    },
  },

  ViewChit: {
    screen: viewChitScreen,
    navigationOptions: {
      headerShown: false
    },
  },

  Drafts: {
    screen: displayDraftsScreen,
    navigationOptions: {
      headerShown: false
    },
  },

  NewChit: {
    screen: newChitScreen,
    navigationOptions: {
      headerShown: false
    },
  },

  Search: {
    screen: AppTabNav,
    navigationOptions: {
      headerShown: false
    },
  },
  Profile: {
    screen: AppStackNav2,
    navigationOptions: {
      headerShown: false
    },
  },
  Followers: {
    screen: followersScreen,
    navigationOptions: {
      headerShown: false
    },
  },
  Update: {
    screen: updateProfileScreen,
    navigationOptions: {
      headerShown: false
    },
  },
  OtherUser: {
    screen: otherUserProfile,
    navigationOptions: {
      headerShown: false
    },
  },
  OtherUserFollowing: {
    screen: otherUserFollowing,
    navigationOptions: {
      headerShown: false
    },
  },
  OtherUserFollowers: {
    screen: otherUserFollowers,
    navigationOptions: {
      headerShown: false
    },
  },

}, {
  initialRouteName: 'Login'
});

const AppContainer = createAppContainer(MainAppStackNav)

export default AppContainer;
