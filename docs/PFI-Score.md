# 📊 Personal Fairness Index (PFI) Score System

## Overview

The **Personal Fairness Index (PFI)** is automatically calculated and updated based on your GitHub contributions. Every time you push code to a repository with the FairCoin webhook configured, your PFI score increases based on the meaningful words you contribute.

![PFI Score Auto Update](auto%20pfi-score.jpg)

## 🔄 Automatic Score Updates

### How It Works

Your PFI score is **automatically updated** when you push code to GitHub:

1. **You push code** → GitHub sends webhook notification
2. **System analyzes** → Counts meaningful words in your changes
3. **Score updates** → PFI automatically increases
4. **Database records** → All contributions are tracked

**No manual intervention required!** Just push your code and your PFI grows.

## 📐 PFI Score Formula

```
PFI-Score = 1/1000 * words

In other words:
1 word = 1/1000 PFI-Score = 0.001 PFI-Score
1,000 words = 1/1000 * 1,000 = 1.000 PFI-Score
```

### Calculation Examples

| Words Contributed | PFI-Score Earned | Calculation |
|------------------|------------------|-------------|
| 100 words | 0.100 PFI-Score | 1/1000 * 100 = 0.100 |
| 500 words | 0.500 PFI-Score | 1/1000 * 500 = 0.500 |
| 1,000 words | 1.000 PFI-Score | 1/1000 * 1,000 = 1.000 |
| 2,500 words | 2.500 PFI-Score | 1/1000 * 2,500 = 2.500 |
| 5,000 words | 5.000 PFI-Score | 1/1000 * 5,000 = 5.000 |
| 10,000 words | 10.000 PFI-Score | 1/1000 * 10,000 = 10.000 |

## 📝 What Words Are Counted?

The system intelligently analyzes your git diff and counts only **meaningful contributions**:

### ✅ Counted Words

- **Variable names**: `userName`, `totalPrice`, `calculateSum`
- **Function names**: `processPayment()`, `validateInput()`, `fetchData()`
- **Class names**: `UserService`, `PaymentController`
- **String content**: `"Welcome to FairCoin"` = 3 words
- **Comments**: `// Calculate total revenue` = 3 words
- **Documentation**: README updates, code comments
- **New code lines**: All additions to the codebase

### ❌ NOT Counted

- **Language keywords**: `function`, `return`, `const`, `if`, `else`, `var`
- **Import statements**: `import React from 'react'`
- **Syntax symbols**: `{}`, `()`, `[]`, `;`, `=`, `+`, `-`
- **Deleted lines**: Only additions count, not removals
- **Whitespace**: Empty lines and formatting

## 🚀 Quick Start Guide

### Step 1: Configure Webhook (One-Time Setup)

1. Navigate to your GitHub repository settings:
   ```
   https://github.com/YOUR_USERNAME/YOUR_REPO/settings/hooks
   ```

2. Click **"Add webhook"**

3. Configure webhook:
   - **Payload URL**: `https://bixio.xyz/github/webhook`
   - **Content type**: `application/json`
   - **Secret**: `****`
   - **Events**: ✅ Just the push event
   - **Active**: ✅ Enabled

4. Click **"Add webhook"**

### Step 2: Push Your Code

```bash
# Make your changes
git add .
git commit -m "Implement new feature"
git push origin main
```

### Step 3: Watch Your PFI Grow! 🌟

Your PFI score updates **automatically** within seconds of pushing.

## 📊 View Your PFI Score

### Via API

```bash
GET https://bixio.xyz/github/api/users/YOUR_GITHUB_ID
```

**Response:**
```json
{
  "github_id": 41584622,
  "username": "jonipwi",
  "pfi_score": 28.717,
  "total_words": 28717,
  "commit_count": 7,
  "created_at": "2025-11-11T10:30:00Z",
  "updated_at": "2025-11-11T20:15:00Z"
}
```

### Via Web Dashboard

Visit the FairCoin PFI Tracker:
```
https://bixio.xyz/github/?github_id=YOUR_GITHUB_ID
```

Or search by username:
```
https://bixio.xyz/github/
```

## 🎯 Real-World Example

Let's say you push this JavaScript function:

```javascript
// Calculate user subscription total
function calculateSubscriptionTotal(userId, planType) {
    const basePlan = getPlanPrice(planType);
    const userDiscount = getUserDiscount(userId);
    const finalTotal = basePlan - userDiscount;
    return finalTotal;
}
```

