import axios from 'axios'
import users from './data/users'
import posts from './data/posts'

const url = 'https://httpbin.org/get'

const user = {
  show: () => axios.get(
    url,
    {
      params: {
        user: JSON.stringify(users[0])
      }
    }
  )
}

const post = {
  index: () => axios.get(
    url,
    {
      params: {
        posts: JSON.stringify(posts)
      }
    }
  )
}

export default {
  user, post
}
