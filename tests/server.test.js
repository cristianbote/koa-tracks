import test from "ava";
import Koa from "koa";
import tracks from "../index";

const createServer = (middleware) => {
    const app = new Koa();
    app.use(middleware);
    return app;
};

test.only("tracks: koa server", async t => {
    const tracksMiddleware = tracks(
        ctx => ctx.state.foo = true
    );

    const app = createServer(tracksMiddleware);
    const fn = app.callback();

    await fn({ url: "/" }, { setHeader: () => {}, end: () => {} });

    t.is(app.context.state, {});
});