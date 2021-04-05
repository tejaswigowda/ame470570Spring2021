# Assignment 7
`Due Apr 7th, before midnight`

## Task
Deploy the attached simple image uploader(in `code` folder), over https using
AWS EC2.

## Usage

1. Make a copy of the code handout.
2. Edit `https.js`.
3. Edit bucket name in `server.js`
4. `chmod +x portmap.sh`
5. `./portmap.sh`
6. In EC2 'Security Groups' open ports 80,8080,443,8443
7. Create a user in AWS IAM (enable S3 full access)
8. Add user credentials in `credentials.json` (make sure you delete `.gitignore`)
9. Change url in `public/index.html`
10. `forever start https.js`


## Todo
Please update your server IP here:
https://docs.google.com/spreadsheets/d/1pOQ2wcAATS2DCj23t4shKJZCnsfEweSIgrabg-QK1iw/edit?usp=sharing

