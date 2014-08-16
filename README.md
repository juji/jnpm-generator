
#jnpm-generator
Is a simple npm project generator. Just a lazy way to start npm project.

- Install selected npm dependencies
- create README.md and add some initial content
- Automatically add remote git repo as `origin`
- Automatically add `node_modules/*` to `.gitignore`
- run `git add -A ./*` and `git commit -a -m "initial"`
- run `git push origin master`

##usage
```bash
jnpm

jnpm init
```

##saving to git repo
```bash
jnpm save
```
it does this:
```bash
git add -A ./* && git commit -a -m "Sat Aug 16 2014 14:45:41 GMT+0700 (WIB)"
```

```bash
jnpm save "commit message"
```
for
```bash
git add -A ./* && git commit -a -m "commit message"
```

##view the help content
```bash
jnpm help
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

