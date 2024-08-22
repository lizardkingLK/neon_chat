"use client"

export default function Pulse() {
  if (!process.env.NEXT_PUBLIC_PULSE_API_KEY) {
    return <h1>😢</h1>;
  }

  const calculateGroupsCount = async () => {
    const response = await fetch("/api/groups");
    console.log({ response });
  };

  return (
    <main>
      <button onClick={() => calculateGroupsCount()}>Click me to count</button>
    </main>
  );
}
