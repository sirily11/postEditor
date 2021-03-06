import Draft, { ContentBlock, ContentState } from "draft-js";


export const matchesEntityType = (type: string) => type === 'POST-SETTINGS';

export default function strategy(contentBlock: ContentBlock, cb: any, contentState: ContentState) {
  if (!contentState) return;
  contentBlock.findEntityRanges(character => {
    const entityKey = character.getEntity();

    return (
      entityKey !== null &&
      matchesEntityType(contentState.getEntity(entityKey).getType())
    );
  }, cb);
}
