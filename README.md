#jnpm-generator
Is a simple npm project generator

- run `npm init`
- Install selected npm dependencies
- Automatically add remote git repo
- Automatically add `node_modules/*` to `.gitignore`
- Automatically allow `git push` to push `master` branch into `origin`
- do initial push to `origin` as `git push origin master`

##usage
```bash
jnpm init
```

##install
```bash
sudo npm install -g jnpm-generator
```

Directory Structure
```plaintext
.
+--	.gitignore
+--	package.json
+-- .git
|	+--	config
|	+-- *otherGitStuff*
+-- index.js
```

