/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {createContext, useEffect, useState} from 'react';
import type {PropsWithChildren} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  useColorScheme,
  View,
  TextInput,
  Alert,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import NoteView, {Note} from './Note';
import TrackPlayer, {Event, useProgress, useTrackPlayerEvents} from 'react-native-track-player';

// The player is ready to be used
// Import the functions you need from the SDKs you need
import {initializeApp} from 'firebase/app';
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  doc,
  serverTimestamp,
  arrayUnion,
  arrayRemove,
  query,
  where,
} from 'firebase/firestore';
import {setDoc, updateDoc} from 'firebase/firestore';

export const LevelContext = createContext(1);

type NotesContextType = {
  notes: Note[];
  noteColor: string;
};

export const NotesContext = createContext<NotesContextType>({
  notes: [],
  noteColor: 'red',
});

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyDb3b9Jw89-E3UJkgPZ0QJWIAY5B_A5hVQ',
  authDomain: 'firestore-1882a.firebaseapp.com',
  projectId: 'firestore-1882a',
  storageBucket: 'firestore-1882a.appspot.com',
  messagingSenderId: '614642945241',
  appId: '1:614642945241:web:11c39570efc8ca090342c8',
  measurementId: 'G-2X5Q13G3H5',
};

class City {
  name: string;
  state: string;
  country: string;
  capital: boolean;

  constructor(name: string, state: string, country: string, capital: boolean) {
    this.name = name;
    this.state = state;
    this.country = country;
    this.capital = capital;
  }
  toString() {
    return this.name + ', ' + this.state + ', ' + this.country;
  }
}

