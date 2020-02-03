import axios from 'axios';
import users from '../data/users';
import posts from '../data/posts';

const user = {
  index: () => axios.get(
    'https://httpbin.org/get',
    {
      params: {
        users: JSON.stringify(users)
      }
    }
  )
};

const post = {
  index: () => axios.get(
    'https://httpbin.org/get',
    {
      params: {
        posts: JSON.stringify(posts)
      }
    }
  )
};

export default {
  user, post
};