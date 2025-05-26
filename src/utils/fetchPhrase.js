export async function fetchDynamicPhrase(emotion, ageGroup, timeOfDay) {
  try {
    const response = await fetch("http://localhost:8000/api/phrase", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ emotion, age_group: ageGroup, time_of_day: timeOfDay })
    });

    const data = await response.json();

    return {
      phrase: data.phrase || "you're doing your best!",
      song: data.song || null
    };
  } catch (error) {
    console.error("Failed to fetch phrase:", error);
    return {
      phrase: "you're doing your best!",
      song: null
    };
  }
}
