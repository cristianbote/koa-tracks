koa-tracks
===
Koa middleware that runs multiple middlewares at the same time - in parallel. Just like people are running tracks... in parallel.

# Install
```sh
npm install --save koa-tracks
```

# Usage
The `koa-tracks` API is rather simple. The package returns a function that needs to be called with your middleware functions, to be executed in parallel.

## API
`tracks(...entries)`
* `entries` List of middleware functions to be executed

## Example
```js
const Koa = require("koa");
const tracks = require("koa-tracks");

const app = new Koa();

app.use(tracks(
    // Simple, common function that has no dependency on the results
    ctx => ctx.state.foo = {},

    // A middleware that calls a services and defines an
    // entry on the state object
    async ctx => {
        // Fetch to a service
        const data = await fetch("/path/to/service");
        ctx.state.data = data;
    },

    // Another middleware that needs to call another
    // service and define some data
    async ctx => {
        // Fetch to another service
        const data = await fetch("/another/path/to/service");
        ctx.state.anotherEntry = data;
    }
));

// Start your server
app.listen(8080);
```

All of them are going to be executed in parallel. That means you're saving time as all of them are doing a request at the same time.

# Things you should be aware of
## Errors
Under the hood `koa-tracks` simply does a `Promise.all` with the filtered entries. So, you need to properly handle a middleware when it errors. If not, the `Promise.all` call will be rejected.

# License
MIT