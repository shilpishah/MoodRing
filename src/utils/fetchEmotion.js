export default async function fetchEmotion() {
  const response = await fetch('https://moodring-ochl.onrender.com/api/emotion'); // deployed on render!
  if (!response.ok) throw new Error('Failed to fetch emotion');
  return await response.json();
}
