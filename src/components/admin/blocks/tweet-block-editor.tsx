// FILE: src/components/admin/blocks/tweet-block-editor.tsx
'use client';

import { TweetBlock } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface TweetBlockEditorProps {
  block: TweetBlock;
  onChange: (block: TweetBlock) => void;
}

export function TweetBlockEditor({ block, onChange }: TweetBlockEditorProps) {
  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <div>
        <Label>URL del Tweet</Label>
        <Input
          value={block.data.tweetUrl}
          onChange={(e) => onChange({ ...block, data: { tweetUrl: e.target.value } })}
          placeholder="https://twitter.com/user/status/..."
        />
      </div>
    </div>
  );
}
