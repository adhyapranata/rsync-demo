export const loadInitialDataParams = {
  requestGetPosts: ({ params = {}, prevResponse }) => {
    const requestGetUsers = prevResponse
      .find(prev => prev.type === 'user/requestGetUsers')
      .response;

    return {
      ...params,
      user: JSON.parse(requestGetUsers.data.args.users)[0]
    }
  }
}