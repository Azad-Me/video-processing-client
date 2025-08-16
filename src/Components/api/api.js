export async function processFrame(file, BASEURL, endpoint) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${BASEURL}/${endpoint}`, {
    method: "POST",
    body: formData
  });

  if (!response.ok) {
    throw new Error("API request failed");
  }

  return await response.json();
}
