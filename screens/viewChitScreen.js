import React, { Component } from 'react';
import { Text, TextInput, View, Alert, TouchableOpacity, StyleSheet, ActivityIndicator, FlatList, PermissionsAndroid, Image } from 'react-native';


const styles = StyleSheet.create({
  container: {
    backgroundColor: '#E8EAF6',
    flex: 1
  },

  profilePicture: {
    borderRadius: 50,
    width: 80,
    height: 80,
    marginTop: 50,
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

  chitContent: {
    textAlign: 'center',
    fontSize: 20,
    marginTop: 20
  },

  chitPhoto: {
    width: 200,
    height: 200,
    marginTop: 50,
    alignSelf: 'center'
  }

});

//This screen is loaded when the user clicks on a chit in
//the home screen. This is done to provide a more detailed
//version of the chit that is displayed in the home screen
class viewChitScreen extends Component {
 constructor(props){
 super(props);

 this.state ={
   isLoading: true,
   token: '',
   profilePhoto: null,
   chitPhoto: null,
   //the item refers to the entire chit object that was clicked on
   item: this.props.navigation.getParam('item'),
   userGivenName: '',
   userFamilyName: '',
   userEmail: '',
   viewedChit: '',
 };
}


//Get a users profile photo by feeding in the item object that was passed into
//this screen from the home screen. We can access the item's properties this way
getUserProfilePhoto(){
  return fetch('http://10.0.2.2:3333/api/v0.0.5/user/' + this.state.item.user.user_id + "/photo", {
    method: 'GET',
    headers: {
      'X-Authorization': global.token
    }
  })
  .then((response) => {
    this.setState({
      profilePhoto: response
    })
  })
  .catch((error) => {
    Alert.alert("Error getting profile picture! Try again.")
  });
}




//Get the relevant user data we need such as full name and email address. We pass in
//the same variable as the function above
getUserData(){
  return fetch('http://10.0.2.2:3333/api/v0.0.5/user/' + this.state.item.user.user_id, {
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
       }),
       isLoading: false,
       userGivenName: responseJson.given_name,
       userFamilyName: responseJson.family_name,
       userEmail: responseJson.email
       });
     })
     .catch((error) => {
       console.log(error);
       });
}


//Get the image associated with the chit the user clicked on, using the chit_id
//variable
getChitImage(chit_id){
  return fetch('http://10.0.2.2:3333/api/v0.0.5/chits/' + chit_id + "/photo", {
    method: 'GET',
    headers: {
      'X-Authorization': global.token
    }
  })
  .then((response) => {
    this.setState({
      chitPhoto: response
    })
  })
  .catch((error) => {
    Alert.alert("Error getting chit images! Try again.")
  });
}




componentDidMount(){
  this.getUserData();
  this.getUserProfilePhoto();
  //pass in the chit_id variable using the item object that was passed into this
  //screen from the home screen
  this.getChitImage(this.state.item.chit_id);
}





 render() {
   const { profilePhoto } = this.state;
   const { chitPhoto } = this.state;
   if(this.state.isLoading){
     return(
       <View>
        <ActivityIndicator/>
       </View>
      )
   }
 return (
    <View style={styles.container}>
    {profilePhoto && (
      <Image
        style={styles.profilePicture}
        source={{ uri: profilePhoto.url }}
      />
    )}

    <Text
    style={styles.fullName}
    >{this.state.userGivenName} {this.state.userFamilyName}</Text>

    <Text
     style={styles.email}
     >{this.state.userEmail}</Text>

     <Text
      style={styles.chitContent}
      >{this.state.item.chit_content}</Text>

      {chitPhoto && (
        <Image
          style={styles.chitPhoto}
          source={{ uri: chitPhoto.url }}
        />
      )}

    </View>


  );
}


}





export default viewChitScreen
