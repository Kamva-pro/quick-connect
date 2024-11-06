<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Quick Connect</title>
</head>
<body>
    <h1>Quick Connect</h1>

    <h2>About</h2>
    <p>Quick Connect is a networking app that simplifies professional connections by replacing physical business cards with digital ones. It offers fast, reliable access to contact information while prioritizing the safety and protection of your personal data.</p>

    <h3>Features</h3>
    <ul>
        <li><strong>QR Code Scanning:</strong> Connect instantly by scanning another user’s QR code to view their public profile information. You can then send a connection request, and upon acceptance, you’ll have access to their full digital business card.</li>
        <li><strong>Nearby Users:</strong> Discover potential connections nearby based on geolocation. This is especially useful for meeting individuals within the same city or at events.</li>
    </ul>

    <h2>Status</h2>
    <p>Quick Connect is currently in production and will soon be available for Android and iOS platforms.</p>

    <h2>Getting Started</h2>
    <p>To set up the app locally, follow these instructions:</p>

    <h3>Prerequisites</h3>
    <p>Ensure you have <strong>Node.js</strong> installed. Verify installation with:</p>
    <pre><code>node -v</code></pre>
    <p>Install the <strong>Expo CLI</strong> globally:</p>
    <pre><code>npm install -g expo-cli</code></pre>

    <h3>Installation</h3>
    <p>Clone the Repository:</p>
    <pre><code>git clone https://github.com/kamva-pro/quick-connect.git
cd quick-connect</code></pre>
    <p>Install Dependencies:</p>
    <pre><code>npm install</code></pre>

    <h4>Set Up Firebase and Supabase (Optional for Full Functionality):</h4>
    <ul>
        <li><strong>Firebase:</strong> Set up a Firebase project for authentication if you want to test user login features.</li>
        <li><strong>Supabase:</strong> Create a Supabase project and configure tables for user data (<code>users</code> and <code>user_locations</code>). Add the required API keys and URLs in a <code>.env</code> file.</li>
    </ul>
    <p>For testing, public read-only access can be enabled on Supabase and Firebase, or use pre-configured credentials if provided.</p>

    <h3>Running the App</h3>
    <p>Start the app in development mode:</p>
    <pre><code>expo start</code></pre>
    <p>Follow the on-screen instructions to run the app on Android or iOS.</p>

    <h2>Screenshots</h2>
    <p><strong>TODO:</strong> ADD SCREENSHOTS OF THE APP IN ACTION</p>

    <h2>Contributing</h2>
    <p>To contribute:</p>
    <ul>
        <li>Fork the repository.</li>
        <li>Create a new branch (<code>git checkout -b feature/YourFeature</code>).</li>
        <li>Commit your changes (<code>git commit -m 'Add feature'</code>).</li>
        <li>Push to your branch (<code>git push origin feature/YourFeature</code>).</li>
        <li>Open a Pull Request.</li>
    </ul>

    <h2>License</h2>
    <p>This project is licensed under the MIT License.</p>
</body>
</html>
