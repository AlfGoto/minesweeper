import { client } from ".";

export const getUser = async (userEmail: string) => {
  const user = await client.GET("/skins/user/{userEmail}", {
    params: {
      path: { userEmail },
    },
  });
  return user.data;
};
