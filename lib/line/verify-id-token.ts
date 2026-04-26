interface VerifiedToken {
  userId: string;
  displayName: string;
  pictureUrl?: string;
}

export async function verifyIdToken(
  idToken: string
): Promise<VerifiedToken | null> {
  try {
    const response = await fetch("https://api.line.me/oauth2/v2.1/verify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        id_token: idToken,
        client_id: process.env.LIFF_ID!.split("-")[0],
      }),
    });

    if (!response.ok) return null;

    const data = await response.json();
    return {
      userId: data.sub,
      displayName: data.name,
      pictureUrl: data.picture,
    };
  } catch {
    return null;
  }
}
