import { v4 as uuiv4 } from 'uuid';

export default function renameFile({
  originalName,
  fileType,
}: {
  originalName: string;
  fileType: string;
}): string {
  return `${originalName
    .toLowerCase()
    .substring(0, originalName.lastIndexOf('.'))
    .replace(/\b\d{4}-\d{2}-\d{2} at \d{1,2}\.\d{2}\.\d{2}?(am|pm)\b/g, '')
    .replace(/ /g, '_')}-${uuiv4()}.${fileType}`;
}
