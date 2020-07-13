import React, { Component } from 'react';
import { Text, TextInput, View, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, FlatList, Image } from 'react-native';


const styles = StyleSheet.create({

  container: {
    backgroundColor: '#E8EAF6',
    flex: 1
  },

  homeLabel: {
    fontSize: 40,
    padding: 10
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

  name: {
    fontSize: 10,
    fontWeight: 'bold',
  },

  chitContent: {
    fontSize: 15,
    marginTop: 10,
  },

  newChitButton: {
    alignItems: 'center',
    alignSelf: 'flex-end',
    backgroundColor: '#d5f4e6',
    padding: 10,
    marginTop: -50,
    width: 100,
    borderRadius: 10
  },

  chitImage: {
    width: 150,
    height: 150,
    marginTop: 10,
    alignSelf: 'center'
  }
});


class homeScreen extends Component {
 constructor(props){
 super(props);

 this.state ={
   isLoading: true,
   chitsFromFollowingData: [],
   chitImage: null,
   refreshing: false
 };

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

static navigationOptions = {
  headerShown: false
}


newChit = () => {
  this.props.navigation.navigate('NewChit')
}


//Code to get the chits from the users that the
//logged in user is following
getData(){
  return fetch('http://10.0.2.2:3333/api/v0.0.5/chits?start=0&count=50', {
    method: 'GET',
    headers: {
      'X-Authorization': global.token,
    }
  })
   .then((response) => response.json())
   .then((responseJson) => {
     this.setState({
       isLoading: false,
       chitsFromFollowingData: responseJson,
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
    chitsFromFollowingData: this.state.chitsFromFollowingData
  }, () => {
    this.getData();
  })
}




componentDidMount(){
  this.getData();
}




  render() {
    if(this.state.isLoading){
      return(
        <View>
         <ActivityIndicator/>
        </View>
       )
    }

  return (
     <View style={styles.container}>

     <Text style={styles.homeLabel}>Home</Text>

     <TouchableOpacity
      style={styles.newChitButton}
      onPress={this.newChit}
      >
        <Text>New chit</Text>
     </TouchableOpacity>

       <FlatList
         style={styles.flatList}
         data={this.state.chitsFromFollowingData}
         ItemSeparatorComponent = { this.FlatListItemSeparator}
         keyExtractor={(item, index) => index.toString()}
         refreshing={this.state.refreshing}
         onRefresh={this.handleRefresh}
         renderItem={({item, index}) => (
         <TouchableOpacity style={styles.row} onPress={() => this.props.navigation.navigate('ViewChit', {item})}>
         <View>
           <Text style={styles.name}>{item.user.given_name} {item.user.family_name}</Text>
           <Text style={styles.chitContent}>{item.chit_content}</Text>
         </View>
         </TouchableOpacity>

        )}
       />
     </View>
   );
 }
}


export default homeScreen
