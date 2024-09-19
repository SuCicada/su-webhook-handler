import express from "express";

const router = express.Router();
const testRouter = express.Router();
import {WebhookEventDefinition} from "@octokit/webhooks/dist-types/types";

import {Webhooks} from "@octokit/webhooks";
import * as fs from "node:fs";
import {dealGithubPayload} from "./github";

const APPRISE = true

router.post('/github-test', async function (req, res, next) {
  const data = req.body;
  req.headers = data.header
  req.body = data.body
  req.url = '/github'; // 修改请求的 URL
  next();
})

router.post('/github', async function (req, res, next) {
  console.log("github webhook", req.headers['x-github-event']);
  if (APPRISE) {
    let payload = {
      header: req.headers,
      body: req.body
    }
    // console.log(payload);
    // let filename = `data/data${new Date().getTime()}.json`;
    // fs.writeFileSync(filename, JSON.stringify(payload, null, 2));

    await dealGithubPayload(payload)
  }else{
    const headers = { ...req.headers };
    delete headers['host'];
    delete headers['content-length'];
    delete headers['connection'];

    let response = await fetch("", {
      method: 'POST',
      headers: headers as any,
      body: JSON.stringify(req.body),
    })
    const res = await response.text();
    // return res;
    console.log("res: ",response.status, res);
  }
  res.send({status: "ok"});
  // res.render('index', { title: 'Express' });
// let a = {} as WebhookEventDefinition<"push">;
// a.pusher
});

export default router;
