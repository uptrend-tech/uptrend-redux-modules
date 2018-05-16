```javascript
const payload = {
  data, // the resource data in `resp`
  // - currently `resp.data` in most projects)

  entities, // undefined by default,
  //  - entities middleware populates if normalized

  entityType, // same as meta

  api: {
    response, // the full response body from api request,
    // room for more api data if needed in future
  },

  resource: {
    path, // string path to resource (same as meta.resource)
    needle, // if supplied (same as meta.resource)
  },
}
```
