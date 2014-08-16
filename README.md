
#jnpm-generator
Is a simple npm project generator. Just a lazy way to start npm project.

##For CLI or module projects
- Install your selected npm dependencies
- create your "main" js file
- create README.md with initial content
- Automatically initialize git, and add remote 'origin' read from package.json
- Do initial commit and push

##usage
```bash
jnpm  # or 
jnpm init

# install npm modules
# create "main" script read from package.json
# create README.md
# initialize git
# add new 'origin' read from package.json
# create .gitignore file with "node_modules/*"
# do initial commit and push.
```

### add and commit
```bash
jnpm commit  # or
jnpm commit "commit message"

# git add .
# git commit -am "your message"
```

### add, commit and push
```bash
jnpm push  # or
jnpm push "commit message"

# git add .
# git commit -am "your message"
# git push
```

### view help
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

