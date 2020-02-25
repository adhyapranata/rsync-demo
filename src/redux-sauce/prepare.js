export const loadInitialDataParams = {
  requestGetPosts: ({ params = {}, prevResponse }) => {
    const requestGetUser = prevResponse
      .find(prev => prev.type === 'REQUEST_GET_USER')
      .response

    return {
      ...params,
      user: JSON.parse(requestGetUser.data.args.user)
    }
  }
}
