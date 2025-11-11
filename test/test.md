# How Git Push Gives PFI to Users [TEST WEBHOOK: Word Count]

## Overview

Every time you push code to a GitHub repository with the FairCoin webhook configured, you automatically earn **Personal Fairness Index (PFI)** points based on the meaningful words you contribute.

## How It Works

### 1. **Make Changes & Commit**
```bash
# Edit your code
echo "function calculateTotal() { return x + y; }" > myfile.js

# Commit
git add myfile.js
git commit -m "Add calculateTotal function"

# Push to GitHub
git push origin main
```

### 2. **GitHub Sends Webhook**
When you push, GitHub automatically sends a POST request to:
```
https://bixio.xyz/github/webhook
```

The webhook contains:
- Your GitHub ID (e.g., `41584622`)
- Commit details
- Changed files
- Git diff (what changed)

### 3. **Smart Word Counting**
The API analyzes your git diff and counts only **meaningful words**:

**✅ Counted:**
- Variable names: `calculateTotal`, `userName`, `totalPrice`
- Function names: `processPayment`, `validateInput`
- String content: `"Hello World"` = 2 words
- Comments: `// This is important` = 3 words
- New code you wrote

**❌ NOT Counted:**
- Import statements: `import React from 'react'`
- Language keywords: `function`, `return`, `const`, `if`
- Syntax symbols: `{}`, `()`, `;`, `=`
- Deleted lines (only additions count)

### 4. **PFI Calculation**
```
PFI Score = Total Words ÷ 1,000
```

**Examples:**
- 500 words → **+0.500 PFI**
- 1,000 words → **+1.000 PFI**
- 5,000 words → **+5.000 PFI**
- 10,000 words → **+10.000 PFI**

### 5. **Database Update**
The API automatically:
1. Creates or finds your user record (by GitHub ID)
2. Adds the new PFI points to your total
3. Records the commit in the database
4. Updates your word count and stats

## Example Scenario

**You push this code:**
```javascript
// User authentication helper
function authenticateUser(username, password) {
    const hashedPassword = hashPassword(password);
    return database.findUser(username, hashedPassword);
}
```

**Word count breakdown:**
- `User authentication helper` = 3 words
- `authenticateUser` = 1 word (meaningful variable)
- `username` = 1 word
- `password` = 1 word
- `hashedPassword` = 1 word
- `hashPassword` = 1 word (function name)
- `database` = 1 word
- `findUser` = 1 word

**Total:** ~10 meaningful words = **+0.010 PFI**

## View Your PFI

After pushing, check your score:

**API Endpoint:**
```
https://bixio.xyz/github/api/users/41584622
```

**Dashboard:**
```
https://bixio.xyz/github/?github_id=41584622
```

**Response:**
```json
{
  "github_id": 41584622,
  "username": "jonipwi",
  "pfi": 15.750,
  "total_words": 15750,
  "commit_count": 42,
  "created_at": "2025-11-11T10:30:00Z",
  "updated_at": "2025-11-11T20:15:00Z"
}
```

## Setup Webhook (One-Time)

1. Go to your repository settings:
   ```
   https://github.com/jonipwi/your-repo/settings/hooks
   ```

2. Click **"Add webhook"**

3. Configure:
   - **Payload URL:** `https://bixio.xyz/github/webhook`
   - **Content type:** `application/json`
   - **Secret:** `Gd9OT7xe3s1QLCa2DPJIUcmwFofv8p50iXYrtWZA`
   - **Events:** ✅ Just the push event
   - **Active:** ✅ Enabled

4. Save webhook

5. Make a test push - your PFI tracking starts automatically!

## Multiple Repositories

You can add the webhook to multiple repositories:
- Each push to any repository earns you PFI
- All contributions are tracked under your GitHub ID
- PFI accumulates across all your repos

## Leaderboard

The more quality code you write, the higher your PFI score:
- Top contributors get higher PFI
- PFI reflects your actual code contributions
- Quality over quantity (meaningful words only)

## Benefits of PFI

- 🎯 **Fair Measurement:** Only meaningful contributions count
- 📊 **Transparent:** All calculations are automatic and verifiable
- 🚀 **Motivating:** See your score grow with each commit
- 🤝 **Community:** Compare with other developers
- ⚡ **Real-time:** Instant updates on every push

## Formula Summary

```
Every Git Push → Word Count → PFI Score

1 word = +1/1000 PFI
1000 words = +1.000 PFI

Your Total PFI = Sum of all commits
```

---

**Start earning PFI today!** Just push your code and watch your Personal Fairness Index grow. 🌟


**Light & Truth, Love & Mercy, Just & Peace**

