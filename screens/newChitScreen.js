import React, { Component } from 'react';
import { Text, TextInput, View, Alert, TouchableOpacity, StyleSheet, ActivityIndicator, FlatList, PermissionsAndroid, Image } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import ImagePicker from "react-native-image-picker";
import AsyncStorage from '@react-native-community/async-storage';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#E8EAF6',
    flex: 1
  },

  chitInput: {
    borderWidth: 1,
    borderColor: '#777',
    padding: 8,
    margin: 10,
    height: 100,
    textAlignVertical: "top",
  },

  locationButton: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#337ab7',
    padding: 10,
    marginLeft: 10,
    width: 75,
    height: 50,
    borderRadius: 10
  },

  chitButton: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#d5f4e6',
    padding: 10,
    marginTop: -50,
    marginLeft: 100,
    width: 75,
    height: 50,
    borderRadius: 10
  },

  draftButton: {
    alignItems: 'center',
    alignSelf: 'flex-end',
    backgroundColor: '#f0ad4e',
    padding: 10,
    marginTop: -50,
    marginRight: 120,
    width: 100,
    height: 50,
    borderRadius: 10
  },

  displayDraftButton: {
    alignItems: 'center',
    alignSelf: 'flex-end',
    backgroundColor: '#f0ad4e',
    padding: 10,
    marginTop: 50,
    marginRight: 120,
    width: 100,
    height: 50,
    borderRadius: 10
  },

  addImageButton: {
    alignItems: 'center',
    alignSelf: 'flex-end',
    backgroundColor: '#5bc0de',
    padding: 10,
    marginTop: -150,
    marginRight: 10,
    width: 100,
    height: 50,
    borderRadius: 10
  },


  chitImage: {
    width: 150,
    height: 150,
    marginTop: 50,
    alignSelf: 'center'
  }


});

class newChitScreen extends Component {
 constructor(props){
 super(props);
 //Get the current time in milliseconds
 const timestamp = new Date().getTime();

 this.state ={
   isLoading: true,
   chit_id: 0,
   timestamp: timestamp,
   chitInput: '',
   longitude: 0,
   latitude: 0,
   user_id: global.id,
   userGivenName: '',
   userFamilyName: '',
   userEmail: '',
   location: null,
   locationPermission: false,
   chitImage: null,
   drafts: []
 };
}



//Get user details as the POST/chits endpoint
//requires user details in the body
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
       });
     })
     .catch((error) => {
       console.log(error);
       });
}




//A method to get permission from the user to
//access their location.
requestLocationPermission = async() => {
  try{
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Chittr Location Permission',
        message: 'This app requires to access your location.',
        buttonNeutral: 'Ask me later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    if(granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('You can access location');
      return true;
    } else {
      console.log('Location permission denied');
      return false;
    }
  } catch (err) {
    console.warn(err);
  }
}




//When the user grants permission to the app
//to access its location, this method is called
findCoordinates = () => {
  if(!this.state.locationPermission){
    this.state.locationPermission = this.requestLocationPermission();
  }
  Geolocation.getCurrentPosition(
    (position) => {
      //Get the location and then convert it
      //into JSON format. We can then set the
      //longitude and latitude of the device
      //to the JSON response
      const location = JSON.stringify(position);
      const locationJSON = JSON.parse(location)
      this.setState({
      location,
      longitude: locationJSON.coords.longitude,
      latitude: locationJSON.coords.latitude });
      console.log(this.state.longitude + ' ' + this.state.latitude);
    },
    (error) => {
      Alert.alert(error.message)
    },
    {
      enableHighAccuracy: true,
      timeout: 20000,
      maximumAge: 1000
    }
  );
};


// sets the text value in the state
handleChitInput = (chitInput) => {
  this.setState({chitInput: chitInput})
}





//Opens the image picker library so a user
//can choose a photo to upload to a chit
handleChoosePhoto = () => {
  const options = {
    noData: true
  };
  ImagePicker.launchImageLibrary(options, response => {
    console.log("response", response);
    if (response.uri) {
      this.setState({
        chitImage: response });
    }
  })
}



