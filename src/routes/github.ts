import {WebhookEventDefinition} from "@octokit/webhooks/dist-types/types";
import {differenceInSeconds, format} from "date-fns";
import {appriseAlert} from "../utils/alert"

export async function dealGithubPayload(payload: { header: any, body: any }) {
  const {header, body} = payload;
  switch (header['x-github-event']) {
    case 'push':
      const alertData = PushEvent(body as WebhookEventDefinition<"push">);
      await appriseAlert(alertData);
      break;

    case 'workflow_run':
      if (body.action === 'completed') {
        const alertData = WorkflowRunEvent(body as WebhookEventDefinition<"workflow-run-completed">);
        await appriseAlert(alertData);
      }
      break;
    default:
      console.log('unknown event');
  }
}

function WorkflowRunEvent(data: WebhookEventDefinition<"workflow-run-completed">) {
  const repo = data.repository.name
  const time = format(new Date(data.workflow_run.created_at), 'yyyy-MM-dd HH:mm')
  const workflow = data.workflow_run.name
  const duration = differenceInSeconds(data.workflow_run.updated_at, data.workflow_run.created_at)
  const status = data.workflow_run.conclusion === 'success' ?
    '✅' : '❌'
  const title = `${status} [${workflow}] ${repo}`
  const body = `
📦 Repo: ${repo}
🚦 Workflow: ${workflow}
📅 Time: ${time}
👀 Status: ${status}
⏱ Duration: ${duration} seconds
`.trim()
  return {title, body}
}

function PushEvent(data: WebhookEventDefinition<"push">) {
  const repo = data.repository.name;
  const ref = data.ref;
  const branchName = ref.startsWith('refs/heads/') ? ref.slice(11) : ref;
  const pusher = data.pusher.name
  const timestamp = format(new Date(data.head_commit.timestamp), 'yyyy-MM-dd HH:mm')
  const commit_count = data.commits.length;
  const commit_details = data.commits.map((commit) => {
    return `- ${commit.message}`
  }).join('\n')
  const title = `🚀 [Push] ${repo}`
  const body = `
📦 Repo: ${repo}
🔀 Branch: ${branchName}
👤 Pusher: ${pusher}
📅 Time: ${timestamp}

🔄 Commits (${commit_count}):
${commit_details}
`.trim()
  return {title, body}
}
