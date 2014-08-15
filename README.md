#jnpm-generator
Is a simple npm project generator

- Install selected npm dependencies
- create README.md and add some initial content
- Automatically add remote git repo as `origin`
- Automatically add `node_modules/*` to `.gitignore`
- run `git add -A ./*` and `git commit -a -m "initial"`
- run `git push origin master`

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
+-- README.md
```

