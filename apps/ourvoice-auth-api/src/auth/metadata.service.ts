import UserMetadata from 'supertokens-node/recipe/usermetadata';

export async function addEmailToAllowlist(email: string) {
  const existingData = await UserMetadata.getUserMetadata('emailAllowList');
  let allowList: string[] = existingData.metadata.allowList || [];
  allowList = [...allowList, email];
  await UserMetadata.updateUserMetadata('emailAllowList', {
    allowList,
  });
}
export async function addEmailsToAllowlist(emails: string[]) {
  const existingData = await UserMetadata.getUserMetadata('emailAllowList');
  let allowList: string[] = existingData.metadata.allowList || [];
  allowList = [...allowList, ...emails];
  await UserMetadata.updateUserMetadata('emailAllowList', {
    allowList,
  });
}

export async function clearEmailAllowList() {
  await UserMetadata.clearUserMetadata('emailAllowList');
}

export async function isEmailAllowed(email: string) {
  const existingData = await UserMetadata.getUserMetadata('emailAllowList');
  const allowList: string[] = existingData.metadata.allowList || [];
  // NOTE: if allowlist is empty then this feature is disabled
  return allowList.includes(email) || allowList.length === 0;
}
// NOTE: using phoneNumberAllowList as a storage for storing moderators list in supertokens
// in the future this could be moved to admin/deployment database or if supertokens extends
// functionality to allow custom storages of metadata not linked to user
export async function addModeratorsToAllowlist(moderators: string[]) {
  const existingData = await UserMetadata.getUserMetadata(
    'phoneNumberAllowList',
  );
  let allowList: string[] = existingData.metadata.allowList || [];
  allowList = [...allowList, ...moderators];
  await UserMetadata.updateUserMetadata('phoneNumberAllowList', {
    allowList,
  });
}

export async function addModeratorToAllowlist(moderator: string) {
  const existingData = await UserMetadata.getUserMetadata(
    'phoneNumberAllowList',
  );
  let allowList: string[] = existingData.metadata.allowList || [];
  allowList = [...allowList, moderator];
  await UserMetadata.updateUserMetadata('phoneNumberAllowList', {
    allowList,
  });
}

export async function isModeratorAllowed(moderator: string) {
  const existingData = await UserMetadata.getUserMetadata(
    'phoneNumberAllowList',
  );
  const allowList: string[] = existingData.metadata.allowList || [];
  // NOTE: if allowlist is empty then this feature is disabled
  return allowList.includes(moderator) || allowList.length === 0;
}

export async function clearModeratorAllowList() {
  await UserMetadata.clearUserMetadata('phoneNumberAllowList');
}
