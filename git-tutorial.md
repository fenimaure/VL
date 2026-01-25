# 🛠️ Git & GitHub Mastery Guide

This guide will help you manage your code like a professional and deploy it to platforms like Netlify.

---

## 🏗️ 1. Initial Setup

If you haven't already, install Git from [git-scm.com](https://git-scm.com/).

### Configure your identity
Open your terminal and run:
```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

---

## 🚀 2. Saving Your Work (Local)

### Initialize a new repository 
*(Only do this once per project if it doesn't have Git yet)*
```bash
git init
```

### Check status
See which files have changed:
```bash
git status
```

### Stage changes
Prepare files for saving:
```bash
git add .
```

### Commit
Save your staged changes with a meaningful message:
```bash
git commit -m "feat: implement award-winning footer design"
```
> **Pro Tip:** Use prefixes like `feat:`, `fix:`, `docs:`, or `style:`.

---

## 🌐 3. Connecting to GitHub (Remote)

1.  Create a new repository on [GitHub](https://github.com/new).
2.  Leave it empty (don't add README, license, or .gitignore).
3.  Copy the remote URL (e.g., `https://github.com/yourusername/your-repo.git`).

### Link your local repo to GitHub
```bash
git remote add origin https://github.com/yourusername/your-repo.git
```

### Rename your branch to main
```bash
git branch -M main
```

### Push for the first time
```bash
git push -u origin main
```

---

## 🔄 4. Daily Workflow

Whenever you finish a feature or fix:
```bash
git add .
git commit -m "Your message"
git push
```

---

## 🌿 5. Working with Branches

Branches allow you to work on new features without breaking the "Main" site.

### Create and switch to a new branch
```bash
git checkout -b feature/new-hero-animation
```

### Merge back to main
1.  Finish your work and commit.
2.  Switch to main: `git checkout main`
3.  Pull latest: `git pull origin main`
4.  Merge: `git merge feature/new-hero-animation`
5.  Push main: `git push origin main`

---

## 🛠️ 6. Common Troubleshooting

### "Permission Denied"
Ensure you are logged into GitHub CLI (`gh auth login`) or have set up your Personal Access Token (PAT).

### "Merge Conflicts"
If Git doesn't know how to combine files, it will mark them. Open the files, choose the correct code, remove the markers (`<<<<`, `====`, `>>>>`), and then commit.

### Discard local changes (Be careful!)
```bash
git checkout -- .
```

---

**Happy Coding!** 🚀
