export async function appriseAlert({title, body}: { title: string, body: string }) {
  console.log("alert", process.env.ALERT_URL, title, body)
  let result = await fetch(process.env.ALERT_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      format: 'markdown',
      title: title,
      body: body
    }),
  })
  return result.json();
}

