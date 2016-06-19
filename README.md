# azdavis.xyz

a place for stuff http://azdavis.xyz

## first-time setup

- `make npm-i-g` installs some global [npm][npm] packages
- `surge login` prepares deployment to [surge][sur]

## testing, building and deploying

- `make` builds all html files and their dependencies (css, js)
- `./server` does the following:
    - start a server on port 8080 with `ruby -e` (see [web-servers][web])
    - `open` your default browser to http://localhost:8080
    - run `make` every 2 seconds (basically pseudo-filewatching)
- `make deploy` does the following:
    - ensure `git status` has no output
    - `git checkout` the master branch
    - `make` everything which is not up-to-date
    - `git push` master to origin
    - `surge .` all built files, images, etc.

## {con,per}formance

- [w3 validator][w3v]
- [pagespeed insights][pag]

[npm]: https://www.npmjs.com
[sur]: https://surge.sh
[web]: https://gist.github.com/willurd/5720255
[w3v]: https://validator.w3.org/nu/?doc=http://azdavis.xyz
[pag]: https://developers.google.com/speed/pagespeed/insights/?url=http://azdavis.xyz
