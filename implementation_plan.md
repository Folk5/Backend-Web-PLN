# Implementation Plan: Fix File & Database Deletion Cleanup

This plan addresses the issue where deleting or updating records in the database does not fully clean up associated files in Supabase Storage (`assets-3d` for models and `images` for thumbnails).

## User Review Required

> [!IMPORTANT]
> This change will involve fetching records before deletion to ensure we have the correct file URLs to remove from Storage. This adds a slight overhead to delete operations but ensures the storage doesn't get cluttered with orphaned files.

## Proposed Changes

### Backend: `controllers/dataController.js`

#### [MODIFY] [dataController.js](file:///d:/Project%20Magang%20PLN/Backend-Intern-PLN/controllers/dataController.js)

1.  **Generalize `extractStoragePath`**:
    *   Update the function to extract paths for any bucket by detecting the placeholder in the URL.
2.  **Enhance `deleteModule`**:
    *   Fetch the `modules` record to get the `image` URL.
    *   If `image` exists, delete it from the `images` bucket.
    *   Continue with existing asset deletion from `assets-3d`.
3.  **Enhance `deleteMaterial`**:
    *   Fetch the `materials` record to get the `image` URL.
    *   If `image` exists, delete it from the `images` bucket.
    *   Continue with existing asset deletion from `assets-3d`.
4.  **Enhance `deleteTool`**:
    *   Fetch the `tools` record to get both `image` and `file3d`.
    *   Delete `image` from the `images` bucket.
    *   Delete `file3d` from the `assets-3d` bucket.
5.  **Fix `updateTool`**:
    *   Ensure it also handles `image` cleanup when a new thumbnail is uploaded (similar to how it handles `file3d`).

---

## Open Questions

- **Bucket Names**: I am assuming the buckets are exactly `assets-3d` and `images`. Are there any other hidden buckets?

## Verification Plan

### Automated Tests
- I will use `curl` or a test script to trigger deletions and then check if the Supabase Storage files are actually gone (by trying to access their public URLs which should return 404).

### Manual Verification
- Testing through the Admin Panel UI:
    1. Upload a module with a thumbnail and a 3D file.
    2. Note the URLs.
    3. Delete the module.
    4. Verify the URLs are no longer accessible.
