import { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

export default function App() {
  const { loginWithRedirect, logout, isAuthenticated, isLoading, user, getAccessTokenSilently } = useAuth0();
  const [result, setResult] = useState('');

  async function callApi() {
    try {
      const token = await getAccessTokenSilently();
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/risk-status`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        setResult(`Error: HTTP ${response.status}`);
        return;
      }
      setResult(JSON.stringify(await response.json(), null, 2));
    } catch (error) {
      setResult(`Error: ${error.message}`);
    }
  }

  if (isLoading) return <p>Cargando...</p>;

  if (!isAuthenticated) return <button onClick={() => loginWithRedirect()}>Log in</button>;

  return (
    <main>
      <p>Signed in as {user.name}</p>
      <button onClick={callApi}>Call protected API</button>
      <button onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>Log out</button>
      <pre>{result}</pre>
    </main>
  );
}
