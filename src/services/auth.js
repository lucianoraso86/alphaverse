//import axios from './instance';

export const login = (username, pass) => {
  return (new Promise(function(resolve, reject) {
    setTimeout(() => {
      if (username === 'test' && pass === 'web') {
        resolve ({
          status: 200,
          data: {
            user: {
              name: 'test',
              mail: 'some@test.com',
              token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6InRlc3QiLCJtYWlsIjoic29tZUB0ZXN0LmNvbSIsImlhdCI6MTY2MzY4NjMwMywiZXhwIjoxNjk1MjIyMzAzfQ.Y-GIldXN6X8glKfj2gTjJPJ8k-sjqDtwmJaP9Y1fcnY'
            }
          }
        })
    
      }
      else resolve ({
        status: 401,
        msg: 'unathorized'
      });
    }, 2000)
  }))

}