//Method to upload a photo to a chit, using the chit_id
//as a paramater, which will be fed into the fetch request
//URL
uploadChitPhoto(chit_id) {
  return fetch("http://10.0.2.2:3333/api/v0.0.5/chits/" + chit_id + "/photo",
   {
     method: 'POST',
     headers: {
       'X-Authorization': global.token
     },
     //send the entire image object to the server
     body: this.state.chitImage
     })
  .then((response) => {
  })
  .catch((error) => {
    Alert.alert("Error uploading image! Try again.")
  });
}





//Method to upload a chit
chit = () => {
  return fetch("http://10.0.2.2:3333/api/v0.0.5/chits",
   {
     method: 'POST',
     headers: {
       'Content-Type' : 'application/json',
       'X-Authorization': global.token
     },
     body: JSON.stringify({
       chit_id: 0,
       //setting the value of timestamp to the
       //timestamp state object created earlier
       timestamp: this.state.timestamp,
       chit_content: this.state.chitInput,
       //setting the longitude and latitude
       //inside the location object
       location: {
         longitude: this.state.longitude,
         latitude: this.state.latitude,
       },
       user: {
         user_id: this.state.user_id,
         given_name: this.state.userGivenName,
         family_name: this.state.userFamilyName,
         email: this.state.userEmail
       },
     })
  })
  .then((response) => {
    return response.json();
  })
  .then((responseJson) => {
    console.log(responseJson);

    //If the image exists i.e. the user has chosen
    //an image to upload, call the uploadChitPhoto()
    //and send the image to the server
    if(this.state.chitImage != null) {
      this.uploadChitPhoto(responseJson.chit_id);
    }
    this.props.navigation.navigate('Home')
  })
  .catch((error) => {
    Alert.alert("Error! Try again.")
  });
}



saveDraft = () => {
  let draft = [{
    chit_content: this.state.chitInput,
    user: {
      user_id: global.id,
      given_name: this.state.userGivenName,
      family_name: this.state.userFamilyName,
      email: this.state.userEmail,
    }


  }]
    AsyncStorage.getItem('drafts')
      .then((drafts) => {
        const d = drafts ? JSON.parse(drafts) : [];
        d.push(draft);
        AsyncStorage.setItem('drafts', JSON.stringify(d));
      });
  }



displayDraft = () => {
  this.props.navigation.navigate('Drafts');
}

editDraft() {
  this.state.chitInput = this.props.navigation.getParam('chitContentCallback')
}

componentDidMount(){
  this.getUserData();
  this.editDraft();
}





 render() {
   const { chitImage } = this.state;
 return (
    <View style={styles.container}>
    <TextInput
      style={styles.chitInput}
      placeholder='Post a chit'
      maxLength = {141}
      blurOnSubmit = {true}
      multiline={true}
      onChangeText={this.handleChitInput} value={this.state.chitInput}/>

      <TouchableOpacity
       style={styles.locationButton}
       onPress={this.findCoordinates}
       >
         <Text>Set Location</Text>
      </TouchableOpacity>

      <TouchableOpacity
       style={styles.chitButton}
       onPress={this.chit}
       >
         <Text>Chit!</Text>
      </TouchableOpacity>

      <TouchableOpacity
       style={styles.draftButton}
       onPress={this.saveDraft}
       >
         <Text>Save as Draft</Text>
      </TouchableOpacity>

      <TouchableOpacity
       style={styles.displayDraftButton}
       onPress={this.displayDraft}
       >
         <Text>View Drafts</Text>
      </TouchableOpacity>

      <TouchableOpacity
       style={styles.addImageButton}
       onPress={this.handleChoosePhoto}
       >
         <Text>Add image</Text>
      </TouchableOpacity>

      {chitImage && (
        <Image
          style={styles.chitImage}
          source={{ uri: chitImage.uri }}
        />
      )}


    </View>
  );
}


}





export default newChitScreen
