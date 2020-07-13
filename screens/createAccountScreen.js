import React, { Component } from 'react';
import { Text, TextInput, View, TouchableOpacity, StyleSheet, Alert } from 'react-native';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#E8EAF6',
    flex: 1
  },

  labels: {
    padding: 8,
    marginTop: 30,
    alignSelf: 'center'
  },

  inputName: {
    borderWidth: 1,
    borderColor: '#777',
    padding: 8,
    margin: 5,
    width: 200,
    alignSelf: 'center',
    borderRadius: 10
  },

  inputSurname: {
    borderWidth: 1,
    borderColor: '#777',
    padding: 8,
    margin: 5,
    width: 200,
    alignSelf: 'center',
    borderRadius: 10
  },

  inputEmail: {
    borderWidth: 1,
    borderColor: '#777',
    padding: 8,
    margin: 5,
    width: 200,
    alignSelf: 'center',
    borderRadius: 10
  },

  inputPassword: {
    borderWidth: 1,
    borderColor: '#777',
    padding: 8,
    margin: 5,
    width: 200,
    alignSelf: 'center',
    borderRadius: 10
  },

  createAccountButton: {
    backgroundColor: '#d5f4e6',
    alignItems: 'center',
    alignSelf: 'flex-start',
    width: 200,
    padding: 10,
    marginTop: 50,
    alignSelf: 'center',
    borderRadius: 10
  }
});



class loginScreen extends Component {
 constructor(props){
 super(props);

 this.state={
   id: '',
   token: '',
   photo: null,
   photoPath: '',
   given_name: '',
   family_name: '',
   email: '',
   password: ''
  };
 }



//Code that opens the image picker library
handleChoosePhoto = () => {
  const options = {
    noData: true
  };
  ImagePicker.launchImageLibrary(options, response => {
    console.log("response", response);

    //When user chooses image, set the state
    //of the photo to the response
    if (response.uri) {
      this.setState({
        photo: response,
        photoPath: response.path });
    }
    console.log(this.state.photoPath);
  })
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



//Code to log a user in
 login = () => {
   return fetch("http://10.0.2.2:3333/api/v0.0.5/login",
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: this.state.email,
        password: this.state.password
      })
   })
   .then((response) => {
     return response.json();
   })
   //Set the state values as the JSON equivalent, and then set
   //these values as the values in the global folder to be used
   //in all screens at any time
   .then((responseJson) => {
     this.setState({
       id: responseJson.id,
       token: responseJson.token,
       });
       global.id = this.state.id;
       global.token = this.state.token;
   })

   //If there's an error, send the user to the
   //login screen
   .catch((error) => {
     if (error) {
       this.props.navigation.navigate('Login')
       Alert.alert("Incorrect details! Try again.")
     }

   });
 }


//Code to create an account
createAccount = () => {
  return fetch("http://10.0.2.2:3333/api/v0.0.5/user",
   {
     method: 'POST',
     headers: {
       'Content-Type': 'application/json',
     },
     body: JSON.stringify({
       given_name: this.state.given_name,
       family_name: this.state.family_name,
       email: this.state.email,
       password: this.state.password
     })
  })

  //When the user has successfully created an account
  //run the login() function and navigate to the
  //uploadProfilePhoto screen. This is so that the
  //user can access the token to upload a
  //profile photo
  .then((response) => {
    this.login();
    this.props.navigation.navigate('uploadProfilePhoto')
  })


  .catch((error) => {
    Alert.alert("Error creating account! Try again.")
    console.log(error);
  });
}






 render() {
 return (
    <View style={styles.container}>
      <Text style={styles.labels}>Name:</Text>
      <TextInput
        style={styles.inputName}
        onChangeText={this.handleGivenNameInput} value={this.state.given_name}/>

      <Text style={styles.labels}>Surname:</Text>
      <TextInput
        style={styles.inputSurname}
        onChangeText={this.handleFamilyNameInput} value={this.state.family_name}/>

      <Text style={styles.labels}>Email:</Text>
      <TextInput
        style={styles.inputEmail}
        placeholder='e.g. zameel@hotmail.co.uk'
        onChangeText={this.handleEmailInput} value={this.state.email}/>

      <Text style={styles.labels}>Password:</Text>
      <TextInput
       style={styles.inputPassword}
       placeholder='Any character'
       onChangeText={this.handlePasswordInput} value={this.state.password}
       secureTextEntry={true}/>

       <TouchableOpacity
        style={styles.createAccountButton}
        onPress={this.createAccount}
        >
          <Text>Create Account</Text>
       </TouchableOpacity>


    </View>
   );
 }

}



export default loginScreen