**Word Count Breakdown:**
- Comment: `Calculate`, `user`, `subscription`, `total` = 4 words
- Function name: `calculateSubscriptionTotal` = 1 word
- Parameters: `userId`, `planType` = 2 words
- Variables: `basePlan`, `getPlanPrice`, `userDiscount`, `getUserDiscount`, `finalTotal` = 5 words

**Total**: ~12 meaningful words → **0.012 PFI-Score** (calculated as: 1/1000 * 12 = 0.012)

## 🏆 Benefits of Automatic PFI Tracking

1. **🎯 Fair & Transparent**: Only meaningful contributions count
2. **⚡ Real-time Updates**: Instant score updates on every push
3. **📈 Motivation**: Watch your score grow with quality contributions
4. **🤝 Community Recognition**: Compare with other developers
5. **🔒 Secure & Verifiable**: All calculations are automatic and traceable
6. **🌍 Multi-Repository**: Track contributions across all your repos

## 📊 PFI Score Uses

Your PFI score represents your contribution to the FairCoin ecosystem and can be used for:

- **Governance Weight**: Higher PFI = more influence in community decisions
- **Reputation Building**: Showcase your commitment to fair development
- **Community Recognition**: Top contributors get visibility
- **Future Benefits**: Potential rewards and recognition programs

## 🔐 Security & Privacy

- PFI scores are calculated server-side (tamper-proof)
- All webhook communications are encrypted (HTTPS)
- Secret key validates webhook authenticity
- Your GitHub ID is the only identifier needed
- All data is stored securely in the database

## 🌐 Multiple Repositories

You can add the FairCoin webhook to **multiple repositories**:
- ✅ Each push to any repo earns PFI
- ✅ All contributions tracked under your GitHub ID
- ✅ PFI accumulates across all repositories
- ✅ One score represents all your work

## 📈 Growth Tracking

Your PFI score history is maintained:
- **Total PFI**: Cumulative score across all commits
- **Total Words**: All meaningful words contributed
- **Commit Count**: Number of pushes processed
- **Timeline**: When you started and last contributed

## 💡 Tips for Maximizing PFI

1. **Write meaningful code**: Quality variable/function names
2. **Add comments**: Explain complex logic
3. **Document your work**: Update README files
4. **Write comprehensive code**: Build features thoroughly
5. **Contribute regularly**: Consistent commits build your score
6. **Focus on value**: Meaningful contributions over quantity

## 🔄 Score Update Process

```
┌─────────────┐
│  Git Push   │
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│ GitHub Webhook  │
└──────┬──────────┘
       │
       ▼
┌──────────────────┐
│  FairCoin API    │
│  - Parse diff    │
│  - Count words   │
│  - Calculate PFI │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│  Database Update │
│  - Add PFI       │
│  - Log commit    │
│  - Update stats  │
└──────────────────┘
```

## 🆘 Troubleshooting

### My PFI isn't updating

1. Check webhook is configured correctly
2. Verify webhook secret matches
3. Ensure webhook is active
4. Check GitHub webhook delivery logs
5. Confirm you're pushing to the main branch

### How to verify webhook is working

1. Go to repository settings → Webhooks
2. Click on your webhook
3. Check "Recent Deliveries" tab
4. Should see green checkmarks ✅

### Where to get help

- Check the [GitHub API README](../github-api/README.md)
- Visit the FairCoin community
- Open an issue on GitHub

## 📜 Technical Details

- **Calculation**: Server-side word counting algorithm
- **Storage**: PostgreSQL database with DECIMAL(20,6) precision
- **Update Frequency**: Real-time on every push
- **API**: RESTful endpoints for score retrieval
- **Webhook**: GitHub standard webhook v3

## 🌟 Summary

The PFI scoring system is designed to be:
- **Automatic**: No manual tracking needed
- **Fair**: Only meaningful contributions count
- **Transparent**: Clear formula and calculation
- **Motivating**: See your impact grow with every contribution
- **Secure**: Server-side processing prevents gaming

---

**Start Contributing Today!** 

Every meaningful line of code you write contributes to your Personal Fairness Index. Push your code and watch your PFI grow automatically!

```
PFI-Score = 1/1000 * words
Every push counts. Every contribution matters.
```

**Light & Truth, Love & Mercy, Just & Peace** 🌟

---

*Last Updated: November 11, 2025*  
*FairCoin by JacobYellowBridge*
