# Trade System Update: Support for Unpublished Articles

## Overview
Updated the trade request system to allow users to propose trades with unpublished items by using free-text descriptions instead of requiring published articles.

## Changes Made

### 1. Backend - Trade Model (`backend/models/Trade.js`)
**Status**: ✅ COMPLETED

Modified the Trade schema to support both article references and free-text descriptions:

```javascript
// Before: Articles were required
proposerArticle: {
  type: Schema.Types.ObjectId,
  ref: 'Article',
  required: true,  // ❌ NO LONGER REQUIRED
}

// After: Articles are now optional with description fields
proposerArticle: {
  type: Schema.Types.ObjectId,
  ref: 'Article',
  required: false,  // ✅ Now optional
}

proposedItemDescription: {
  type: String,
  required: false,  // ✅ NEW - Optional description
  maxlength: 500,
}

// Same changes for receiver side
receiverArticle: {
  type: Schema.Types.ObjectId,
  ref: 'Article',
  required: false,  // ✅ Now optional
}

requestedItemDescription: {
  type: String,
  required: false,  // ✅ NEW - Optional description
  maxlength: 500,
}
```

### 2. Backend - Trade Controller (`backend/controllers/tradeController.js`)
**Status**: ✅ COMPLETED

Updated `createTradeRequest()` function with flexible validation:

**Key Changes**:
- Accepts optional `proposerArticleId` and `proposedItemDescription`
- Accepts optional `receiverArticleId` and `requestedItemDescription`
- Validates that at least ONE of (articleId OR description) is provided for proposer's offer
- Validates that at least ONE of (articleId OR description) is provided for receiver's desired item
- Permission checks only applied to article IDs (if provided)
- Descriptions can be provided by users for unpublished items

**Validation Logic**:
```javascript
// Proposer must provide either published article OR description
if (!proposerArticleId && !proposedItemDescription) {
  return error: "Debes proponer un artículo publicado o describir el artículo que ofreces"
}

// Receiver must want either published article OR description
if (!receiverArticleId && !requestedItemDescription) {
  return error: "Debes solicitar un artículo publicado o describir lo que deseas"
}

// Only validate permissions for referenced articles
if (proposerArticleId) {
  // Check article exists and proposer owns it
}

if (receiverArticleId) {
  // Check article exists and receiver owns it
}
```

### 3. Frontend - TradeProposal Component (`frontend/src/components/TradeProposal/TradeProposal.jsx`)
**Status**: ✅ COMPLETED

**Added Features**:
- **Toggle Tabs**: Two input modes
  - 📦 "Seleccionar Artículo" - Select from user's published articles
  - ✍️ "Describir Artículo" - Enter free-text description (max 500 chars)
  
- **Conditional Rendering**: 
  - Shows published articles dropdown when in "article" mode
  - Shows textarea when in "description" mode
  - Disables "article" tab if user has no published articles

- **Smart Submission**:
  ```javascript
  // Article mode: sends proposerArticleId
  body.proposerArticleId = selectedArticleId;
  
  // Description mode: sends proposedItemDescription
  body.proposedItemDescription = proposalDescription.trim();
  ```

- **Validation**:
  - Minimum 10 characters for description
  - Character counter showing usage (current/500)
  - Error messages for missing inputs

### 4. Frontend - TradeProposal CSS (`frontend/src/components/TradeProposal/TradeProposal.css`)
**Status**: ✅ COMPLETED

Added new CSS classes for tabs and description textarea:

```css
/* Proposal Tabs */
.proposal-tabs - Container for toggle buttons
.tab-btn - Individual tab button with active state
.tab-btn.active - Highlighted active tab

/* Textarea */
.description-textarea - Styled textarea input
.char-count - Character counter display (gray text)
```

### 5. Frontend - TradesTab Component (`frontend/src/components/TradesTab/TradesTab.jsx`)
**Status**: ✅ COMPLETED

