export default async function fetchEmotion() {
  const response = await fetch('http://localhost:8000/api/emotion'); // changes according to local host setup
  if (!response.ok) throw new Error('Failed to fetch emotion');
  return await response.json();
}