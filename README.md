## API SHORT LINK

## Technologies

- Node.js
- Typescript
- Postgresql
- Redis
- Fastify
- Zod
- Docker

### endpoints

```bash
 ## POST create link
  http://localhost:3333/api/links

 # body
 {
  "code": "test4",
  "url": "https://www.github.com/mauriciogirardi"
  }

 ## return
  {
    "shortLinkId": 7
  }
```

```bash
 ## GET links

 http://localhost:3333/api/links

 ## return
  "links": [
    {
      "id": 6,
      "code": "test1",
      "original_url": "https://www.github.com/mauriciogirardi",
      "create_at": "2024-03-23T13:49:43.969Z"
    },
    {
      "id": 5,
      "code": "test2",
      "original_url": "https://www.gitub.com/mauriciogirardi",
      "create_at": "2024-03-23T13:36:50.772Z"
    },
    {
      "id": 1,
      "code": "test3",
      "original_url": "https://www.gitub.com/mauriciogirardi",
      "create_at": "2024-03-23T13:10:36.786Z"
    }
  ]
```

```bash
  ## GET short link
  http://localhost:3333/test2

  ## redirect to
  https://www.github.com/mauriciogirardi
```

```bash
  ## GET metrics
  http://localhost:3333/api/metrics

  ## return
  {
    "metrics": [
      {
        "shortLinkId": 6,
        "clicks": 2
      }
    ]
  }
```