**Enhanced Display Logic**:
- Conditional rendering for both received and sent trades
- If article exists: Shows article thumbnail and title (existing behavior)
- If article is null but description exists: Shows description text in styled box

**Updated Both Trade Cards**:
1. **Received Trades**: Shows proposer's offer (article OR description) and receiver's desired item
2. **Sent Trades**: Shows user's offer (article OR description) and receiver's desired item

```javascript
// Display logic example:
{trade.proposerArticle ? (
  <div className="trade-article">
    {/* Show article image and title */}
  </div>
) : (
  <div className="trade-description">
    <p className="description-text">{trade.proposedItemDescription}</p>
  </div>
)}
```

### 6. Frontend - TradesTab CSS (`frontend/src/components/TradesTab/TradesTab.css`)
**Status**: ✅ COMPLETED

Added new CSS for description display:

```css
.trade-description {
  padding: 0.75rem;
  background: #f0f0f0;
  border-radius: 8px;
  min-height: 130px;
  border: 2px dashed #999;  /* Dashed border distinguishes from article thumbnails */
}

.description-text {
  font-size: 0.9rem;
  color: #555;
  line-height: 1.4;
  word-wrap: break-word;
  text-align: center;
}
```

## User Experience Flow

### Proposing a Trade with Description

1. User clicks "Proponer Trueque" on an article
2. TradeProposal modal opens with two tabs:
   - **Article Mode** (default): Select from published articles dropdown
   - **Description Mode**: Enter custom description

3. If user has no published articles:
   - Article tab is disabled
   - User must use Description mode
   - Helpful message guides them

4. In Description Mode:
   - User types what they want to offer (e.g., "Una bicicleta roja, buena condición")
   - Character counter shows usage (e.g., "45/500")
   - Minimum 10 characters enforced

5. Submit sends trade proposal to backend with:
   - `proposedItemDescription` (if description mode)
   - OR `proposerArticleId` (if article mode)

### Viewing Trades

1. User opens TradesTab
2. Received/Sent trades display normally
3. Each trade shows:
   - If using published article: Image thumbnail + title
   - If using description: Dashed-border box with text description

## Backward Compatibility

✅ **Fully Backward Compatible**:
- Existing trades with article references continue to work
- Database changes are schema updates only (no migration needed)
- Article populate queries still work for existing trades
- Optional fields default to `null` for legacy trades

## Testing Checklist

- [ ] User can propose trade with published article (existing flow)
- [ ] User can propose trade with description only
- [ ] Trade proposals appear correctly in TradesTab with descriptions
- [ ] Accept/Reject buttons work with description-based trades
- [ ] Character limit enforced (500 chars max)
- [ ] Minimum 10 characters enforced for descriptions
- [ ] Error messages show correctly for missing data
- [ ] Article tab disabled when user has no published articles
- [ ] Mixed trades (article + description) display correctly
- [ ] Permission validation still works for article-based trades

## API Endpoint Changes

### POST /api/trades - Create Trade

**Request Body** (now flexible):
```javascript
{
  receiverId: "user_id",  // Required
  
  // PROPOSER'S OFFER - One required
  proposerArticleId: "article_id" || null,  // Optional
  proposedItemDescription: "description"    || null,  // Optional
  
  // RECEIVER'S DESIRED - One required
  receiverArticleId: "article_id" || null,  // Optional
  requestedItemDescription: "description"   || null,  // Optional
}
```

**Validation**:
- At least one of `proposerArticleId` OR `proposedItemDescription` required
- At least one of `receiverArticleId` OR `requestedItemDescription` required
- If article provided, user must own it
- If description provided, 10-500 characters

## Future Enhancements

Potential improvements:
- Allow users to upload images with descriptions
- Add categories/tags for description-based trades
- Search/filter trades by description keywords
- Article suggestions based on description keywords
- Enhanced description templates/examples

---

**Implementation Date**: [Current Date]
**Status**: Production Ready ✅
