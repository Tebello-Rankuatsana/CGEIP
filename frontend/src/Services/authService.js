import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut 
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

export const authService = {
  async login(email, password) {
    try {
      // Use Firebase Auth directly
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Get user data from Firestore to determine role
      let userData = null;
      let role = 'student';

      // Check different collections for user data
      const studentDoc = await getDoc(doc(db, 'students', firebaseUser.uid));
      if (studentDoc.exists()) {
        userData = studentDoc.data();
        role = 'student';
      } else {
        const instituteDoc = await getDoc(doc(db, 'institutions', firebaseUser.uid));
        if (instituteDoc.exists()) {
          userData = instituteDoc.data();
          role = 'institute';
        } else {
          const companyDoc = await getDoc(doc(db, 'companies', firebaseUser.uid));
          if (companyDoc.exists()) {
            userData = companyDoc.data();
            role = 'company';
          } else {
            const adminDoc = await getDoc(doc(db, 'admins', firebaseUser.uid));
            if (adminDoc.exists()) {
              userData = adminDoc.data();
              role = 'admin';
            }
          }
        }
      }

      if (!userData) {
        return { 
          success: false, 
          message: 'User profile not found in database' 
        };
      }

      const completeUser = {
        ...userData,
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        role: role
      };

      return {
        success: true,
        user: completeUser,
        token: await firebaseUser.getIdToken()
      };
    } catch (error) {
      console.error('Login error:', error);
      let errorMessage = 'Login failed';
      
      switch (error.code) {
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address';
          break;
        case 'auth/user-disabled':
          errorMessage = 'This account has been disabled';
          break;
        case 'auth/user-not-found':
          errorMessage = 'No account found with this email';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Incorrect password';
          break;
        default:
          errorMessage = error.message;
      }
      
      return { success: false, message: errorMessage };
    }
  },

  async register(userData) {
    try {
      const { email, password, name, role = 'student' } = userData;
      
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Prepare user profile data
      const profileData = {
        name,
        email,
        createdAt: new Date(),
        status: 'active'
      };

      // Save to appropriate collection based on role
      let collectionName = 'students';
      
      switch (role) {
        case 'institute':
          collectionName = 'institutions';
          profileData.phone = '';
          profileData.address = '';
          profileData.website = '';
          profileData.description = '';
          break;
        case 'company':
          collectionName = 'companies';
          profileData.phone = '';
          profileData.address = '';
          profileData.industry = '';
          profileData.description = '';
          break;
        case 'admin':
          collectionName = 'admins';
          break;
        default: // student
          profileData.phone = '';
          profileData.dateOfBirth = '';
          profileData.address = '';
          profileData.highSchool = '';
          profileData.graduationYear = '';
          profileData.transcriptUrl = '';
          profileData.appliedCourses = [];
      }

      await setDoc(doc(db, collectionName, firebaseUser.uid), profileData);

      const completeUser = {
        ...profileData,
        uid: firebaseUser.uid,
        role: role
      };

      return {
        success: true,
        user: completeUser,
        token: await firebaseUser.getIdToken()
      };
    } catch (error) {
      console.error('Registration error:', error);
      let errorMessage = 'Registration failed';
      
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'Email already in use';
          break;
        case 'auth/weak-password':
          errorMessage = 'Password is too weak';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address';
          break;
        default:
          errorMessage = error.message;
      }
      
      return { success: false, message: errorMessage };
    }
  },

  async logout() {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false, message: error.message };
    }
  }
};