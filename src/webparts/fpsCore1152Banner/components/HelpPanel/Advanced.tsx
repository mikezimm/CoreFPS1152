
import { IHelpTable } from "@mikezimm/fps-library-v2/lib/banner/components/SingleHelpPage/ISinglePageProps";
import { APITricks, BubbleTricks, CommonTricks, SuggestionTricks, createTricksTable, ITrickRow } from "@mikezimm/fps-library-v2/lib/banner/components/SingleHelpPage/makeTricksTable";

export function advancedContent( ): { table: IHelpTable } {

  const QAAPI: ITrickRow = { param: `useQAOutsystemsAPI`, value: `true` , description: `useQAOutsystemsAPI - Use QA Outsystems api endpoint` };
  const ShowUpdateSource: ITrickRow = { param: `showUpdateSource`, value: `true` , description: `showUpdateSource - Summarize State fetch` };

  const table : IHelpTable  = createTricksTable(
    [
      ShowUpdateSource,
      SuggestionTricks,
      BubbleTricks,
      QAAPI,
      APITricks,
      ...CommonTricks,
    ]
  );

  return { table: table };

}


