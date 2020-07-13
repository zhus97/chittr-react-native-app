import React, { Component } from 'react';
import { Text, TextInput, View, Button, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#E8EAF6',
    flex: 1
  },

  profilePicture: {
    borderRadius: 50,
    width: 80,
    height: 80,
    marginTop: 10,
    alignSelf: 'center'
  },

  labels: {
    padding: 8,
    alignSelf: 'center'
  },

  inputEmail: {
    borderWidth: 1,
    borderColor: '#777',
    padding: 8,
    margin: 10,
    width: 200,
    alignSelf: 'center',
    borderRadius: 10
  },

  inputPassword: {
    borderWidth: 1,
    borderColor: '#777',
    padding: 8,
    margin: 10,
    width: 200,
    alignSelf: 'center',
    borderRadius: 10
  },

  updateProfileButton: {
    backgroundColor: '#d5f4e6',
    alignItems: 'center',
    alignSelf: 'flex-start',
    width: 200,
    padding: 10,
    marginTop: 20,
    alignSelf: 'center',
    borderRadius: 10
  }

});



class updateProfileScreen extends Component {
 constructor(props){
 super(props);

 this.state={
   photo: null,
   newPhoto: null,
   given_name: '',
   family_name: '',
   email: '',
   password: ''
  };
 }


//Code to get the user's profile photo
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
     Alert.alert("Error creating account! Try again.")
   });
 }



//Code to get user data. This is done so that the text fields
//can be pre-loaded with what the user had previously entered.
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
       given_name: responseJson.given_name,
       family_name: responseJson.family_name,
       email: responseJson.email
       });
     })
     .catch((error) => {
       console.log(error);
       });
}


 // sets the text value in the state
 handleGivenNameInput = (given_name) => {
   this.setState({given_name: given_name})
 }

 handleFamilyNameInput = (family_name) => {
   this.setState({family_name: family_name})
 }

 handleEmailInput = (email) => {
   this.setState({email: email})
 }

 handlePasswordInput = (password) => {
   this.setState({password: password})
 }



//Code to update the user's profile.
updateProfile = () => {
  return fetch("http://10.0.2.2:3333/api/v0.0.5/user/" + global.id,
   {
     method: 'PATCH',
     headers: {
       'Content-type': 'application/json',
       'X-Authorization': global.token
     },
     body: JSON.stringify({
       given_name: this.state.given_name,
       family_name: this.state.family_name,
       email: this.state.email,
       password: this.state.password
     })
  })

  .then((response) => {
    Alert.alert("Profile updated successfully!");
  })
  .catch((error) => {
    Alert.alert("Error updating account! Try again.")
    console.log(error);
  });
}

componentDidMount(){
  this.getUserProfilePhoto();
  this.getUserData();
}




 render() {
   const { photo } = this.state;
 return (
    <View style={styles.container}>
    {photo && (
      <Image
        style={styles.profilePicture}
        source={{ uri: photo.url }}
      />
    )}
      <Text style={styles.labels}>Name:</Text>
      <TextInput
        style={styles.inputEmail}
        defaultValue={this.state.given_name}
        onChangeText={this.handleGivenNameInput} value={this.state.given_name}/>

      <Text style={styles.labels}>Surname:</Text>
      <TextInput
        style={styles.inputEmail}
        defaultValue={this.state.family_name}
        onChangeText={this.handleFamilyNameInput} value={this.state.family_name}/>

      <Text style={styles.labels}>Email:</Text>
      <TextInput
        style={styles.inputEmail}
        defaultValue={this.state.email}
        onChangeText={this.handleEmailInput} value={this.state.email}/>

      <Text style={styles.labels}>Password:</Text>
      <TextInput
       style={styles.inputPassword}
       onChangeText={this.handlePasswordInput} value={this.state.password}
       secureTextEntry={true}/>

       <TouchableOpacity
        style={styles.updateProfileButton}
        onPress={this.updateProfile}
        >
          <Text>Update Profile</Text>
       </TouchableOpacity>

    </View>
   );
 }

}



export default updateProfileScreen
