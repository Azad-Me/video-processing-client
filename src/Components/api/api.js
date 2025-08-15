export async function processFrame(file) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("http://localhost:8000/images/process", {
    method: "POST",
    body: formData
  });

  if (!response.ok) {
    throw new Error("API request failed");
  }

  return await response.json();
}
