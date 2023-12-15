import { useEffect } from "react";
import { useState } from "react";

function App() {
  const [prompt, setPrompt] = useState("");
  const [sdGenerationId, setSdGenerationId] = useState("");
  const [images, setImages] = useState([])

  const generateImage = async () => {
    console.log(prompt);
    const res = await fetch(
      "https://cloud.leonardo.ai/api/rest/v1/generations",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer your-key",
          Accept: "application/json",
        },
        body: JSON.stringify({
          height: 512,
          modelId: "1e60896f-3c26-4296-8ecc-53e2afecc132",
          prompt,
          width: 512,
          num_images: 3,
          "alchemy": true
        }),
      }
    );
    const data = await res.json();
    console.log(data.sdGenerationJob.generationId)
    setSdGenerationId(data.sdGenerationJob.generationId)
  };

  useEffect(() => {
    if (!sdGenerationId) return;

    const interval = setInterval(async () => {
      const res = await fetch(`https://cloud.leonardo.ai/api/rest/v1/generations/${sdGenerationId}`, {
        headers: {
          Authorization: "Bearer your-key",
          Accept: "application/json",
        },
      })
      const data = await res.json();

      if (data.generations_by_pk.status === "PENDING") return;

      console.log(data.generations_by_pk)
      setImages(data.generations_by_pk.generated_images)

      clearInterval(interval);
      
    }, 1500);

    return () => clearInterval(interval);

  }, [sdGenerationId]);

  return (
    <div>
      <input
        type="text"
        placeholder="Escribe tu prompt"
        onChange={(e) => setPrompt(e.target.value)}
      />
      <button onClick={() => generateImage()}>Generate</button>

      <div>
        {
          images.map((image) => (
            <img src={image.url} alt="generated" />
          ))
        } 
      </div>
    </div>
  );
}
export default App;
