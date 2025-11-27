# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

## Assigning an Admin Role

To assign an administrator role to a user, you need to manually update their user profile in the Firestore database.

**Prerequisites:** The user must have already signed up for an account in your application. This creates their user document in Firestore.

**Steps:**

1.  **Open Firebase Console:** Go to the [Firebase Console](https://console.firebase.google.com/) and select your project.
2.  **Go to Firestore:** From the left-hand menu, navigate to **Build > Firestore Database**.
3.  **Find the User:** In the `users` collection, find the document whose ID matches the UID of the user you want to make an admin. The UID can be found in the Firebase Authentication section.
4.  **Update the Role:** Click on the user's document to view its fields. Find the `role` field and change its value from `"user"` to `"admin"`.
5.  **Save Changes:** Click the "Update" button to save the changes to the document.

The user will now have admin privileges the next time they log in or their session is refreshed.