// Firestore data converter
const cityConverter = {
  toFirestore: (city: City) => {
    return {
      name: city.name,
      state: city.state,
      country: city.country,
      capital: city.capital,
    };
  },
  fromFirestore: (snapshot: any, options: any) => {
    const data = snapshot.data(options);
    return new City(data.name, data.state, data.country, data.capital);
  },
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function createDoc() {
  try {
    // const docRef = await addDoc(collection(db, 'users'), {
    //   first: 'Ada',
    //   last: 'Lovelace',
    //   born: 1815,
    // });
    const docRef = await addDoc(collection(db, 'users'), {
      first: 'Alan',
      middle: 'Mathison',
      last: 'Turing',
      born: 1912,
    });
    console.log('Document written with ID: ', docRef.id);
  } catch (e) {
    console.error('Error adding document: ', e);
  }
}

const addMultipleCities = async () => {
  // 1. Create an array of cities
  const cities: City[] = [
    new City('City 2', 'Some State', 'Country', true),
    new City('Tel Aviv', 'Israel', 'Country', true),
    new City('Jerusalem', 'Some State', 'Israel', true),
    new City('Haifa', 'Some State', 'Israel', true),
    new City('City 1', 'Some State', 'Country', false),
    new City('City 2', 'Some State', 'Country', true),
    new City('City 3', 'Some State', 'Country', false),
    new City('City 4', 'Some State', 'Country', true),
    new City('City 5', 'Some State', 'Country', true),
    new City('City 6', 'Some State', 'Country', true),
    new City('City 7', 'Some State', 'Country', false),
  ];
  // 2. Iterate the cities and create 'addDoc' promises array
  const promises = cities.map(
    city =>
      new Promise(async (resolve, reject) => {
        const citiesCollectionRef = collection(db, 'cities').withConverter(
          cityConverter,
        );
        try {
          const cityRef = await addDoc(citiesCollectionRef, city);
          resolve(cityRef.id);
        } catch (error) {
          reject(error);
        }
      }),
  );

  // 3. Execute all promises in parallel
  try {
    const citiesIds = Promise.all(promises);
    console.log('citiesIds', citiesIds);
  } catch (error) {
    console.log('error creating all cities', error);
  }
};

const addCityWithConverter = async () => {
  const citiesCollectionRef = collection(db, 'cities').withConverter(
    cityConverter,
  );

  try {
    const cityRef = await addDoc(citiesCollectionRef, {
      name: 'Bat Yam',
      country: 'Israel',
      state: 'Israel',
      capital: true,
    });

    console.log('City written with ID: ', cityRef.id);
  } catch (error) {
    console.log('Error City Not Added', error);
  }

  // const cityRef = doc(db, 'cities').withConverter(cityConverter);
};
const getAllUsers = async () => {
  const querySnapshot = await getDocs(collection(db, 'users'));
  querySnapshot.forEach(doc => {
    console.log(`${doc.id} => ${doc.data()}`);
  });
};

const getCitiesWithConverter = async () => {
  const citiesCollectionRef = collection(db, 'cities').withConverter(
    cityConverter,
  );
  const querySnapshot = await getDocs(citiesCollectionRef);
  querySnapshot.forEach(cityDoc => {
    console.log(`${cityDoc.id} => ${cityDoc.data()}`);
  });
};

const updateUser = async () => {
  const userRef = doc(db, 'users', 'zyn97maQbmw6P3b4Pwbd');
  console.log('Document written with ID: ', userRef.path);
  try {
    await updateDoc(userRef, {
      born: 1892,
      timestamp: serverTimestamp(), // server timestamp

      // adding nested object
      // favorites: {food: 'Pizza', color: 'Blue', subject: 'recess'},

      // updating nested objects with 'dot notation'
      'favorites.food': 'Burger',

      // adding array
      // someNumbers: [1, 2, 3, 4, 5, 6, 7, 8],

      // add number to array
      // someNumbers: arrayUnion(9, 10, 11),

      // remove number from array
      someNumbers: arrayRemove(11),
    });
  } catch (error) {
    console.log('jhg', error);
  }
};

const updateCity = async () => {
  const landmarksRef = collection(
    db,
    'cities',
    'tfUFt9iJfDRojijwGO0J',
    'landmarks',
  );

  try {
    const landmarkRef = await addDoc(landmarksRef, {name: 'hey'});
    // await updateDoc(cityRef, {
    //   landmarks: [{name: 'hey'}, {name: 'bla'}],
    // });
    console.log('landmark added with id ', landmarkRef.id);
  } catch (error) {
    console.log('jhg', error);
  }
};

const basicQuery = async () => {
  const citiesCollectionRef = collection(db, 'cities').withConverter(
    cityConverter,
  );
  const q = query(citiesCollectionRef, where('capital', '==', false));

  const querySnapshot = await getDocs(q);
  querySnapshot.forEach(city => {
    // doc.data() is never undefined for query doc snapshots
    console.log(city.id, ' => ', city.data());
  });
};

const querySubcollection = async () => {
  const landmarksCollectionRef = collection(
    db,
    'cities/tfUFt9iJfDRojijwGO0J/landmarks',
  );

  try {
    const landmarksSnapshot = await getDocs(landmarksCollectionRef);
    console.log('landmarksSnapshot', landmarksSnapshot);
    landmarksSnapshot.forEach(landmarkDoc => {
      console.log(`${landmarkDoc.id} => ${landmarkDoc.data()}`);
    });
  } catch (error) {
    console.log('error getting landmarks', error);
  }
};

const startPlayer = async () => {
  await TrackPlayer.setupPlayer()
  const track = {
    url: require('./song.mp3'), // Load media from the app bundle
    title: 'Song',
    artist: 'Omer Adam',
};
const track2 = {
  url: require('./Erratic.mp3'), // Load media from the app bundle
  title: 'Song 2',
  artist: 'Useless ID',
};
  await TrackPlayer.add([track, track2]);
  TrackPlayer.play();
  setTimeout(() => {
    TrackPlayer.skip(1);
  }, 10000)
}

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const [text, onChangeText] = React.useState('');

  const [notesContext, setNotesContext] = useState<NotesContextType>({
    notes: [
      {title: 'hello', description: 'world'},
      {title: 'hello2', description: 'world2'},
      {title: 'hello3', description: 'world3'},
      {title: 'hello5', description: 'world5'},
      {title: 'hello6', description: 'world6'},
      {title: 'hello7', description: 'world7'},
    ],
    noteColor: 'grey',
  });
  const progress = useProgress();
  console.log(`duration: ${progress.duration}, position: ${progress.position}, buffered: ${progress.buffered}`)

  useTrackPlayerEvents([Event.PlaybackActiveTrackChanged], async event => {
    if (event.type === Event.PlaybackActiveTrackChanged && event.track != null) {
        const track = await TrackPlayer.getTrack(event.index!);
        const {title} = track || {};
        console.log(`playing ${title}`)
    }
});
  useEffect(() => {
    // createDoc();
    // getAllUsers();
    // updateUser();
    // updateCity();
    // addCityWithConverter();
    // addMultipleCities();
    // basicQuery();
    // querySubcollection();
    startPlayer()
  }, []);

  const removeNote = (index: number) => {
    let note = notesContext.notes.at(index);
    setNotesContext({
      ...notesContext,
      notes: notesContext.notes.filter(currentNote => currentNote !== note),
    });
    console.log(notesContext);
  };

  const backgroundStyle = {
    flex: 1,
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <NotesContext.Provider value={notesContext}>
      <SafeAreaView style={backgroundStyle}>
        <TextInput
          style={styles.input}
          onChangeText={onChangeText}
          value={text}
          placeholder="Enter random text"
        />
        <View style={styles.gridContainer}>
          {notesContext.notes.map((note, index) => (
            <NoteView
              title={note.title}
              description={note.description}
              onDelete={() => removeNote(index)}
            />
          ))}
        </View>
      </SafeAreaView>
    </NotesContext.Provider>
  );
}

const styles = StyleSheet.create({
  gridContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
