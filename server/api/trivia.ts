import { withQuery } from "ufo";
// Get Trivia data
export default defineEventHandler(async (event) => {
  const query = getQuery(event);

  const session = await useSession(event, {
    password: process.env.NUXT_SESSION_PASSWORD,
  });

  let opentdbToken = session.data.opentdbToken;

  // Request new token
  if (!opentdbToken) {
    const tokenResponse: any = await $fetch("https://opentdb.com/api_token.php?command=request");
    if (tokenResponse.response_code === 0) {
      opentdbToken = tokenResponse.token;
      // Save token to client session
      await session.update({ opentdbToken });
    }
  }

  // Create trivia request url
  const apiUrl = withQuery(`https://opentdb.com/api.php`, {
    amount: query.amount,
    category: query.category,
    difficulty: query.difficulty,
    token: opentdbToken,
  });

  // Request data to OpenTDB
  try {
    const data: any = await $fetch(apiUrl);

    // Token empty/no more questions for category
    if (data.response_code === 4) {
      // Reset token
      await $fetch(`https://opentdb.com/api_token.php?command=reset&token=${opentdbToken}`);
      // Create new request url
      return await $fetch(apiUrl);
    }

    // Check wrong token/expired after 6 hours
    if (data.response_code === 3) {
      // Update new token
      await session.update({ opentdbToken: null });
    }
    return data;
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: "Error fetching data from server.",
    });
  }
});
