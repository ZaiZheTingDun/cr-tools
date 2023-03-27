import { ActionType } from "../types/types";
import { Octokit } from "octokit";

const openCodeReviewLinks = () => {
  const links = document.querySelectorAll<HTMLLinkElement>('#issues_dashboard .Box .Box-row a.markdown-title');
  if (links) {
    for (const link of links) {
      window.open(link.href, '_blank');
    }
  }
}

const finishReview = async () => {
  const href = window.location.href;
  const regexResult = /https:\/\/github.com\/(.+)\/(.+)\/pull\/(\d+).*/.exec(href);
  const owner = regexResult[1];
  const repo = regexResult[2];
  const pullNumber = regexResult[3];

  const configuration = await chrome.storage.local.get();

  const octokit = new Octokit({
    auth: configuration.pat
  });

  await octokit.request('DELETE /repos/{owner}/{repo}/issues/{issue_number}/labels/{name}', {
    owner: owner,
    repo: repo,
    issue_number: pullNumber,
    name: configuration.needReviewLabel,
  });

  let comments = { data: [] };

  const reviews = await octokit.request('GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews', {
    owner: owner,
    repo: repo,
    pull_number: pullNumber,
  });

  if (reviews.data.length === 0) {
    comments = await octokit.request('GET /repos/{owner}/{repo}/pulls/{pull_number}/comments', {
      owner: owner,
      repo: repo,
      pull_number: pullNumber,
    });
  }

  if (reviews.data.length > 0 || comments.data.length > 0) {
    await octokit.request('POST /repos/{owner}/{repo}/issues/{issue_number}/labels', {
      owner: owner,
      repo: repo,
      issue_number: pullNumber,
      labels: [configuration.needFixLabel]
    })
  }
}

chrome.runtime.onMessage.addListener(
  async (request: { actionType: ActionType }) => {
    switch (request.actionType) {
      case ActionType.OpenAllItems:
        openCodeReviewLinks();
        break;
      case ActionType.FinishReview:
        await finishReview();
        break;
      default:
    }
  }
);