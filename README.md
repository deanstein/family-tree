# Family Tree

An interactive family tree web app with support for a radial tree view and a timeline view.

## Secure Access Overview
In the backend, Family Tree Data is modified via a GitHub App (Family Tree Commit Bot) authorized with read and write access to this repo. The token for the FamilyTreeDataCommitBot is retrieved securely via a Cloudflare worker.

On the frontend, the Family Tree App requires editors of the private Family Tree Data to "authenticate" themselves by entering their name and birthdate, which is checked against known members of the tree to prevent anonymous usage.

See detailed steps in the private [Family Tree Data](https://github.com/deanstein/family-tree) repo.