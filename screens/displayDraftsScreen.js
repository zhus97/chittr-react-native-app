import React, { Component } from 'react';
import { Text, TextInput, View, Button, StyleSheet, Alert, ActivityIndicator, FlatList, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';


const styles = StyleSheet.create({
  container: {
    backgroundColor: '#E8EAF6',
    flex: 1
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
    fontSize: 15,
    fontWeight: 'bold',
  },

  editDraftButton: {
    alignItems: 'center',
    alignSelf: 'flex-end',
    backgroundColor: '#f0ad4e',
    padding: 10,
    marginTop: 0,
    marginRight: 20,
    width: 75,
    height: 40,
    borderRadius: 10
  },

  deleteDraftButton: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'red',
    padding: 10,
    marginTop: 30,
    marginRight: 100,
    width: 75,
    height: 40,
    borderRadius: 10
  },
});


class displayDraftsScreen extends Component {
 constructor(props){
 super(props);

 this.state ={
   isLoading: true,
   listOfFollowing: [],
   refreshing: false,
   drafts: null
 };

}

static navigationOptions = {
  headerShown: false
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

displayDraft = async () => {
  try {
    let draft = await AsyncStorage.getItem('drafts');
    let parsed = JSON.parse(draft);
    let filteredDrafts = parsed.filter((chit) => {
      return chit[0].user.user_id == global.id;
    });
    this.setState({
      drafts: filteredDrafts
    })

    console.log(filteredDrafts);
  }

  catch(error) {
    Alert.alert(error.message);
  }
}

deleteDraft = async (item) => {
  try{
    let draft = await AsyncStorage.getItem('drafts')
    let parsed = JSON.parse(draft);

    let filteredDraft = parsed.filter((chit) => {
      return chit[0].chit_content !== item[0].chit_content;
    });
    this.setState({
      drafts: filteredDraft
    })
    await AsyncStorage.setItem('drafts', JSON.stringify(filteredDraft));
  }
  catch(error){
    console.log(error);
  }

}



editDraft(item){
}




//Function to refresh the flatlist after a chit has been added to it


handleRefresh = () => {
  this.setState({
    refreshing: true,
    listOfFollowing: this.state.listOfFollowing
  }, () => {
    this.getListOfFollowing();
  })
}




componentDidMount(){
  this.displayDraft();
}







  render() {

  return (
     <View style={styles.container}>
     <FlatList
       style={styles.flatList}
       data={this.state.drafts}
       keyExtractor={(item, index) => index.toString()}
       refreshing={this.state.refreshing}
       onRefresh={this.handleRefresh}
       ItemSeparatorComponent = { this.FlatListItemSeparator}
       renderItem={({item, index}) => (
       <View style={styles.row}>
         <Text style={styles.name}>{item[0].chit_content}</Text>

         <TouchableOpacity
          style={styles.editDraftButton}
          onPress={() => this.props.navigaton.navigate('NewChit', {chitContentCallback: item[0].chit_content})}
          >
            <Text>Edit</Text>
         </TouchableOpacity>

         <TouchableOpacity
          style={styles.deleteDraftButton}
          onPress={() => this.deleteDraft(item)}
          >
            <Text>Delete</Text>
         </TouchableOpacity>
       </View>
      )}
     />

     </View>
   );
 }
}


export default displayDraftsScreen
