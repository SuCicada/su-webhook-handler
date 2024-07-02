import express from "express";

const router = express.Router();
import {WebhookEventDefinition} from "@octokit/webhooks/dist-types/types";

import {Webhooks} from "@octokit/webhooks";
import * as fs from "node:fs";
import {dealGithubPayload} from "./github";


router.post('/github', async function (req, res, next) {
  let payload = {
    header: req.headers,
    body: req.body
  }
  // console.log(payload);
  // let filename = `data/data${new Date().getTime()}.json`;
  // fs.writeFileSync(filename, JSON.stringify(payload, null, 2));

  await dealGithubPayload(payload)
  res.send({status: "ok"});
  // res.render('index', { title: 'Express' });
// let a = {} as WebhookEventDefinition<"push">;
// a.pusher
});

export default router;
