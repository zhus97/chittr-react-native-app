import React, { Component } from 'react';
import { Text, TextInput, View, Image, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, FlatList } from 'react-native';
import ImagePicker from "react-native-image-picker";

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#E8EAF6',
    flex: 1
  },

  choosePhotoButton: {
    backgroundColor: '#d5f4e6',
    alignItems: 'center',
    width: 200,
    padding: 10,
    marginTop: 50,
    alignSelf: 'center',
    borderRadius: 10
  },

  profilePicture: {
    borderRadius: 50,
    width: 150,
    height: 150,
    marginTop: 50,
    alignSelf: 'center'
  },

  doneButton: {
    backgroundColor: '#d5f4e6',
    alignItems: 'center',
    alignSelf: 'flex-start',
    width: 200,
    padding: 10,
    marginTop: 50,
    alignSelf: 'center',
    borderRadius: 10
  }

})



//This screen is loaded when a user first creates an account
class uploadProfilePhoto extends Component {
   constructor(props){
   super(props);

   this.state ={
     token: '',
     photo: null,
   };

  }


//This launches the image picker library when a user chooses to upload a
//profile photo
  handleChoosePhoto = () => {
    const options = {
      noData: true
    };
    ImagePicker.launchImageLibrary(options, response => {
      console.log("response", response);
      if (response.uri) {
        this.setState({
          photo: response });
      }
    })
  }



//Code to upload the profile picture
  uploadProfilePicture = () => {
    return fetch("http://10.0.2.2:3333/api/v0.0.5/user/photo",
     {
       method: 'POST',
       headers: {
         'X-Authorization': global.token
       },
       //Send the entire photo to the server
       body: this.state.photo
       })
    .then((response) => {
      console.log(response);
      this.props.navigation.navigate('Home')
    })
    .catch((error) => {
      Alert.alert("Error creating account! Try again.")
    });
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
          style={styles.choosePhotoButton}
          onPress={this.handleChoosePhoto}
          >
            <Text>Choose Profile Picture</Text>
         </TouchableOpacity>

         {photo && (
           <Image
             style={styles.profilePicture}
             source={{ uri: photo.uri }}
           />
         )}

         <TouchableOpacity
          style={styles.doneButton}
          onPress={this.uploadProfilePicture}
          >
            <Text>Done</Text>
         </TouchableOpacity>
       </View>
      );
    }

}



export default uploadProfilePhoto;
