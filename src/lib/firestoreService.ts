import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  writeBatch
} from 'firebase/firestore';
import { db } from './firebase';
import { Moment, Person } from '../types';
import { INITIAL_MOMENTS, INITIAL_PEOPLE } from '../data/mockData';

const MOMENTS_COLLECTION = 'moments';
const PEOPLE_COLLECTION = 'people';

// Seed initial moments and people into Firestore if collection is empty
export async function seedInitialFirestoreData(): Promise<void> {
  try {
    const peopleSnap = await getDocs(collection(db, PEOPLE_COLLECTION));
    if (peopleSnap.empty) {
      console.log('Seeding initial people to Firestore...');
      const batch = writeBatch(db);
      for (const person of INITIAL_PEOPLE) {
        const personRef = doc(db, PEOPLE_COLLECTION, person.id);
        batch.set(personRef, person);
      }
      await batch.commit();
    }

    const momentsSnap = await getDocs(collection(db, MOMENTS_COLLECTION));
    if (momentsSnap.empty) {
      console.log('Seeding initial moments to Firestore...');
      const batch = writeBatch(db);
      for (const moment of INITIAL_MOMENTS) {
        const momentRef = doc(db, MOMENTS_COLLECTION, moment.id);
        batch.set(momentRef, moment);
      }
      await batch.commit();
    }
  } catch (error) {
    console.warn('Firestore seeding check skipped or offline fallback used:', error);
  }
}

// Subscribe to real-time moments updates
export function subscribeToMoments(
  onSuccess: (moments: Moment[]) => void,
  onError?: (error: Error) => void
) {
  try {
    const q = query(collection(db, MOMENTS_COLLECTION), orderBy('date', 'desc'));
    return onSnapshot(
      q,
      (snapshot) => {
        const moments: Moment[] = [];
        snapshot.forEach((docSnap) => {
          moments.push({ ...docSnap.data(), id: docSnap.id } as Moment);
        });
        onSuccess(moments);
      },
      (err) => {
        console.warn('Firestore moments onSnapshot error, falling back to cached state:', err);
        if (onError) onError(err);
      }
    );
  } catch (err) {
    console.warn('Error subscribing to moments:', err);
    return () => {};
  }
}

// Subscribe to real-time people updates
export function subscribeToPeople(
  onSuccess: (people: Person[]) => void,
  onError?: (error: Error) => void
) {
  try {
    const q = query(collection(db, PEOPLE_COLLECTION));
    return onSnapshot(
      q,
      (snapshot) => {
        const people: Person[] = [];
        snapshot.forEach((docSnap) => {
          people.push({ ...docSnap.data(), id: docSnap.id } as Person);
        });
        onSuccess(people);
      },
      (err) => {
        console.warn('Firestore people onSnapshot error:', err);
        if (onError) onError(err);
      }
    );
  } catch (err) {
    console.warn('Error subscribing to people:', err);
    return () => {};
  }
}

// Save or create a moment
export async function saveMomentToFirestore(moment: Moment): Promise<void> {
  const momentRef = doc(db, MOMENTS_COLLECTION, moment.id);
  await setDoc(momentRef, moment, { merge: true });
}

// Update reactions on a moment
export async function updateMomentReactionInFirestore(
  momentId: string,
  reactions: Record<string, number>,
  userReacted?: Record<string, boolean>
): Promise<void> {
  const momentRef = doc(db, MOMENTS_COLLECTION, momentId);
  await updateDoc(momentRef, {
    reactions,
    ...(userReacted ? { userReacted } : {})
  });
}

// Add comment to a moment
export async function addCommentToMomentInFirestore(
  momentId: string,
  updatedComments: Moment['comments']
): Promise<void> {
  const momentRef = doc(db, MOMENTS_COLLECTION, momentId);
  await updateDoc(momentRef, { comments: updatedComments });
}

// Delete moment
export async function deleteMomentFromFirestore(momentId: string): Promise<void> {
  const momentRef = doc(db, MOMENTS_COLLECTION, momentId);
  await deleteDoc(momentRef);
}

// Create or update Person
export async function savePersonToFirestore(person: Person): Promise<void> {
  const personRef = doc(db, PEOPLE_COLLECTION, person.id);
  await setDoc(personRef, person, { merge: true });
}
