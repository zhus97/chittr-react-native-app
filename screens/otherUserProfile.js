import React, { Component } from 'react';
import { Text, TextInput, View, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, FlatList, Image } from 'react-native';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#E8EAF6',
    flex: 1
  },

  followButton: {
    alignItems: 'center',
    alignSelf: 'flex-end',
    backgroundColor: '#d5f4e6',
    padding: 10,
    marginTop: 10,
    width: 100
  },

  unfollowButton: {
    alignItems: 'center',
    alignSelf: 'flex-end',
    backgroundColor: 'red',
    padding: 10,
    marginTop: 10,
    width: 100
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
    marginTop: 20
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
    paddingVertical: 10,
    paddingHorizontal: 15,
    flexDirection: 'row',
    flexWrap: 'wrap'
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




class otherUserProfile extends Component {
   constructor(props){
   super(props);

   this.state ={
     isLoading: true,
     token: '',
     photo: null,
     //set the userId to the paramater that was passed from the following screen
     userId: this.props.navigation.getParam('user_id'),
     userGivenName: '',
     userFamilyName: '',
     userEmail: '',
     userPassword: '',
     userRecentChits: [],
     userFollowers: [],
     userFollowing: [],
     buttonText: 'Follow',
     refreshing: false
   };

  }

  getUserProfilePhoto(){
    return fetch('http://10.0.2.2:3333/api/v0.0.5/user/' + this.props.navigation.getParam('user_id') + "/photo", {
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


  //Code to get data of a user the logged in user has clicked on
  getUserData(){
    return fetch('http://10.0.2.2:3333/api/v0.0.5/user/' + this.props.navigation.getParam('user_id'), {
      method: 'GET',
      headers: {
        'X-Authorization': global.token
      }
    })
     .then((response) => response.json())
     .then((responseJson) => {
       this.setState({
         user: JSON.stringify({
           userGivenName: responseJson.given_name,
           userFamilyName: responseJson.family_name,
           userEmail: responseJson.email,
           userRecentChits: responseJson.recent_chits,
           refreshing: false
         }),
         isLoading: false,
         userGivenName: responseJson.given_name,
         userFamilyName: responseJson.family_name,
         userEmail: responseJson.email,
         userRecentChits: responseJson.recent_chits,
         });
       })
       .catch((error) => {
         console.log(error);
         });
  }






  //code to get the followers of a user the logged in user has clicked on
  getUserFollowers(){
    return fetch('http://10.0.2.2:3333/api/v0.0.5/user/' + this.props.navigation.getParam('user_id') + '/followers', {
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
         console.log(this.state.userFollowers);
         //Check if the logged in user is following the viewed user.
         //This is done by checking if the logged in user is inside the
         //followers array of the viewed user. If this is true, set the
         //text of the button to 'Unfollow'.
         const check = userInFollowersList => userInFollowersList.user_id === global.id;
         if(this.state.userFollowers.some(check)){
           this.setState({
             buttonText: 'Unfollow'
           })
         }

       })
       .catch((error) => {
         console.log(error);
         });
  }








//Code to get the list of users the viewed user is following
  getUserFollowing(){
    return fetch('http://10.0.2.2:3333/api/v0.0.5/user/' + this.props.navigation.getParam('user_id') + '/following', {
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








//Code to either follow or unfollow a person. This is done by
//checking what the text state of the button is. If the text is
//'Follow', then run the code that will make the logged in user
//follow the viewed user. If vice versa, then make the logged in user
//unfollow the viewed user.
  followOrUnfollowUser = () => {
    if(this.state.buttonText === 'Follow') {
      return fetch("http://10.0.2.2:3333/api/v0.0.5/user/" + this.props.navigation.getParam('user_id') + "/follow",
       {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json',
           'X-Authorization': global.token
         }
      })
         .then((response) => {
           Alert.alert('User Followed!')
         })
         .catch((error) => {
           console.log(error);
           Alert.alert("Error")
         });
    } else {
      return fetch("http://10.0.2.2:3333/api/v0.0.5/user/" + this.props.navigation.getParam('user_id') + "/follow",
       {
         method: 'DELETE',
         headers: {
           'Content-Type': 'application/json',
           'X-Authorization': global.token
         }
      })
         .then((response) => {
           Alert.alert('User unfollowed!')
           this.setState({
             buttonText: 'Follow'
           })
         })
         .catch((error) => {
           console.log(error);
           Alert.alert("Error")
         });
    }
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
    this.getUserProfilePhoto();
    this.getUserData();
    this.getUserFollowers();
    this.getUserFollowing();
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
        style={styles.followButton}
        onPress={this.followOrUnfollowUser}
        >
          <Text>{this.state.buttonText}</Text>
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
          onPress={() => this.props.navigation.navigate('OtherUserFollowing', {userIdCallback: this.state.userId})}
          >Following {this.state.userFollowing.length}</Text>


          <Text
          style={styles.followers}
          onPress={() => this.props.navigation.navigate('OtherUserFollowers', {userIdCallback: this.state.userId})}
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



export default otherUserProfile;
