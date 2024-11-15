
import express from "express";
import { WebhookEventDefinition } from "@octokit/webhooks/dist-types/types";
import { differenceInSeconds, format } from "date-fns";
import { appriseAlert } from "../utils/alert"

const router = express.Router();

router.post('/circleci', async function (req, res, next) {
    const data = req.body;

    const repo = data.project.name
    const time = format(new Date(data.workflow.created_at), 'yyyy-MM-dd HH:mm')
    const workflow = data.workflow.name
    const duration = differenceInSeconds(data.workflow.stopped_at, data.workflow.created_at)
    const success = data.workflow.status === 'success'

    const status = success ? '✅' : '❌'
    const title = `${status} [${repo}] ${workflow}`
    const logUrl = success ? "" : `🔗${data.workflow.url}`
    const body = `
    📦 Repo: ${repo}
    🚦 Workflow: ${workflow}
    📅 Time: ${time}
    👀 Status: ${status}
    ⏱ Duration: ${duration} seconds
    ${logUrl}
    `.trim()

    await appriseAlert({title, body});


    res.send({status: "ok"});
});

export default router;


