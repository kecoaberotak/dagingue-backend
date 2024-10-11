import { auth, db } from '../lib/firebase/init';
import axios from 'axios';
import CONFIG from '../config/environtment';
import { logError, logInfo } from '../utils/logger';
import { LoginTypes, RegisterTypes } from '../types/auth.types';

export const registerAdminSevice = async (payload: RegisterTypes) => {
  const { name, email, password } = payload;
  try {
    // Create user in Firebase Auth
    const userRecord = await auth.createUser({
      email,
      password,
      displayName: name,
    });

    // Set custom claims for role 'admin'
    await auth.setCustomUserClaims(userRecord.uid, { role: 'admin' });

    // Store additional admin data in Firestore
    const adminData = {
      uid: userRecord.uid,
      email: userRecord.email,
      name: userRecord.displayName,
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

export const loginService = async (payload: LoginTypes) => {
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

    // Verifikasi idToken untuk mengambil custom claims seperti role
    const decodedToken = await auth.verifyIdToken(idToken);
    const role = decodedToken.role; // Mengambil custom claim role

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
        name: user.displayName,
        role: role,
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

export const getDataUsers = async () => {
  try {
    const snapshot = await db.collection('admins').get();

    if (snapshot.empty) {
      return { success: false, message: 'No data users found' };
    }

    const data = snapshot.docs.map((doc) => doc.data());

    return {
      success: true,
      message: 'Success get all data users',
      data,
    };
  } catch (error) {
    throw error;
  }
};

export const getDataUserById = async (uid: string) => {
  try {
    const snapshot = await db.collection('admins').doc(uid).get();

    if (!snapshot.exists) {
      return { success: false, message: 'No data user found for ID: ' + uid };
    }
    return {
      success: true,
      message: 'Success get data user for ID: ' + uid,
      data: snapshot.data(),
    };
  } catch (error) {
    throw error;
  }
};

export const deleteUserService = async (uid: string) => {
  try {
    // Hapus user dari Firebase Auth
    await auth.deleteUser(uid);

    // Hapus data user dari Firestore DB
    await db.collection('admins').doc(uid).delete();
    logInfo(`User with UID: ${uid} successfully deleted`);

    return {
      success: true,
      message: 'User successfully deleted',
    };
  } catch (error) {
    if (error instanceof Error) {
      logError(`Failed to delete user: ${error.message}`);
      throw new Error('Failed to delete user');
    }
    throw new Error('Unknown error occurred while deleting user');
  }
};

export const editUserService = async (uid: string, payload: RegisterTypes) => {
  // MASIH KURANG TEPAT, KALAU USER GA INPUT DATA BARU, KARENA VALIDASINYA OPSIONAL
  try {
    // Update data Firebase Auth
    const currentUser = await auth.getUser(uid);
    const updatedUser = await auth.updateUser(uid, {
      email: payload.email || currentUser.email,
      password: payload.password || undefined, // Password hanya di-update jika ada, kosongkan jika tidak
      displayName: payload.name || currentUser.displayName,
    });

    // Update data Firestore DB
    const userRef = db.collection('admins').doc(uid);
    const snapshot = await userRef.get();

    if (!snapshot.exists) {
      return { success: false, message: 'No user data found for ID: ' + uid };
    }

    await userRef.update({
      name: payload.name || snapshot.data()?.name,
      email: payload.email || snapshot.data()?.email,
      updatedAt: new Date(),
    });

    return {
      success: true,
      message: 'User updated successfully',
      user: updatedUser,
    };
  } catch (error: any) {
    throw new Error(`Failed to update user: ${error.message}`);
  }
};
