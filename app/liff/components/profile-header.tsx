"use client";

import { useLiff } from "./liff-provider";

export function ProfileHeader() {
  const { profile, isLoggedIn } = useLiff();

  if (!isLoggedIn || !profile) {
    return (
      <header className="flex items-center gap-3 border-b bg-white px-4 py-3">
        <div className="h-10 w-10 animate-pulse rounded-full bg-gray-200" />
        <span className="text-gray-400">読み込み中...</span>
      </header>
    );
  }

  return (
    <header className="flex items-center gap-3 border-b bg-white px-4 py-3">
      {profile.pictureUrl ? (
        <img
          src={profile.pictureUrl}
          alt={profile.displayName}
          className="h-10 w-10 rounded-full"
        />
      ) : (
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-500 text-white">
          {profile.displayName[0]}
        </div>
      )}
      <div>
        <p className="font-semibold">{profile.displayName}</p>
        <p className="text-xs text-gray-500">LINE AI Assistant</p>
      </div>
    </header>
  );
}
