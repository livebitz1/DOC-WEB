"use client";
import React from "react";
// @ts-ignore
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';

export default function EmojiPicker({ onSelect }: { onSelect: (emoji: string) => void }) {
  return (
    <div style={{ zIndex: 1000 }}>
      {/* @ts-ignore */}
      <Picker data={data} onEmojiSelect={(emoji: any) => onSelect(emoji.native)} />
    </div>
  );
}

