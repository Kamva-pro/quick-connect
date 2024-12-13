# Quick Connect

## About
Quick Connect is a networking app that simplifies professional connections by replacing physical business cards with digital ones. It offers fast, reliable access to contact information while prioritizing the safety and protection of your personal data.

## Features
- **QR Code Scanning:** Connect instantly by scanning another user’s QR code to view their public profile information. You can then send a connection request, and upon acceptance, you’ll have access to their full digital business card.
- **Nearby Users:** Discover potential connections nearby based on geolocation. This is especially useful for meeting individuals within the same city or at events.

## Status
Quick Connect is currently in production and will soon be available for Android and iOS platforms.

## Getting Started
To set up the app locally, follow these instructions:

### Prerequisites
Ensure you have **Node.js** installed. Verify installation with:

node -v


## Install the Expo CLI globally:

npm install -g expo-cli
Installation
Clone the Repository:

git clone https://github.com/kamva-pro/quick-connect.git
cd quick-connect

## Install Dependencies:
npm install

## OPTIONAL: Set Up Firebase and Supabase (Optional for Full Functionality):
Firebase: Set up a Firebase project for authentication if you want to test user login features.
Supabase: Create a Supabase project and configure tables for user data (users and user_locations). Add the required API keys and URLs in a .env file.
For testing, public read-only access can be enabled on Supabase and Firebase, or use pre-configured credentials if provided.

## Running the App
To run the app firstly ensure you are in the /quick-connect directory then run:
`npx expo start` 

## Screenshots
Screenshots of the app will be available once the first version is released.  

## Contributing
To contribute:

Fork the repository.
Create a new branch (git checkout -b feature/YourFeature).
Commit your changes (git commit -m 'Add feature').
Push to your branch (git push origin feature/YourFeature).
Open a Pull Request.

## License
This project is licensed under the MIT License.








