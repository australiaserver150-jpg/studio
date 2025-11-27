# **App Name**: GameTopUp Zone

## Core Features:

- User Authentication: Secure user sign-up, sign-in, and sign-out using Email/Password and Google Sign-In. Firebase Authentication is used.
- Admin Role Protection: Restrict admin dashboard access using client-side checks (getIdTokenResult) and a server-side Cloud Function to set custom claims for admin users.
- Product Management: Admin users can add, edit, and delete game top-up products with details like title, game, price, and description, stored in Firestore.
- Order Processing: Users can create orders for top-up products, and admins can view and mark orders as delivered, with order data stored in Firestore.
- Firestore Data Storage: Utilize Firestore to store product, order, and user data, ensuring a scalable and real-time database solution.
- Animated Google Sign-In Icon: An animated Google Sign-In Icon for a unique feel.
- AI-Powered Description: Leverage a tool that will analyze product name to dynamically generate creative descriptions using the product title and its game title, saving the administrator time on the generation of the product descriptions. 

## Style Guidelines:

- Primary color: Royal blue (#4169E1), to evoke trust and security.
- Background color: Very light blue (#F0F8FF), to create a clean and modern backdrop.
- Accent color: Purple (#800080), used for interactive elements to draw user attention.
- Body font: 'Inter', a sans-serif font for a clean, neutral look. Headline font: 'Space Grotesk' sans-serif to give a contemporary feel.
- Use modern, flat icons relevant to gaming and top-up services. Consider using a single style icon set for consistency.
- Implement a responsive layout using CSS Grid or Flexbox to ensure the application is accessible and visually appealing on various devices.
- Add subtle animations on button hovers and page transitions to improve user engagement. The Google Sign-In icon has unique animation.