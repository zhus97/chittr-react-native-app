import React, { Component } from 'react';
import { Text, TextInput, View, Image, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, FlatList } from 'react-native';
import ImagePicker from "react-native-image-picker";

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#E8EAF6',
    flex: 1
  },

  logoutButton: {
    alignItems: 'center',
    alignSelf: 'flex-end',
    backgroundColor: 'red',
    padding: 10,
    width: 100,
    borderRadius: 10
  },

  editButton: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#d5f4e6',
    padding: 10,
    marginTop: -39,
    width: 100,
    borderRadius: 10
  },

  profilePicture: {
    borderRadius: 50,
    width: 80,
    height: 80,
    marginTop: 10,
    alignSelf: 'center'
  },

  fullName: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 40,
    marginTop: 10
  },

  email: {
    textAlign: 'center',
    fontSize: 12.5,
    marginTop: 5
  },

  flatList: {
    flex: 1
  },

  row: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 15,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  chitContent: {
    fontSize: 15,
  },

  followers: {
    textAlign: 'center',
    fontSize: 20,
    marginTop: -26,
    marginLeft: 220,
    alignSelf: 'baseline'
  },

  following: {
    textAlign: 'center',
    fontSize: 20,
    marginTop: 15 ,
    marginLeft: 70,
    alignSelf: 'baseline'
  }

})




class profileScreen extends Component {
   constructor(props){
   super(props);

   this.state ={
     isLoading: true,
     token: '',
     photo: null,
     userGivenName: '',
     userFamilyName: '',
     userEmail: '',
     userPassword: '',
     userRecentChits: [],
     userFollowers: [],
     userFollowing: [],
     refreshing: false
   };

  }





  logout = () => {
    return fetch("http://10.0.2.2:3333/api/v0.0.5/logout",
     {
       method: 'POST',
       headers: {
         'X-Authorization': global.token
       }
    })
    .then((response) => {
      this.props.navigation.navigate('Login')
    })
    .catch((error) => {
      console.log(error);
      Alert.alert("Unauthorized")
    });
  }


  edit = () => {
    this.props.navigation.navigate('Update')
  }






  getUserProfilePhoto(){
    return fetch('http://10.0.2.2:3333/api/v0.0.5/user/' + global.id + "/photo", {
      method: 'GET',
      headers: {
        'X-Authorization': global.token
      }
    })
    .then((response) => {
      console.log(response);
      this.setState({
        photo: response
      })
    })
    .catch((error) => {
      Alert.alert("Error getting profile picture! Try again.")
    });
  }





  getUserData(){
    return fetch('http://10.0.2.2:3333/api/v0.0.5/user/' + global.id, {
      method: 'GET',
      headers: {
        'X-Authorization': global.token
      }
    })
     .then((response) => response.json())
     .then((responseJson) => {
       this.setState({
         isLoading: false,
         userGivenName: responseJson.given_name,
         userFamilyName: responseJson.family_name,
         userEmail: responseJson.email,
         userRecentChits: responseJson.recent_chits,
         refreshing: false
         });
       })
       .catch((error) => {
         console.log(error);
         });
  }




  getUserFollowers(){
    return fetch('http://10.0.2.2:3333/api/v0.0.5/user/' + global.id + '/followers', {
      method: 'GET',
      headers: {
        'X-Authorization': global.token
      }
    })
     .then((response) => response.json())
     .then((responseJson) => {
       this.setState({
         isLoading: false,
         userFollowers: responseJson,
         refreshing: false
         });
       })
       .catch((error) => {
         console.log(error);
         });
  }




  getUserFollowing(){
    return fetch('http://10.0.2.2:3333/api/v0.0.5/user/' + global.id + '/following', {
      method: 'GET',
      headers: {
        'X-Authorization': global.token
      }
    })
     .then((response) => response.json())
     .then((responseJson) => {
       this.setState({
         isLoading: false,
         userFollowing: responseJson,
         refreshing: false
         });
       })
       .catch((error) => {
         console.log(error);
         });
  }

  //Function to refresh the flatlist after a chit has been added to it
  handleRefresh = () => {
    this.setState({
      refreshing: true,
      userRecentChits: this.state.userRecentChits,
      userFollowers: this.state.userFollowers,
      userFollowing: this.state.userFollowing,
    }, () => {
      this.getUserData();
      this.getUserFollowers();
      this.getUserFollowing();
    })
  }

  FlatListItemSeparator = () => {
    return(
      <View
        style={{
          height: 2,
          width: "100%",
          backgroundColor: 'white'
        }}
      />
    );
  }


  componentDidMount(){
    this.getUserData();
    this.getUserFollowers();
    this.getUserFollowing();
    this.getUserProfilePhoto();
  }


  render() {
    const { photo } = this.state;
    if(this.state.isLoading){
      return(
        <View>
         <ActivityIndicator/>
        </View>
       )
    }
    return (
       <View style={styles.container}>
         <TouchableOpacity
          style={styles.logoutButton}
          onPress={this.logout}
          >
            <Text>Log out</Text>
         </TouchableOpacity>

         <TouchableOpacity
          style={styles.editButton}
          onPress={this.edit}
          >
            <Text>Edit Profile</Text>
         </TouchableOpacity>

         {photo && (
           <Image
             style={styles.profilePicture}
             source={{ uri: photo.url }}
           />
         )}

         <Text
         style={styles.fullName}
         >{this.state.userGivenName} {this.state.userFamilyName}</Text>

         <Text
          style={styles.email}
          >{this.state.userEmail}</Text>

          <Text
          style={styles.following}
          onPress={() => this.props.navigation.navigate('Following')}
          >Following {this.state.userFollowing.length}</Text>


          <Text
          style={styles.followers}
          onPress={() => this.props.navigation.navigate('Followers')}
          >Followers {this.state.userFollowers.length}</Text>


          <FlatList
            style={styles.flatList}
            data={this.state.userRecentChits}
            keyExtractor={(item, index) => index.toString()}
            refreshing={this.state.refreshing}
            onRefresh={this.handleRefresh}
            ItemSeparatorComponent = { this.FlatListItemSeparator}
            renderItem={({item, index}) => (
            <TouchableOpacity style={styles.row}>
            <View>
              <Text style={styles.chitContent}>{item.chit_content}</Text>
            </View>
            </TouchableOpacity>
           )}
          />


       </View>
      );
    }

}



export default profileScreen;
