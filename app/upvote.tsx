"use client";

export const Upvote = ({
  id,
  upvotes,
  onUpVote,
}: {
  id: string;
  upvotes: number;
  onUpVote: (id: string) => Promise<void>;
}) => {
  return <button onClick={() => onUpVote(id)}>👆🏿 {upvotes}</button>;
};
