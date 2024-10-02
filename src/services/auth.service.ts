import { auth, db } from '../lib/firebase/init';
import { v4 as uuidv4 } from 'uuid';
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
      username: userRecord.displayName,
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
