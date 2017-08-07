# Recorder Mixmax Enhancement

This is an open source Mixmax Enhancement for recording and sending audio. Based on the original [Giphy Mixmax Enhancement](https://github.com/mixmaxhq/giphy-mixmax-app).

## Running locally

1. Install using `npm install`
2. Run using `npm start`

To test the editor locally, go to <https://localhost:8910/editor> in your browser.

## Enhancement Config Options for Testing

| Option               | Value                               |
| ---------------------------------------------------------- |
| Name                 | Audio Recording                     |
| Icon Tooltip         | Records audio                       |
| Editor URL           | https://localhost:8910/editor       |
| Editor window height | 400                                 |
| Editor window width  | 400                                 |
| Resolver API URL     | https://localhost:8910/api/resolver |

## Why do we run it in https locally?

Mixmax slash command APIs are required to be served over https. This is because they are queried directly from the Mixmax client in the browser (using AJAX) that's running on an HTTPS domain. Browsers forbid AJAX requests from https domains to call http APIs, for security. So we must run an https server with a locally-signed certificate.

See [here](http://developer.mixmax.com/docs/integration-api-appendix#local-development-error-neterr_insecure_response) for how to fix the **ERR_INSECURE_RESPONSE** error that you might get in Chrome.
