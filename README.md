A Dynamic Portfolio Website framework built using MongoDB Express, Node and React.

## User Login:
`/api/users`
- Type: `POST`
- Body: 
```
    {
        "name": "August",
        "email": "abc@abc.com",
        "password": "123456"
    }
```

- Returns: Token

## New Post
'/api/post'
- Type: `POST`
- Header: `x-auth-token = ...`
- Body: 
```
    {
        "text": "abcd"
    }
```

- Returns: The Post


TODO:
Delete Post