import { auth, db } from '../lib/firebase/init';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import CONFIG from '../config/environtment';
import { logError, logInfo } from '../utils/logger';

export const registerAdminSevice = async (payload: { username: string; email: string; password: string }) => {
  const { username, email, password } = payload;
  try {
    // Create user in Firebase Auth
    const userRecord = await auth.createUser({
      email,
      password,
      displayName: username,
    });

    // Set custom claims for role 'admin'
    await auth.setCustomUserClaims(userRecord.uid, { role: 'admin' });

    // Store additional admin data in Firestore
    const adminData = {
      id: uuidv4(),
      uid: userRecord.uid,
      email: userRecord.email,
      displaName: userRecord.displayName,
      role: 'admin',
      createdAt: new Date(),
    };

    await db.collection('admins').doc(userRecord.uid).set(adminData);
    logInfo('Success registered admin');

    return {
      success: true,
      message: 'Admin successfully registered',
      data: adminData,
    };
  } catch (error) {
    if (error instanceof Error) {
      logError(`Failed to register admin: ${error}`);

      // Type assertion untuk memastikan error memiliki properti 'code'
      const firebaseError = error as { code?: string };

      // Check for specific Firebase Auth errors
      if (firebaseError.code === 'auth/email-already-exists') {
        throw new Error('Email already registered. Please use a different email.');
      } else if (firebaseError.code === 'auth/invalid-email') {
        throw new Error('Invalid email format. Please enter a valid email.');
      } else if (firebaseError.code === 'auth/weak-password') {
        throw new Error('Password is too weak. Please use a stronger password.');
      } else {
        throw new Error('Failed to register admin. Please try again later.');
      }
    } else {
      logError('Unknown error occurred in registerAdminService');
      throw new Error('Unknown error occurred in registerAdminService');
    }
  }
};

export const loginService = async (payload: { email: string; password: string }) => {
  const { email, password } = payload;
  try {
    // Firebase API key
    const apiKey = CONFIG.apiKey;
    const signInUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`;

    // Verifikasi email dan password melalui Firebase Authentification REST API
    const response = await axios.post(signInUrl, {
      email,
      password,
      returnSecureToken: true,
    });

    // Mengambil idToken dan localId dari response
    const { idToken, localId } = response.data;

    // Ambil informasi user dari Firebase Auth berdasarkan uid (localId)
    const user = await auth.getUser(localId);

    logInfo('Login successful');

    return {
      success: true,
      message: 'Login success',
      token: idToken, // Mengembalikan idToken sebagai token autentikasi
      user: {
        uid: user.uid,
        email: user.email,
        displaName: user.displayName,
      },
    };

    // Login user via Firebase Auth
  } catch (error: any) {
    logError(`Login failed: ${error.message}`);

    // Menangani error spesifik dari Firebase Authentication API
    if (error.response && error.response.data && error.response.data.error) {
      const firebaseError = error.response.data.error.message;

      if (firebaseError === 'EMAIL_NOT_FOUND') {
        throw new Error('Email not registered. Please sign up first.');
      } else if (firebaseError === 'INVALID_PASSWORD') {
        throw new Error('Invalid password. Please try again.');
      } else if (firebaseError === 'USER_DISABLED') {
        throw new Error('User account has been disabled. Contact support.');
      }
    }

    throw new Error('Failed to login. Please check your credentials.');
  }
};
