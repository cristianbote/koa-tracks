import test from "ava";
import Koa from "koa";
import request from "supertest";
import tracks from "../index";

const sleep = ms => new Promise(r => setTimeout(r, ms));

test("tracks: koa server", async t => {
    const app = new Koa();

    app.use(tracks(
        ctx => {
            ctx.state.foo = true;
        },
        async ctx => {
            await sleep(100);
            ctx.state.baz = true;
        }
    ))

    app.use(ctx => {
        ctx.body = ctx.state;
    });

    const server = app.listen();

    const data = await request(server)
        .get("/");

    t.is('{"foo":true,"baz":true}', data.text);
});