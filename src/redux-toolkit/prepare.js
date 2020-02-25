export const loadInitialDataParams = {
  requestGetPosts: ({ params = {}, prevResponse }) => {
    const requestGetUser = prevResponse
      .find(prev => prev.type === 'user/requestGetUser')
      .response

    return {
      ...params,
      user: JSON.parse(requestGetUser.data.args.user)
    }
  }
}
