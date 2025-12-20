// Test if Firebase auth is working
const testAuth = async () => {
  console.log("Testing Firebase Auth...");
  
  // Import dynamically
  const { auth } = await import('./src/firebase.js');
  
  console.log("Auth object:", auth);
  console.log("Methods available:");
  console.log("- createUserWithEmailAndPassword:", typeof auth.createUserWithEmailAndPassword);
  console.log("- signInWithEmailAndPassword:", typeof auth.signInWithEmailAndPassword);
  console.log("- signOut:", typeof auth.signOut);
  console.log("- onAuthStateChanged:", typeof auth.onAuthStateChanged);
  
  // Test creating a user
  try {
    console.log("\nTesting user creation...");
    const result = await auth.createUserWithEmailAndPassword("test@example.com", "123456");
    console.log("✅ User created:", result.user.email);
  } catch (error) {
    console.log("❌ Error:", error.message);
  }
};

testAuth();