import * as React from 'react';
import { useEffect } from "react";
import { Octokit } from "octokit";
import { ActionType } from "../../types/types";
import { SnackbarProvider, useSnackbar } from "notistack";

const App = () => {
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const openCodeReviewLinks = () => {
      const links = document.querySelectorAll<HTMLLinkElement>('#issues_dashboard .Box .Box-row a.markdown-title');
      if (links) {
        links.forEach(link => {
          window.open(`${link.href}/files`, '_blank');
        })
      }
    }

    const finishReview = async () => {
      const href = window.location.href;
      const regexResult = /https:\/\/github.com\/(.+)\/(.+)\/pull\/(\d+).*/.exec(href);
      const owner = regexResult[1];
      const repo = regexResult[2];
      const pullNumber = Number.parseInt(regexResult[3]);

      const configuration = await chrome.storage.local.get();

      const octokit = new Octokit({
        auth: configuration.pat
      });

      await removeReviewLabel();

      const [reviews, comments] = await getReviewOrComments();

      await addFixLabel(reviews, comments);

      async function removeReviewLabel() {
        try {
          await octokit.request('DELETE /repos/{owner}/{repo}/issues/{issue_number}/labels/{name}', {
            owner: owner,
            repo: repo,
            issue_number: pullNumber,
            name: configuration.needReviewLabel,
          });
          enqueueSnackbar(`Remove ${ configuration.needReviewLabel } label successfully.`, { variant: "success" });
        } catch (e) {
          enqueueSnackbar(`Fail to remove ${ configuration.needReviewLabel } label.`, { variant: 'error' });
        }
      }

      async function getReviewOrComments() {
        let reviews = { data: [] };
        let comments = { data: [] };

        try {
          reviews = await octokit.request('GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews', {
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
        } catch (e) { /* empty */ }
        return [reviews, comments];
      }

      async function addFixLabel(reviews, comments) {
        try {
          if (reviews.data.length > 0 || comments.data.length > 0) {
            await octokit.request('POST /repos/{owner}/{repo}/issues/{issue_number}/labels', {
              owner: owner,
              repo: repo,
              issue_number: pullNumber,
              labels: [configuration.needFixLabel]
            })
            enqueueSnackbar(`Add ${configuration.needFixLabel} label successfully.`, { variant: "success" });
          }
        } catch (e) {
          enqueueSnackbar(`Fail to add ${configuration.needFixLabel} label.`, { variant: 'error' });
        }
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
  }, []);

  return <>
  </>;
};


const IntegrationNotistack = () => {
  return (
    <SnackbarProvider maxSnack={3}>
      <App />
    </SnackbarProvider>
  );
}

export default IntegrationNotistack;