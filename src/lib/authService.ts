import {
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  updateProfile,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { auth } from './firebase';
import { Person } from '../types';
import { savePersonToFirestore } from './firestoreService';

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export const signInWithGoogle = async (): Promise<Person> => {
  const result = await signInWithPopup(auth, googleProvider);
  const user = result.user;

  const person: Person = {
    id: user.uid,
    name: user.displayName || 'Google User',
    username: `@${(user.displayName || 'user').toLowerCase().replace(/[^a-z0-9]/g, '')}`,
    avatar: user.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300',
    bio: 'Weekly photo journal storyteller',
    location: 'Global',
    accentColor: '#d97706',
    joinedDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    role: 'Contributor',
    email: user.email || undefined,
    emailVerified: user.emailVerified
  };

  try {
    await savePersonToFirestore(person);
  } catch (err) {
    console.warn('Could not auto-save Google user to Firestore:', err);
  }

  return person;
};

export const registerWithEmail = async (
  email: string,
  pass: string,
  name: string,
  bio?: string,
  avatar?: string
): Promise<Person> => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
  const user = userCredential.user;

  if (name) {
    await updateProfile(user, {
      displayName: name,
      photoURL: avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300'
    });
  }

  try {
    await sendEmailVerification(user);
  } catch (err) {
    console.warn('Verification email dispatch issue:', err);
  }

  const person: Person = {
    id: user.uid,
    name: name || user.email?.split('@')[0] || 'Contributor',
    username: `@${(name || 'user').toLowerCase().replace(/[^a-z0-9]/g, '')}`,
    avatar: avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300',
    bio: bio || 'Documenting my weekly moments',
    location: 'Community',
    accentColor: '#d97706',
    joinedDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    role: 'Contributor',
    email: user.email || undefined,
    emailVerified: false
  };

  try {
    await savePersonToFirestore(person);
  } catch (err) {
    console.warn('Could not save user to Firestore:', err);
  }

  return person;
};

export const loginWithEmail = async (email: string, pass: string): Promise<User> => {
  const userCredential = await signInWithEmailAndPassword(auth, email, pass);
  return userCredential.user;
};

export const resendVerificationEmail = async (): Promise<void> => {
  if (auth.currentUser) {
    await sendEmailVerification(auth.currentUser);
  } else {
    throw new Error('No user is currently signed in to verify.');
  }
};

export const reloadCurrentUser = async (): Promise<User | null> => {
  if (auth.currentUser) {
    await auth.currentUser.reload();
    return auth.currentUser;
  }
  return null;
};

export const signOutUser = async (): Promise<void> => {
  await signOut(auth);
};

export const subscribeToAuth = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};
